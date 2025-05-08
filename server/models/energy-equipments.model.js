const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const EnergyEquipment = sequelize.define(
    "EnergyEquipment",
    {
      id_equipment: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      energy_type: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      housing: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "energy_equipments",
      timestamps: false,
    }
  );

  return EnergyEquipment;
};
