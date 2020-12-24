const fs = require('fs');
const { promises: fsPromises } = fs;
const path = require('path');

const contactsPath = path.join(__dirname, './db/contacts.json');
const contacts = fsPromises.readFile(contactsPath, 'utf-8');
async function listContacts() {
  const parsedContacts = JSON.parse(await contacts);
  return parsedContacts;
}

async function getContactById(contactId) {
  const parsedContacts = JSON.parse(await contacts);
  return parsedContacts.find((el) => contactId === el.id);
}

async function removeContact(contactId) {
  const parsedContacts = JSON.parse(await contacts);
  const filteredContacts = parsedContacts.filter((el) => contactId !== el.id);
  const contactsJSON = JSON.stringify(filteredContacts);
  fsPromises.writeFile(contactsPath, contactsJSON, (err) => {
    if (err) console.log(err);
  });
  return filteredContacts;
}

async function addContact(name, email, phone) {
  const parsedContacts = JSON.parse(await contacts);
  const newContact = { id: parsedContacts.length + 1, name, email, phone };
  parsedContacts.push(newContact);
  const contactsJSON = JSON.stringify(parsedContacts);
  fsPromises.writeFile(contactsPath, contactsJSON, (err) => {
    if (err) console.log(err);
  });

  return parsedContacts;
}
module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
