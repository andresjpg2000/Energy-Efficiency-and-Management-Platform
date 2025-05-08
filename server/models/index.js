// This file initializes Sequelize and imports all models for the application
const Sequelize = require('sequelize');
const sequelize = require('../db.config.js'); // Import the sequelize instance

const db = {};

db.sequelize = sequelize; // Sequelize instance  for database connection, queries, etc...

// Import models
db.Supplier = require('./supplier.model.js')(sequelize);
db.Housing = require('./housing.model.js')(sequelize);
db.widgets = require('./widgets.model.js')(sequelize);
db.EnergyConsumption = require('./energy-consumption.model.js')(sequelize);
<<<<<<< HEAD
db.EnergyProductions = require('./energy-productions.model.js')(sequelize);
db.GivenEnergies = require('./given-energies.model.js')(sequelize);
db.EnergyEquipments = require('./given-energies.model.js')(sequelize);
=======
db.User = require('./users.model.js')(sequelize);
db.EnergyEquipment = require('./energy-equipments.model.js')(sequelize);
>>>>>>> 3e2d598 (Implement energy equipment and user management features: add models, controllers, and routes for energy equipment; refactor user routes and controllers for improved functionality.)

// Define associations between models
db.Housing.hasMany(db.EnergyConsumption, {
    foreignKey: 'id_housing',
    sourceKey: 'id_housing',
    onDelete: 'CASCADE', // Delete all energy consumptions when a housing is deleted
});
db.EnergyConsumption.belongsTo(db.Housing, {
    foreignKey: 'id_housing'
});
db.EnergyEquipment.belongsTo(db.Housing, {
    foreignKey: 'housing'
});

<<<<<<< HEAD
db.EnergyEquipments.hasMany(db.GivenEnergies, {
    foreignKey: 'id_equipament',
    sourceKey: 'id',
    onDelete: 'CASCADE', // Delete all given energies when an equipament is deleted
});
db.GivenEnergies.belongsTo(db.EnergyEquipments, {
    foreignKey: 'id_equipament',
    targetKey: 'id'
});



module.exports = db; // Export the db object containing all models and sequelize instance
=======
module.exports = db; // Export the db object containing all models and sequelize instance
>>>>>>> 3e2d598 (Implement energy equipment and user management features: add models, controllers, and routes for energy equipment; refactor user routes and controllers for improved functionality.)
