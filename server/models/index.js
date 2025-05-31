const sequelize = require("../db.config.js"); // Import the sequelize instance

const db = {};

db.sequelize = sequelize; // Sequelize instance for database connection, queries, etc...

// Import models
db.Supplier = require("./supplier.model.js")(sequelize);
db.Housing = require("./housing.model.js")(sequelize);
db.widgets = require("./widgets.model.js")(sequelize);
db.EnergyConsumption = require("./energy-consumption.model.js")(sequelize);
db.EnergyProductions = require("./energy-productions.model.js")(sequelize);
db.GivenEnergies = require("./given-energies.model.js")(sequelize);
db.User = require("./users.model.js")(sequelize);
db.EnergyEquipment = require("./energy-equipments.model.js")(sequelize);
db.Notifications = require("./notifications.model.js")(sequelize);
db.PostalCode = require("./postal-code.model.js")(sequelize);

// Define associations between models
db.Housing.hasMany(db.EnergyConsumption, {
  foreignKey: "id_housing",
  sourceKey: "id_housing",
  onDelete: "CASCADE", // Delete all energy consumptions when a housing is deleted
});
db.Housing.hasMany(db.EnergyEquipment, {
  foreignKey: "housing",
  sourceKey: "id_housing",
  onDelete: "CASCADE", // Delete all energy consumptions when a housing is deleted
});
db.Housing.belongsTo(db.PostalCode, {
  foreignKey: "pc",
  targetKey: "pc",
});
db.PostalCode.hasMany(db.Housing, {
  foreignKey: "pc",
  sourceKey: "pc",
});

db.EnergyConsumption.belongsTo(db.Housing, {
  foreignKey: "id_housing",
  targetKey: "id_housing",
});

// Housing and Energy Equipment
db.EnergyEquipment.belongsTo(db.Housing, {
  foreignKey: "housing",
  targetKey: "id_housing",
});

// Energy Equipment and Energy Productions
db.EnergyEquipment.hasMany(db.EnergyProductions, {
  foreignKey: "id_equipment",
  sourceKey: "id_equipment",
  onDelete: "CASCADE", // Delete all productions when an equipment is deleted
});
db.EnergyProductions.belongsTo(db.EnergyEquipment, {
  foreignKey: "id_equipment",
  targetKey: "id_equipment",
});

// Energy Equipment and Given Energies
db.EnergyEquipment.hasMany(db.GivenEnergies, {
  foreignKey: "id_equipment",
  sourceKey: "id_equipment",
  onDelete: "CASCADE", // Delete all given energies when an equipment is deleted
});

db.GivenEnergies.belongsTo(db.EnergyEquipment, {
  foreignKey: "id_equipment",
  targetKey: "id_equipment",
});

// Notifications and Users
db.User.hasMany(db.Notifications, {
  foreignKey: "id_user",
  sourceKey: "id_user",
  onDelete: "CASCADE", // Delete all notifications when a user is deleted
});
db.User.hasMany(db.Housing, {
  foreignKey: "id_user",
  sourceKey: "id_user",
  onDelete: "CASCADE", // Delete all housings when a user is deleted
});

db.Housing.belongsTo(db.User, {
  foreignKey: "id_user",
  targetKey: "id_user",
});

db.Notifications.belongsTo(db.User, {
  foreignKey: "id_user",
  targetKey: "id_user",
});

// widgets and Users
db.User.hasMany(db.widgets, {
  foreignKey: "id_user",
  sourceKey: "id_user",
  onDelete: "CASCADE", // Delete all widgets when a user is deleted
});
db.widgets.belongsTo(db.User, {
  foreignKey: "id_user",
  targetKey: "id_user",
});

// Notifications and Energy Consumption
db.EnergyConsumption.hasMany(db.Notifications, {
  foreignKey: "id_consumption",
  sourceKey: "id_consumption",
  onDelete: "CASCADE", // Delete all notifications when a consumption is deleted
});
db.Notifications.belongsTo(db.EnergyConsumption, {
  foreignKey: "id_consumption",
  targetKey: "id_consumption",
});

module.exports = db;
