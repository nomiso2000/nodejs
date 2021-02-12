const express = require('express');
const userController = require('./user.controller');
const userRouter = express.Router();

userRouter.post(
  '/register',
  userController.validateCreateUser,
  userController.createUser
);

userRouter.put('/login', userController.validateLogin, userController.login);

userRouter.get('/verify/:token', userController.verifyEmail);

userRouter.patch('/logout', userController.authorize, userController.logOut);

userRouter.patch(
  '/avatars',
  userController.authorize,
  userController.multerHandler(),
  userController.updateUser
);

userRouter.get(
  '/current',
  userController.authorize,
  userController.getCurrentUser
);

module.exports = userRouter;
