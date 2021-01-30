// const express = require('express');
// const { MongoClient, ObjectID } = require('mongodb');
// const Joi = require('joi');

// const PORT = 3000;
// const MONGODB_URL =
//   'mongodb+srv://test:misha432@mangodbwork.eij0e.mongodb.net/<dbname>?retryWrites=true&w=majority';
// const nameDB = 'testDB';

// let db, usersCollection;

// async function main() {
//   const server = express();

//   const client = await MongoClient.connect(MONGODB_URL);
//   db = client.db(nameDB);
//   usersCollection = db.collection('example');

//   server.use(express.json());
//   server.get('/users', getUsers);
//   server.get('/users/:id', getUser);
//   server.post('/users', validateCreateUser, createUser);
//   server.delete('/users/:id', deleteUserByID);
//   server.put('/users/:id', validateUpdateUserByID, updateUserByID);

//   server.listen(PORT, () => {
//     console.log('Server start');
//   });
// }

// async function getUsers(req, res, next) {
//   try {
//     const users = await usersCollection.find().toArray();

//     return res.status(200).json(users);
//   } catch (err) {
//     next(err);
//   }
// }

// async function getUser(req, res, next) {
//   try {
//     const id = req.params.id;

//     if (!ObjectID.isValid(id)) {
//       return res.status(404).send();
//     }

//     const user = await usersCollection.findOne({ _id: new ObjectID(id) });

//     if (!user) {
//       return res.status(404).send();
//     }

//     return res.status(200).json(user);
//   } catch (err) {
//     next(err);
//   }
// }

// async function deleteUserByID(req, res, next) {
//   try {
//     const id = req.params.id;

//     if (!ObjectID.isValid(id)) {
//       return res.status(404).send();
//     }

//     const deleteUser = await usersCollection.deleteOne({
//       _id: new ObjectID(id),
//     });

//     if (!deleteUser.deletedCount) {
//       return res.status(404).send();
//     }

//     return res.status(204).send();
//   } catch (err) {
//     next(err);
//   }
// }

// async function updateUserByID(req, res, next) {
//   const id = req.params.id;

//   if (!ObjectID.isValid(id)) {
//     console.log('error');
//     return res.status(404).send();
//   }

//   const updateResult = await usersCollection.updateOne(
//     {
//       _id: new ObjectID(id),
//     },
//     {
//       $set: req.body,
//     }
//   );
//   console.log(updateResult);
//   return res.status(204).send();
// }

// async function validateCreateUser(req, res, next) {
//   const validationRules = Joi.object({
//     username: Joi.string().required(),
//     email: Joi.string().required(),
//     password: Joi.string().required(),
//   });
//   const validateResult = validationRules.validate(req.body);
//   if (validateResult.error) {
//     return res.status(400).send(validateResult.error);
//   }

//   next();
// }

// async function validateUpdateUserByID(req, res, next) {
//   const validateRules = Joi.object({
//     username: Joi.string(),
//     email: Joi.string(),
//     password: Joi.string(),
//   });
//   const validateResult = validateRules.validate(req.body);
//   if (validateResult.error) {
//     return res.status(400).send(validateResult.error);
//   }
//   next();
// }

// async function createUser(req, res, next) {
//   try {
//     const newUser = await usersCollection.insert(req.body);

//     return res.status(201).json(newUser.ops);
//   } catch (err) {
//     next(err);
//   }
// }
// main();
