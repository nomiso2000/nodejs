const express = require('express');
const UserController = require('../contacts');
const userRouter = express.Router();

userRouter.get('/', UserController.listContact);

userRouter.get('/:contactId', UserController.getById);

userRouter.post(
  '/',
  UserController.validateAddContact,
  UserController.addContact
);

userRouter.patch(
  '/:contactId',
  UserController.validateUpdateContact,
  UserController.updateContact
);

userRouter.delete('/:contactId', UserController.removeContact);

module.exports = userRouter;
