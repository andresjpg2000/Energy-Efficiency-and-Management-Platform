const { DataTypes } = require("sequelize");
const sequelize = require("../db.config.js").sequelize;

module.exports = (sequelize) => {
  const PostalCode = sequelize.define(
    "PostalCode",
    {
      pc: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        validate: {
          isInt: {
            msg: "must be an integer (eg. 1234567)",
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
      location: {
        type: DataTypes.STRING(45),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "must not be empty",
          },
          len: {
            args: [1, 45],
            msg: "must have between 1 and 45 characters",
          },
          is: {
            args: /^[\p{L}0-9\s,.'ºª°-]+$/u,
            msg: "must contain only letters, numbers, spaces, and certain special characters",
          },
        },
      },
    },
    {
      tableName: "postal_codes",
      timestamps: false,
    },
  );

  return PostalCode;
};
