// users.model.js

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id_user: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notEmpty: true,
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 100],
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [6, 100],
        },
      },
      admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      notification_settings: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      two_factor_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // if false 2FA isnt enabled
      },
    },
    {
      tableName: "users",
      timestamps: false,
    }
  );

  return User;
};
