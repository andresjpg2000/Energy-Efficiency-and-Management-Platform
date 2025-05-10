const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Notifications = sequelize.define(
    "Notifications",
    {
      id_notification: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(45),
        allowNull: false,
        validate: {
          isIn: {
            args: [["alert", "information"]],
            msg: "Type must be either 'alert' or 'information'",
          },
        },
      },
      id_user: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      id_consumption: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      message: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: "notifications",
      timestamps: false,
    }
  );

  return Notifications;
};
