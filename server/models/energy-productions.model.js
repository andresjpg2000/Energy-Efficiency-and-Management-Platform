// This file defines the EnergyProduction model for the database using Sequelize ORM.
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const EnergyProduction = sequelize.define(
    "EnergyProduction",
    {
      id_production: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        validate: {
          isInt: {
            msg: "id_production must be an integer",
          },
          min: {
            args: [1],
            msg: "id_production must be greater than 0",
          },
        },
      },
      id_equipment: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "energy_equipments",
          key: "id_equipment",
        },
        validate: {
          isInt: {
            msg: "id_equipment must be an integer",
          },
          min: {
            args: [1],
            msg: "id_equipment must be greater than 0",
          },
        },
      },
      value: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
        validate: {
          isDecimal: {
            msg: "value must be a decimal number with up to 2 decimal places and 8 digits",
          },
          min: {
            args: [0], // No negative values for production
            msg: "value must be greater than or equal to 0",
          },
          max: {
            args: [999999.99],
            msg: "value must be less than or equal to 999999.99",
          },
        },
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        validate: {
          // Corrected from 'validators' to 'validate'
          isDate: {
            msg: "date must be a valid date",
          },
          isAfter: {
            args: "2000-01-01",
            msg: "date must be after 2000-01-01",
          },
        },
      },
    },
    {
      tableName: "energy_productions",
      timestamps: false, // Disable createdAt and updatedAt fields
    }
  );

  return EnergyProduction;
};
