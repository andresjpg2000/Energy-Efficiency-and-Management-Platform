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
        type: DataTypes.STRING, // e.g., 'Alert'
        allowNull: false,
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
      timestamps: true,
      updatedAt: true,
    }
  );

  return Notifications;
};
