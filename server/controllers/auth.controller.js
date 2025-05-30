const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // to generate reset tokens
const { User } = require('../models/index.js');
const { ValidationError } = require('sequelize');
const mailSender = require('../mailSender.js');

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

    const isPasswordValid = await bcrypt.compare(password, user.password); // Compare the password with the hashed password in the database

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign
    (
      { id_user: user.id_user},
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRATION,}
    );

    const refreshToken = jwt.sign
    (
      { id_user: user.id_user },
      process.env.JWT_REFRESH_SECRET, 
      { expiresIn: process.env.JWT_REFRESH_EXPIRATION }
    );
    
    return res.status(200).json(
      {
        success: true,
        accessToken:token,
        refreshToken: refreshToken,
        user: {
          id_user: user.id_user,
          name: user.name,
          email: user.email,
          admin: user.admin,
        }
      }
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ success: false, msg: error.map(e => e.message) });
    } else {
      return res.status(500).json({ success: false, msg: error.message || "Some error occurred at login."});
    };
  }
}

// Function to refresh the token
async function refreshToken(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Unauthorized: no refresh token provided' });  
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    // Check if the user exists, in case the user was deleted before the token expired
    const user = await User.findByPk(decoded.id_user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Generate a new access token
    const newAccessToken = jwt.sign(
      { id_user: user.id_user },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );
    // Generate a new refresh token for extra security
    const newRefreshToken = jwt.sign(
      { id_user: user.id_user },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRATION }
    );

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id_user: user.id_user,
        name: user.name,
        email: user.email,
        admin: user.admin,
      }
    });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
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
    return res.status(401).json({ message: 'Invalid or expire token' });
  }
}
// Function to send reset password email
async function resetPasswordEmail(req, res) {
  if (!req.body || !req.body.email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  const user = await User.findOne({ where: {email:req.body.email} });

  // Showing the same message regardless of whether the user exists or not to prevent user enumeration attacks
  if (!user) {
    return res.status(404).json({ message: 'Password reset link sent to your email' });
  }

  try {
    // Generate a reset token and store it in the user 
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiration = new Date(Date.now() + 60*60*1000) // reset token valid for 1 hour
    console.log(`Reset token for user ${user.id_user}: ${resetToken}, saving...`);
    user.reset_token = resetToken;
    user.reset_token_expires = expiration;
    // update user in the database
    await user.save();
    console.log(`Reset token for user ${user.id_user} saved successfully.`);
    // send email with link to reset password
    const resetLink = `${process.env.FRONTEND_URL}reset-password?token=${resetToken}`;
    await mailSender.sendResetPasswordEmail(user.email, resetLink);
    return res.status(200).json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    return res.status(500).json({ message: 'Error sending password reset email', error: error.message });
  }
}

// function to actually reset the password
async function resetPassword(req, res) {
  if (!req.body || !req.body.token || !req.body.newPassword) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }
  const { token, newPassword } = req.body;

  if (newPassword.length < 8 || newPassword.length > 100) {
    return res.status(400).json({ message: 'Password must be between 8 and 100 characters' });
  }

  try {
    const user = await User.findOne({ where: { reset_token: token } });
    if (!user || !user.reset_token_expires || user.reset_token_expires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.reset_token = null; // clear the reset token
    user.reset_token_expires = null; // clear the expiration date
    await user.save();

    return res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
}

module.exports = {
  login,
  refreshToken,
  getUserInfo,
  resetPasswordEmail,
  resetPassword,
};