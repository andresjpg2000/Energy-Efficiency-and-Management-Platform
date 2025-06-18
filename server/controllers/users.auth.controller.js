const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models/index.js");
const { ValidationError } = require("sequelize");
const mailSender = require("../mailSender.js");

// Store 2fa verification codes, in the future use redis or a database
let twoFactorCodes = new Map();

// Criar um novo utilizador
async function register(req, res, next) {
  try {
    const { email, name, password, admin } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Verificar se o email já está registado
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Encriptar a password

    const newUser = await User.create({
      email,
      name,
      password: hashedPassword,
      admin: admin || 0,
    });
    res
      .status(201)
      .json({ message: "User created successfully", id_user: newUser.id_user });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    if (!req.body || !req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const { email, password } = req.body;
    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ where: { email: cleanEmail } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password); // Compare the password with the hashed password in the database

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    // If the user has 2FA enabled
    if (user.two_factor_enabled) {
      try {
        // Generate a temporary token for 2FA verification
        const tempToken = jwt.sign(
          { id_user: user.id_user, type: "2fa" },
          process.env.JWT_2FA_SECRET,
          { expiresIn: process.env.JWT_2FA_EXPIRATION },
        );
        // Send the 2FA code to the user's email
        const verificationCode = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit verification code
        // Store the verification code
        twoFactorCodes.set(user.id_user, verificationCode);

        await mailSender.send2FACodeEmail(user.email, verificationCode);
        return res.status(200).json({
          message: "Two factor authentication link sent to your email",
          user: {
            id_user: user.id_user,
            two_factor_enabled: user.two_factor_enabled,
          },
          tempToken,
        });
      } catch (error) {
        return res.status(500).json({
          message: "Error generating 2FA token",
          error: error.message,
        });
      }
    }
    // If the user does not have 2FA enabled, generate the access and refresh tokens
    const token = jwt.sign({ id_user: user.id_user }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });

    const refreshToken = jwt.sign(
      { id_user: user.id_user },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRATION },
    );

    return res.status(200).json({
      success: true,
      accessToken: token,
      refreshToken: refreshToken,
      user: {
        id_user: user.id_user,
        name: user.name,
        email: user.email,
        admin: user.admin,
        notification_settings: user.notification_settings,
        two_factor_enabled: user.two_factor_enabled,
      },
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res
        .status(400)
        .json({ success: false, msg: error.map((e) => e.message) });
    } else {
      return res.status(500).json({
        success: false,
        msg: error.message || "Some error occurred at login.",
      });
    }
  }
}

// Function to verify the 2FA token
async function verify2FA(req, res) {
  if (!req.body || !req.body.token || !req.body.code) {
    return res.status(400).json({ message: "Token is required" });
  }
  const { token, code } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_2FA_SECRET);
    // Check if the token is valid and of type 'reset'
    if (!decoded || decoded.type !== "2fa") {
      return res.status(401).json({
        message: "Invalid or expired two factor authentication token",
      });
    }
    const user = await User.findByPk(decoded.id_user);
    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired two factor authentication token",
      });
    }
    // Check if the code matches the one stored in memory
    const storedCode = twoFactorCodes.get(decoded.id_user);
    if (!storedCode || storedCode != code) {
      return res
        .status(401)
        .json({ message: "Invalid two factor authentication code" });
    }
    // Remove the code from memory after verification
    twoFactorCodes.delete(user.id_user);

    // Generate the access token
    const accessToken = jwt.sign(
      { id_user: user.id_user },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION },
    );

    const refreshToken = jwt.sign(
      { id_user: user.id_user },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRATION },
    );

    return res.status(200).json({
      success: true,
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: {
        id_user: user.id_user,
        name: user.name,
        email: user.email,
        admin: user.admin,
        two_factor_enabled: user.two_factor_enabled,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error with the two factor authentication.",
      error: error.message,
    });
  }
}

// Function to refresh the token
async function refreshToken(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res
      .status(401)
      .json({ message: "Unauthorized: no refresh token provided" });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    // Check if the refresh token is not expired
    if (!decoded || Date.now() >= decoded.expiresIn * 1000) {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    // Check if the user exists, in case the user was deleted before the token expired
    const user = await User.findByPk(decoded.id_user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Generate a new access token
    const newAccessToken = jwt.sign(
      { id_user: user.id_user },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION },
    );
    // Generate a new refresh token for extra security
    // Stop replacing the old refresh token with a new one if you want to logout user after token refresh expires
    // Right now the refresh token is valid until the user logs out manually
    // const newRefreshToken = jwt.sign(
    //   { id_user: user.id_user },
    //   process.env.JWT_REFRESH_SECRET,
    //   { expiresIn: process.env.JWT_REFRESH_EXPIRATION }
    // );

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: refreshToken,
      user: {
        id_user: user.id_user,
        name: user.name,
        email: user.email,
        admin: user.admin,
      },
    });
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }
}

// Function to send reset password email
async function resetPasswordEmail(req, res) {
  if (!req.body || !req.body.email) {
    return res.status(400).json({ message: "Email is required" });
  }
  const cleanEmail = req.body.email.trim().toLowerCase();
  const user = await User.findOne({ where: { email: cleanEmail } });

  // Showing the same message regardless of whether the user exists or not to prevent user enumeration attacks
  if (!user) {
    return res
      .status(404)
      .json({ message: "Password reset link sent to your email" });
  }

  try {
    // Generate a reset token with "reset" type to prevent confusion with other tokens
    const resetToken = jwt.sign(
      { id_user: user.id_user, type: "reset" },
      process.env.JWT_RESET_SECRET,
      { expiresIn: process.env.JWT_RESET_EXPIRATION },
    );
    // send email with link to reset password
    const resetLink = `${process.env.FRONTEND_URL}reset-password?token=${resetToken}`;
    await mailSender.sendResetPasswordEmail(user.email, resetLink);
    return res
      .status(200)
      .json({ message: "Password reset link sent to your email" });
  } catch (error) {
    return res.status(500).json({
      message: "Error sending password reset email",
      error: error.message,
    });
  }
}

// function to actually reset the password
async function resetPassword(req, res) {
  if (!req.body || !req.body.token || !req.body.newPassword) {
    return res
      .status(400)
      .json({ message: "Token and new password are required" });
  }
  const { token, newPassword } = req.body;

  if (newPassword.length < 8 || newPassword.length > 100) {
    return res
      .status(400)
      .json({ message: "Password must be between 8 and 100 characters" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
    // Check if the token is valid and of type 'reset'
    if (!decoded || decoded.type !== "reset") {
      return res
        .status(401)
        .json({ message: "Invalid or expired reset token" });
    }
    const user = await User.findByPk(decoded.id_user);
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res
      .status(200)
      .json({ message: "Password has been reset successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error resetting password", error: error.message });
  }
}

module.exports = {
  register,
  login,
  verify2FA,
  refreshToken,
  resetPasswordEmail,
  resetPassword,
  twoFactorCodes, // Export the twoFactorCodes map for testing purposes
};
