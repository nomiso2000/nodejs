const Joi = require('joi');
const contactModel = require('./contact.model');
const {
  Types: { ObjectId },
} = require('mongoose');

class ContactController {
  async listContact(req, res, next) {
    try {
      const contacts = await contactModel.find();

      return res.status(200).json(contacts);
    } catch (err) {
      next(err);
    }
  }

  async getContactById(req, res, next) {
    try {
      const id = req.params.contactId;

      const contact = await contactModel.findById(id);

      if (!contact) {
        return res.status(404).send();
      }

      return res.status(200).json(contact);
    } catch (err) {
      next(err);
    }
  }

  async createContact(req, res, next) {
    try {
      const newContact = await contactModel.create(req.body);
      return res.status(201).json(newContact);
    } catch (err) {
      next(err);
    }
  }

  async updateContact(req, res, next) {
    const id = req.params.contactId;

    const updateResult = await contactModel.findContactByIdAndUpdate(
      id,
      req.body
    );
    if (!updateResult) {
      return res.status(404).send();
    }

    return res.status(204).send(updateResult);
  }

  async removeContact(req, res, next) {
    try {
      const id = req.params.contactId;

      const deletedContact = await contactModel.findByIdAndDelete(id);

      if (!deletedContact) {
        return res.status(404).send();
      }

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  validateCreateContact(req, res, next) {
    const validationRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    });
    const validateResult = validationRules.validate(req.body);
    if (validateResult.error) {
      return res.status(400).send(validateResult.error);
    }

    next();
  }

  validateUpdateContact(req, res, next) {
    const validateRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
    }).min(1);
    const validateResult = validateRules.validate(req.body);
    if (validateResult.error) {
      return res.status(400).send(validateResult.error);
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
module.exports = new ContactController();
