const express = require('express');
const contactController = require('./contact.controller');
const contactRouter = express.Router();

contactRouter.get('/', contactController.listContact);

contactRouter.get(
  '/:contactId',
  contactController.validateID,
  contactController.getContactById
);

contactRouter.post(
  '/',
  contactController.validateCreateContact,
  contactController.createContact
);

contactRouter.patch(
  '/:contactId',
  contactController.validateID,
  contactController.validateUpdateContact,
  contactController.updateContact
);

contactRouter.delete(
  '/:contactId',
  contactController.validateID,
  contactController.removeContact
);

module.exports = contactRouter;
