const Joi = require('joi');
const userModel = require('./user.model');
const {
  Types: { ObjectId },
} = require('mongoose');
const ms = require('ms');
const sgMail = require('@sendgrid/mail');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const { UnauthorizedError } = require('../helpers/errors.constructors');
const multer = require('multer');
require('dotenv').config();

////////////////////////////////////////////
const { createAvatar } = require('../helpers/avatar-builder');
const path = require('path');
const fsPromises = require('fs').promises;
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class UserController {
  constructor() {
    this._costFactor = 4;
  }

  get createUser() {
    return this._createUser.bind(this);
  }
  get getCurrentUser() {
    return this._getCurrentUser.bind(this);
  }

  //////////////////////////////////METHODS/////////////////

  async _createUser(req, res, next) {
    try {
      const { email, password } = req.body;
      const passwordHash = await bcryptjs.hash(password, this._costFactor);

      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).send('User exist');
      }
      /////////////////////////////////
      const userAvatar = await createAvatar(email);
      const avatarFileName = `${email}_avatar.png`;
      const avatarPath = path.join(
        __dirname,
        `../public/static/${avatarFileName}`
      );
      await fsPromises.writeFile(avatarPath, userAvatar);
      const avatarURL = `http://localhost:3000/images/${avatarFileName}`;
      ////////////////////////

      const user = await userModel.create({
        email,
        password: passwordHash,
        avatarURL: avatarURL,
      });
      await this.sendVerificationEmail(user);
      return res.status(201).json({ id: user._id, email: user.email });
    } catch (err) {
      next(err);
    }
  }

  async verifyEmail(req, res, next) {
    try {
      const { token } = req.params;
      const userToVerify = await userModel.findByVerificationToken(token);

      if (!userToVerify) {
        throw new NotFoundError('User not found');
      }
      await userModel.verifyUser(userToVerify._id);
      return res.status(200).send('You`re user succes');
    } catch (err) {
      next(err);
    }
  }

  async sendEmail(emailToSend, verificationToken) {
    const msg = {
      to: `${emailToSend}`, // Change to your recipient
      from: 'nomiso432@gmail.com', // Change to your verified sender
      subject: 'Email verification',
      text: 'Respect message',
      html: `<a href='http://localhost:3000/auth/verify/${verificationToken}'>CLick here to respect</a>`,
    };
    await sgMail.send(msg);
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await userModel.findByEmail(email);
      if (!user || user.status !== 'Verified') {
        return res.status(401).send('Authentification failed');
      }
      const isPasswordValid = await bcryptjs.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).send('Email or password is wrong');
      }
      const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: ms('2 days'),
      });
      await userModel.updateToken(user._id, token);
      return res.status(200).json({ token, email });
    } catch (err) {
      next(err);
    }
  }

  async logOut(req, res, next) {
    try {
      const user = req.user;
      if (!user._id) {
        throw new UnauthorizedError('User not authorized');
      }
      await userModel.updateToken(user._id, null);
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
  async _getCurrentUser(req, res, next) {
    try {
      return res.status(200).json({ email: req.user.email });
    } catch (err) {
      next(err);
    }
  }

  multerHandler() {
    const storage = multer.diskStorage({
      destination: 'src/public/static',
      filename: function (req, file, cb) {
        const ext = path.parse(file.originalname).ext;
        cb(null, Date.now().toString() + ext);
      },
    });
    const upload = multer({ storage });

    return upload.single('file_example');
  }
  async updateUser(req, res, next) {
    const avatarFileName = req.file.filename;
    req.user.avatarURL = `http://localhost:3000/images/${avatarFileName}`;
    return res.status(200).send({ avatarURL: req.user.avatarURL });
  }

  prepareUserToResponse(users) {
    return users.map((user) => {
      const { _id, username, email } = user;
      return { id: _id, username, email };
    });
  }
  async sendVerificationEmail(user) {
    const verificationToken = uuid.v4();
    await userModel.createVerificationToken(user._id, verificationToken);
    await this.sendEmail(user.email, verificationToken);
  }

  //////////////////////////////////HELPERS/////////////////

  async authorize(req, res, next) {
    try {
      const authorizationHeader = req.get('Authorization');
      const token = authorizationHeader.replace('Bearer ', '');
      let userId;
      try {
        userId = await jwt.verify(token, process.env.JWT_SECRET).id;
      } catch (err) {
        next(new UnauthorizedError('User not authorized'));
      }
      const user = await userModel.findById(userId);
      if (!user || user.token !== token) {
        throw new UnauthorizedError('User not authorized');
      }
      req.user = user;
      req.token = token;

      next();
    } catch (err) {
      next(err);
    }
  }

  //////////////////////////////////VALIDATE/////////////////

  validateCreateUser(req, res, next) {
    const createRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    const validationResult = createRules.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error);
    }
    next();
  }

  validateLogin(req, res, next) {
    const signInRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    const validationResult = signInRules.validate(req.body);
    if (validationResult.error) {
      return res.status(400).json(validationResult.error);
    }
    next();
  }
  validateID(req, res, next) {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send();
    }
    next();
  }
}
module.exports = new UserController();
