// This file initializes Sequelize and imports all models for the application
const Sequelize = require('sequelize');
const sequelize = require('../db.config.js'); // Import the sequelize instance

const db = {};

db.sequelize = sequelize; // Sequelize instance  for database connection, queries, etc...

// Import models
db.Supplier = require('./supplier.model.js')(sequelize);
db.Housing = require('./housing.model.js')(sequelize);
db.EnergyConsumption = require('./energy-consumption.model.js')(sequelize);

// Define associations between models
db.Housing.hasMany(db.EnergyConsumption, {
    foreignKey: 'id_housing',
    sourceKey: 'id_housing',
    onDelete: 'CASCADE', // Delete all energy consumptions when a housing is deleted
});
db.EnergyConsumption.belongsTo(db.Housing, {
    foreignKey: 'id_housing'
});

module.exports = db; // Export the db object containing all models and sequelize instance