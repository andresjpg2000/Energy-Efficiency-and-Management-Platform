// Import the users data model
const users = require("../models/users.model.js");

let getAllUsers = (req, res) => {
  // return all users if no query parameter is provided
  res.json(users);
};

let getUserById = (req, res) => {};

let validateUsersBodyData = (req, res, next) => {};

let addUser = (req, res) => {};

let updateUser = (req, res) => {};

module.exports = {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  validateUsersBodyData,
};
