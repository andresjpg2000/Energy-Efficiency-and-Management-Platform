const { DataTypes } = require('sequelize');
const sequelize = require('../db.config.js').sequelize;

module.exports = (sequelize) => {
  const Consumption = sequelize.define('Consumption', {
    id_consumption: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    value: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
      validate: {
        isDecimal: {
          msg: 'Value must be a decimal number with up to 2 decimal places and 8 digits',
        },
        min: {
          args: -999999.99,
          msg: 'consumption_value must be greater than or equal to -999999.99',
        },
        max: {
          args: 999999.99,
          msg: 'consumption_value must be less than or equal to 999999.99',
        },

      },
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: {
          msg: 'consumption_date must be a valid date',
        },
        isAfter: {
          args: '2000-01-01',
          msg: 'consumption_date must be after 2000-01-01',
        },
      },
    },
    // id_supplier: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: 'suppliers', // name of Target model
    //     key: 'id_supplier', // key in Target model that we're referencing
    //   },
    //   validate: {
    //     isInt: {
    //       msg: 'id_supplier must be an integer',
    //     },
    //     min: {
    //       args: 1,
    //       msg: 'id_supplier must be greater than or equal to 1',
    //     },
    //   },
    // },
    id_housing: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'housings', // name of Target model
        key: 'id_housing', // key in Target model that we're referencing
      },
      validate: {
        isInt: {
          msg: 'id_housing must be an integer',
        },
        min: {
          args: 1,
          msg: 'id_housing must be greater than or equal to 1',
        },
      },
    },
  }, {
    tableName: 'energy_consumptions',
    timestamps: false,
  });

  return Consumption;
}