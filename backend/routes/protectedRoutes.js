const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

router.get("/", protect, (req, res) => {
  res.json({ message: "Protected route works", user: req.user });
});

module.exports = router;
