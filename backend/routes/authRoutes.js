const express = require("express");
const router = express.Router();
const authController = require("../controllers/authcontroller");

// Register
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

// Forgot password
router.post("/forgot-password", authController.forgotPassword);

// Reset password
router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;
