const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Get messages between current user and chat partner
router.get('/:chatPartnerId/messages', chatController.getChatMessages);

// Send message to chat partner
router.post('/send-message', chatController.sendMessage);

module.exports = router;
