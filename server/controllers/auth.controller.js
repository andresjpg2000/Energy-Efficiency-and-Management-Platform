const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models/index.js');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password); // Compare the password with the hashed password in the database

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign
    (
      { id_user: user.id_user, name: user.name, admin: user.admin },
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRATION,}
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // change to true if using HTTPS
      maxAge: 60 * 60 * 1000, // 1 hour
      // sameSite: 'Strict',  CSRF protection
    });

    res.json({
      message: 'Login successful',
    });

  } catch (error) {
    next(error);
  }
}

// Function to get the user info
async function getUserInfo(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      id_user: payload.id_user,
      name: payload.name,
      admin: payload.admin,
    })
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expire token' });
  }
}

// Function to logout the user
async function logout(req, res) {
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
}

module.exports = {
  login,
  getUserInfo,
  logout,
};