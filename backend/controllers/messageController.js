const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  try {
    const { sender, content } = req.body;
    const newMessage = new Message({ sender, content });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate('sender', 'username');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
