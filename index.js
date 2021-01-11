const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
} = require('./contacts');
const yargs = require('yargs');
const argv = yargs
  .string('action')
  .number('id')
  .string('name')
  .string('email')
  .string('phone')
  .alias('name', 'n')
  .alias('action', 'a')
  .alias('email', 'e')
  .alias('phone', 'p').argv;
function invokeAction({ action, id, name, email, phone }) {
  console.log(action);
  switch (action) {
    case 'list':
      listContacts().then((data) => console.table(data));
      break;

    case 'get':
      getContactById(id).then((data) => console.table(data));
      break;

    case 'add':
      addContact(name, email, phone).then((data) => console.table(data));
      break;

    case 'remove':
      removeContact(id).then((data) => console.table(data));

      break;

    default:
      console.warn('\x1B[31m Unknown action type!');
  }
}

invokeAction(argv);
