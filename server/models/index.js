// This file initializes Sequelize and imports all models for the application

const Sequelize = require('sequelize');
const sequelize = require('../db.config.js'); // Import the sequelize instance

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.Supplier = require('./suppliers.model.js')(sequelize, Sequelize);

module.exports = db; // Export the db object containing all models and sequelize instance