// This file initializes Sequelize and imports all models for the application
const Sequelize = require('sequelize');
const sequelize = require('../db.config.js'); // Import the sequelize instance

const db = {};
db.Sequelize = Sequelize; // Sequelize class for things like DataTypes, etc...
db.sequelize = sequelize; // Sequelize instance  for database connection, queries, etc...

// Import models
db.Suppliers = require('./suppliers.model.js')(sequelize, Sequelize);

module.exports = db; // Export the db object containing all models and sequelize instance