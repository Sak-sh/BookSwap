const Chat = require('../models/Chat');
const Message = require('../models/Message');

exports.getChatMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatPartnerId } = req.params;

    // Find chat between user and chatPartnerId
    const chat = await Chat.findOne({
      $or: [
        { owner: userId, requester: chatPartnerId },
        { owner: chatPartnerId, requester: userId },
      ],
    });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    // Get messages
    const messages = await Message.find({ chat: chat._id }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { receiverId, content } = req.body;

    // Find chat between user and receiver
    const chat = await Chat.findOne({
      $or: [
        { owner: userId, requester: receiverId },
        { owner: receiverId, requester: userId },
      ],
    });
    if (!chat) return res.status(400).json({ message: 'Chat session not found' });

    // Create message
    const message = new Message({
      chat: chat._id,
      sender: userId,
      content,
    });
    await message.save();

    res.json({ message });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
