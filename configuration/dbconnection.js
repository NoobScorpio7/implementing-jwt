const Sequelize = require('sequelize');

const dbconnection = new Sequelize("acmhome", "root", "", {
    host: "localhost",
    dialect: "mysql",
    
});

module.exports = dbconnection;