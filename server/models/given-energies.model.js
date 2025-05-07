// This file defines the Housing model for the database using Sequelize ORM.
const { DataTypes } = require('sequelize');
const sequelize = require('../db.config.js').sequelize; 

module.exports = (sequelize) => {
    const givenEnergies = sequelize.define('givenEnergies', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            validate: {
                isInt: {
                  msg: "id must be an integer"
                },
                min: {
                  args: [1],
                  msg: "id must be greater than 0"
                }
            }
        },
        value: {
            type: DataTypes.DECIMAL(8, 2),
            allowNull: false,
            validate: {
                isDecimal: {
                  msg: "value must be a decimal number with up to 2 decimal places and 8 digits"
                },
                min: {
                  args: -1,
                  msg: "value must be greater than or equal to 0"
                },
                max: {
                  args: 999999.99,
                  msg: "value must be less than or equal to 999999.99"
                }
            }
        },
        id_equipament: {
            type: DataTypes.INTEGER,
            foreignKey: true,
            references: {
                model: 'energy-equipments', // name of Target model
                key: 'id_equipament', // key in Target model that we're referencing
            },
            allowNull: false,
            validate: {
                isInt: {
                  msg: "id_equipament must be an integer"
                },
                min: {
                  args: [1],
                  msg: "id_equipament must be greater than 0"
                }
            }
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            validators: {
                isDate: {
                  msg: "date must be a valid date"
                },
                isAfter: {
                  args: "2000-01-01",
                  msg: "date must be after 2000-01-01"
                }
            }
        },
    }, {
        tableName: 'given-energies',
        timestamps: false, // Disable createdAt and updatedAt fields
    });
    
    return givenEnergies;
}