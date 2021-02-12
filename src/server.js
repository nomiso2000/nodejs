const express = require('express');
const mongoose = require('mongoose');
const contactRouter = require('./contacts/contact.router');
const userRouter = require('./users/user.route');

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
    // this.server.use(express.static('src//public'));
    this.server.use('/images', express.static(__dirname + 'src/public'));
  }
  initRoutes() {
    this.server.use('/contacts', contactRouter);
    this.server.use('/auth', userRouter);
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
