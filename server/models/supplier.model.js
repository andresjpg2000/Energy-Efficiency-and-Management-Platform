// This file defines the Supplier model for the database using Sequelize ORM.
const { DataTypes, INTEGER } = require("sequelize");
const sequelize = require("../db.config.js"); // Import the sequelize instance

module.exports = (sequelize) => {
  const Supplier = sequelize.define(
    "Supplier",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        validate: {
          notEmpty: {
            msg: "id must not be empty",
          },
          isInt: {
            msg: "id must be an integer",
          },
          min: {
            args: [1],
            msg: "id must be greater than 0",
          },
          max: {
            args: [2147483647],
            msg: "id must be less than 2147483647",
          },
        },
      },
      enterprise: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "enterprise must not be empty",
          },
          len: {
            args: [1, 45],
            msg: "enterprise must have between 1 and 45 characters",
          },
        },
      },
      cost_kWh: {
        type: DataTypes.DECIMAL(8, 4),
        allowNull: false,
        validate: {
          isFloat: {
            msg: "cost_kWh must be a float number",
          },
          min: {
            args: [0.01],
            msg: "cost_kWh must be greater than 0",
          },
        },
      },
    },
    {
      tableName: "suppliers",
      timestamps: false, // Disable createdAt and updatedAt fields
    },
  );

  return Supplier;
};
