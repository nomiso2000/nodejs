const fs = require('fs');
const { promises: fsPromises } = fs;
const path = require('path');
const Joi = require('joi');
const { func } = require('joi');

const contactsPath = path.join(__dirname, '../db/contacts.json');
const contacts = fsPromises.readFile(contactsPath, 'utf-8');

async function listContact(req, res, next) {
  const parsedContacts = JSON.parse(await contacts);
  return res.status(200).json(parsedContacts);
}

async function getById(req, res, next) {
  const targetContactIndex = await getContactById(req.params.contactId, res);
  const parsedContacts = JSON.parse(await contacts);
  return res.status(200).json(parsedContacts[targetContactIndex]);
}

async function getContactById(contactId, res) {
  const id = parseInt(contactId);
  const parsedContacts = JSON.parse(await contacts);
  const targetContactIndex = parsedContacts.findIndex((user) => user.id === id);
  if (targetContactIndex === -1) {
    return res.status(404).send({ message: 'Not found' });
  }
  return targetContactIndex;
}

async function removeContact(req, res, next) {
  const targetContactIndex = await getContactById(req.params.contactId, res);
  const parsedContacts = JSON.parse(await contacts);
  parsedContacts.splice(targetContactIndex, 1);
  const contactsJSON = JSON.stringify(parsedContacts);
  fsPromises.writeFile(contactsPath, contactsJSON, (err) => {
    if (err) console.log(err);
  });
  return res.status(200).json({ message: 'contact deleted' });
}

async function addContact(req, res, next) {
  const parsedContacts = JSON.parse(await contacts);
  const { name, email, phone } = req.body;
  const newContact = { id: parsedContacts.length + 1, name, email, phone };
  parsedContacts.push(newContact);
  const contactsJSON = JSON.stringify(parsedContacts);
  fsPromises.writeFile(contactsPath, contactsJSON, (err) => {
    if (err) console.log(err);
  });

  return res.status(201).json(newContact);
}

async function updateContact(req, res, next) {
  const targetContactIndex = await getContactById(req.params.contactId, res);
  const parsedContacts = JSON.parse(await contacts);
  parsedContacts[targetContactIndex] = {
    ...parsedContacts[targetContactIndex],
    ...req.body,
  };
  const contactsJSON = JSON.stringify(parsedContacts);
  fsPromises.writeFile(contactsPath, contactsJSON, (err) => {
    if (err) console.log(err);
  });
  return res.status(200).send(parsedContacts[targetContactIndex]);
}

function validateAddContact(req, res, next) {
  const createContactRules = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
  });
  const result = createContactRules.validate(req.body);
  if (result.error) {
    return res.status(400).send({ message: 'missing required name field' });
  }
  next();
}

function validateUpdateContact(req, res, next) {
  const updateContactRules = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
  });

  const result = updateContactRules.validate(req.body);
  if (result.error) {
    return res.status(400).send({ message: 'missing fields' });
  }
  next();
}

module.exports = {
  getById,
  updateContact,
  validateUpdateContact,
  validateAddContact,
  listContact,
  getContactById,
  removeContact,
  addContact,
};
