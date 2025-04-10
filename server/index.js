const express = require("express")

const cors = require("cors")
const app = express()
const port = 3000

// Enable CORS for all routes
app.use(cors());

// Import .env file
require("dotenv").config()

const mysql = require("mysql");
// Create a connection pool for mysql server
const connection = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10, // Set the maximum number of connections in the pool
});

app.get("/users", (req, res) => {

  const query = "SELECT * FROM utilizador";

  connection.query(query, [], (error, results) => {
    if (error) {
      console.error("Error fetching users:", error);
      res.status(500).send("An error occurred while fetching the users.");
      return;
    }

    if (results.length === 0) {
      res.status(404).send("Users table empty.");
      return;
    }

    res.json(results);
  });
});

app.get("/users/:id", (req, res) => {
  const userId = req.params.id;
  console.log(userId);
  const query = "SELECT * FROM utilizador WHERE id_utilizador = ?";

  connection.query(query, [userId], (error, results) => {
    if (error) {
      console.error("Error fetching user:", error);
      res.status(500).send("An error occurred while fetching the user.");
      return;
    }

    if (results.length === 0) {
      res.status(404).send("User not found.");
      return;
    }

    res.json(results[0]);
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

// connection.end()