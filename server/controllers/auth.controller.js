const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models/index.js');
const { ValidationError } = require('sequelize');

async function login(req, res, next) {
  try {
    if (!req.body || !req.body.email || !req.body.password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    const isPasswordValid = await bcrypt.compareSync(password, user.password); // Compare the password with the hashed password in the database

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign
    (
      { id_user: user.id_user, name: user.name, admin: user.admin },
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRATION,}
    );

    return res.status(200).json({success: true, accessToken:token});
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ success: false, msg: error.map(e => e.message) });
    } else {
      res.status(500).json({ success: false, msg: error.message || "Some error occurred at login."});
    };
  }
}

// Function to get the user info
async function getUserInfo(req, res, next) {
  const header = req.headers['x-access-token'] || req.headers['authorization'] || req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: 'Unauthorized: no token provided' });
  }
  const token = header.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ where: { id_user: payload.id_user } });
    if (!user) {
      return res.status(404).json({ message: 'User information not found' });
    }
    res.json({
      id_user: user.id_user,
      name: user.name,
      email: user.email,
      admin: user.admin,
    })
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expire token' });
  }
}

// Function to logout the user
async function logout(req, res) {
  // incomplete
  res.json({ message: 'Logout successful' });
}

module.exports = {
  login,
  getUserInfo,
  logout,
};