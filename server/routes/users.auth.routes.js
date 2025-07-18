const express = require("express");
const router = express.Router();
const authController = require("../controllers/users.auth.controller.js");

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/verify-2fa", authController.verify2FA);

router.post("/refresh-token", authController.refreshToken);

router.post("/reset-password-email", authController.resetPasswordEmail);

router.post("/reset-password", authController.resetPassword);

module.exports = router;
