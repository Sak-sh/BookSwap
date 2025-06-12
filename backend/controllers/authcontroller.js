const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000"; // React app URL

// Setup nodemailer transporter (adjust with your SMTP)
const transporter = nodemailer.createTransport({
  service: "Gmail", // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered." });

    const user = new User({ email, password });
    await user.save();

    res.status(201).json({ message: "Registered successfully!" });
  } catch (error) {
    console.error("Registration Error:", error); //  add this
    res.status(500).json({ message: "Server error." });
  }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "No account found, please register first." });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password." });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
res.json({ token, userId: user._id });  // ✅ send userId too
 // send userId explicitly here
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};




exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "No account with that email." });

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    const resetUrl = `${CLIENT_URL}/reset-password/${resetToken}`;

    // Send email
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset",
      text: `You requested a password reset. Click this link to reset your password:\n\n${resetUrl}\n\nIf you did not request this, ignore this email.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Password reset email sent." });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token." });

    user.password = password; // Will be hashed by pre save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password reset successful!" });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};
