// routes/swapRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  sendSwapRequest,
  getIncomingRequests,
} = require("../controllers/swapRequestController");

router.post("/request", protect, sendSwapRequest);
router.get("/incoming", protect, getIncomingRequests);

module.exports = router;
