// This file defines the widgets model for the database using Sequelize ORM.
const { DataTypes } = require('sequelize');
const sequelize = require('../db.config.js'); // Import the sequelize instance

module.exports = (sequelize) => {
    const widgets = sequelize.define('widgets', {
        id_user: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            validate: {
                notEmpty: {
                  msg: "id_user must not be empty"
                },
                isInt: {
                  msg: "id_user must be an integer"
                },
                min: {
                  args: [1],
                  msg: "id_user must be greater than 0"
                }
            }
        },
        title: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: {
                  msg: "title must not be empty"
                },
            }
        },
        body: {
            type: DataTypes.STRING,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                  msg: "type must not be empty"
                },
            }
        },
    }, {
        tableName: 'widgets',
        timestamps: false, // Disable createdAt and updatedAt fields
    });
    
    return widgets;
}


