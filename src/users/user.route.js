const express = require('express');
const userController = require('./user.controller');
const userRouter = express.Router();

userRouter.post(
  '/register',
  userController.validateCreateUser,
  userController.createUser
);

userRouter.put('/login', userController.validateLogin, userController.login);

userRouter.patch('/logout', userController.authorize, userController.logOut);

userRouter.get(
  '/current',
  userController.authorize,
  userController.getCurrentUser
);

module.exports = userRouter;
