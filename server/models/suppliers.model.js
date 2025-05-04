// This file defines the Supplier model for the database using Sequelize ORM.
const { DataTypes } = require('sequelize');
const sequelize = require('../db.config.js'); // Import the sequelize instance

module.exports = (sequelize) => {
    const Supplier = sequelize.define('Supplier', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        empresa: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        custo_kWh: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    }, {
        tableName: 'fornecedor',
        timestamps: false, // Disable createdAt and updatedAt fields
    });
    
    return Supplier;
}


