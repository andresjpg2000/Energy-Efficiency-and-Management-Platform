// Import the users data model
const users = require("../models/users.model.js");

let getAllUsers = (req, res) => {
  // return all users if no query parameter is provided
  res.json(users);
};

let getUserById = (req, res) => {
  // find the user by id
  const user = users.find((u) => u.id === parseInt(req.params.id));

  // if user is not found, return 404
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  // return the user
  res.json(user);
};

let validateUsersBodyData = (req, res, next) => {
  const { email, name, password, admin } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  // check if email is valid
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  // check if password is valid
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }
  // check if name is valid
  if (name.length < 2) {
    return res
      .status(400)
      .json({ message: "Name must be at least 2 characters" });
  }
  // check if email is unique
  const emailExists = users.some((user) => user.email === email);
  if (emailExists) {
    return res.status(400).json({ message: "Email already exists" });
  }
  if (admin !== 0 && admin !== 1) {
    return res.status(400).json({ message: "Admin must be 0 or 1" });
  }

  next();
};

let addUser = (req, res) => {
  const { email, name, password, admin } = req.body;

  const newUser = {
    id: users.length + 1,
    email,
    name,
    password,
    admin: admin || false,
  };

  users.push(newUser);

  res.status(201).json({ location: `/users/${newUser.id}` });
};

let updateUser = (req, res) => {
  // find the user by id
  const user = users.find((u) => u.id === parseInt(req.params.id));
  // if user is not found, return 404
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  // update the user with the new data
  const { email, name, password, admin } = req.body;
  user.email = email;
  user.name = name;
  user.password = password;
  user.admin = admin || false;

  // return the updated user
  res.status(204).end();
};

module.exports = {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  validateUsersBodyData,
};
