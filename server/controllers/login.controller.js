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

    const token = jwt.sign(
      { id_user: user.id_user, admin: user.admin },
      process.env.JWT_SECRET, 
      {
      expiresIn: process.env.JWT_EXPIRATION,
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id_user: user.id_user,
        email: user.email,
        name: user.name,
        admin: user.admin,
      },
    });

  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
};