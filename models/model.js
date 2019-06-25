const Sequelize = require('sequelize');
const connection = require('../config/dbconnection');
const bcrypt = require('bcrypt');

const userSchema = {
  name: {
    type: Sequelize.STRING
  },
  email: {
      type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING
  }
};



const User = connection.define('user', userSchema);



  User.sync();

  module.exports = User;