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
        enterprise: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: {
                  msg: "enterprise must not be empty"
                },
                len: {
                  args: [1, 45],
                  msg: "enterprise must have between 1 and 45 characters"
                }
            }
        },
        cost_kWh: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                isFloat: {
                  msg: "cost_kWh must be a float"
                },
                min: {
                  args: [0.01],
                  msg: "cost_kWh must be greater than 0"
                }
            }
        },
    }, {
        tableName: 'suppliers',
        timestamps: false, // Disable createdAt and updatedAt fields
    });
    
    return Supplier;
}


