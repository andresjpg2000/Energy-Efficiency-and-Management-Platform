// server.js
const app = require("./app.js");
const db = require("./models/index.js");

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Connection has been established successfully.");

    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
