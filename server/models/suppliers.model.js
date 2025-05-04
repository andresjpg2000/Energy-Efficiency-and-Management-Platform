// This file defines the Supplier model for the database using Sequelize ORM.
const { DataTypes } = require('sequelize');
const sequelize = require('../db.config.js'); // Import the sequelize instance

module.exports = (sequelize) => {
    const Suppliers = sequelize.define('Suppliers', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        enterprise: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        cost_kWh: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    }, {
        tableName: 'suppliers',
        timestamps: false, // Disable createdAt and updatedAt fields
    });
    
    return Suppliers;
}


