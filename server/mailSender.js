const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS // Your email password or app password
  }
});

const sendResetPasswordEmail = async (email, resetLink) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    text: `You have requested a password reset.\n\nPlease click the link below to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.`,
    html: `
      <p>You have requested a password reset.</p>
      <p><a href="${resetLink}">Click here to reset your password</a></p>
      <p>If you did not request this, please ignore this email.</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.response);
  } catch (err) {
    console.error('Failed to send reset email:', err);
    throw err;
  }
};

const send2FACodeEmail = async (email, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your 2FA Code',
    text: `Login attempt.\n\nPlease use the code below to confirm your login:\n\n${code}\n\nIf you did not request this, please ignore this email.`,
    html: `
      <p>Login attempt.</p>
      <p>Please use this code to confirm your login</p>
      <p><strong>${code}</strong></p>
      <p>If you did not request this, please ignore this email.</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('2FA code email sent:', info.response);
  } catch (err) {
    console.error('Failed to send 2FA code email:', err);
    throw err;
  }
};

module.exports = {
  sendResetPasswordEmail,
  send2FACodeEmail,
};