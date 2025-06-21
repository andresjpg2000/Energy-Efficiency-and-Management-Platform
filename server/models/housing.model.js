// This file defines the Housing model for the database using Sequelize ORM.
const { DataTypes } = require("sequelize");
const sequelize = require("../db.config.js").sequelize;

module.exports = (sequelize) => {
  const Housing = sequelize.define(
    "Housing",
    {
      id_housing: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "address must not be empty",
          },
          len: {
            args: [1, 100],
            msg: "address must have between 1 and 100 characters",
          },
          is: {
            args: /^[\p{L}0-9\s,.'ºª°-]+$/u,
            msg: "address must contain only letters, numbers, spaces, and certain special characters",
          },
        },
      },
      pc: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        references: {
          model: "postal_codes", // name of Target model
          key: "pc", // key in Target model that we're referencing
        },
        allowNull: false,
        validate: {
          isInt: {
            msg: "must be an integer",
          },
          min: {
            args: [1000000],
            msg: "must be greater than 1000",
          },
          max: {
            args: [9999999],
            msg: "must be less than 9999999",
          },
        },
      },
      building_type: {
        type: DataTypes.ENUM("flat", "house", "studio"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["flat", "house", "studio"]],
            msg: "building_type must be either flat, house, or studio",
          },
        },
      },
      id_user: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        references: {
          model: "users", // name of Target model
          key: "id_user", // key in Target model that we're referencing
        },
        allowNull: false,
        validate: {
          isInt: {
            msg: "id_user must be an integer",
          },
          min: {
            args: [1],
            msg: "id_user must be greater than 0",
          },
        },
      },
      id_supplier: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        references: {
          model: "suppliers",
          key: "id_supplier",
        },
        allowNull: true,
        validate: {
          isInt: {
            msg: "id_supplier must be an integer",
          },
          min: {
            args: [1],
            msg: "id_supplier must be greater than 0",
          },
        },
      },
      custom_supplier_price: {
        type: DataTypes.DECIMAL(8, 4),
        allowNull: true,
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
      tableName: "housings",
      timestamps: false, // Disable createdAt and updatedAt fields
    },
  );

  return Housing;
};
