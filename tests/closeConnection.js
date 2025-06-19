require("dotenv").config({ path: "./.env" });
const app = require("../server/app.js");

module.exports = async () => {
  if (app.sequelize) {
    await app.sequelize.close();
    console.log("Database connection closed successfully.");
  }
};
