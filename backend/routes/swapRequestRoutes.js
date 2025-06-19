const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  sendSwapRequest,
  getReceivedRequests,
  acceptRequest,
  rejectRequest,
  startChat,
  getSentRequests
} = require("../controllers/swapRequestController");

router.post("/request", protect, sendSwapRequest);
router.get("/incoming", protect, getReceivedRequests);
router.get("/sent", protect, getSentRequests);

// Accept a swap request (keep PUT)
router.put("/accept/:requestId", protect, acceptRequest);

// Reject a swap request (better as DELETE, but you can keep PUT if you want)
router.delete("/reject/:requestId", protect, rejectRequest);
router.post("/start-chat", protect, startChat);


module.exports = router;
