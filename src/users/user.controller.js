const Joi = require('joi');
const userModel = require('./user.model');
const {
  Types: { ObjectId },
} = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../helpers/errors.constructors');

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

      const user = await userModel.create({
        email,
        password: passwordHash,
      });
      console.log('USER', user);
      return res.status(201).json({ id: user._id, email: user.email });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await userModel.findByEmail(email);
      if (!user) {
        return res.status(401).send('Email or password is wrong');
      }
      const isPasswordValid = await bcryptjs.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).send('Email or password is wrong');
      }
      const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: 2 * 24 * 60 * 60, //two days
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

  prepareUserToResponse(users) {
    return users.map((user) => {
      const { _id, username, email } = user;
      return { id: _id, username, email };
    });
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
