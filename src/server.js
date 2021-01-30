const express = require('express');
const mongoose = require('mongoose');
const contactRouter = require('./contacts/contact.router');

require('dotenv').config();

//1.Create server
//2. init global middlewares
//3. Init routes
//4. init db
//5. start listening

module.exports = class ContactServer {
  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    this.initMiddlewates();
    this.initRoutes();
    await this.initDatabase();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewates() {
    this.server.use(express.json());
  }
  initRoutes() {
    this.server.use('/contacts', contactRouter);
  }

  async initDatabase() {
    try {
      await mongoose.connect(process.env.MONGODB_URL);
      console.log('Database connection successful');
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
  startListening() {
    this.server.listen(process.env.PORT, () =>
      console.log('Server is listening')
    );
  }
};