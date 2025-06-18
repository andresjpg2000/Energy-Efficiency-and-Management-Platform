// This file contains the database configuration for the application.
const { logging } = require("selenium-webdriver");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    // logging: console.log,
    logging: false,
  },
);

module.exports = sequelize; // Export the sequelize instance to use in other files
