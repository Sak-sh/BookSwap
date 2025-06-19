const SwapRequest = require("../models/SwapRequest");
const Book = require("../models/Book");
const Chat = require('../models/Chat');

// Send a new swap request
exports.sendSwapRequest = async (req, res) => {
  const { bookId } = req.body;

  try {
    const book = await Book.findById(bookId).lean();

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!book.owner) {
      return res.status(400).json({ message: "Book owner not found" });
    }

    if (book.owner.toString() === req.user.id) {
      return res.status(400).json({ message: "You can't request your own book" });
    }

    const alreadyRequested = await SwapRequest.findOne({
      book: bookId,
      sender: req.user.id,
      status: "pending",
    });

    if (alreadyRequested) {
      return res.status(400).json({ message: "Request already sent and pending" });
    }

    const newRequest = new SwapRequest({
      book: bookId,
      sender: req.user.id,
      owner: book.owner,
      status: "pending",
    });

    await newRequest.save();

    res.status(201).json({ message: "Request sent successfully", request: newRequest });
  } catch (err) {
    console.error("Send swap request failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all swap requests received by the logged-in user (book owners)
// Updated getReceivedRequests to include accepted requests
exports.getReceivedRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await SwapRequest.find({
      owner: userId,
      status: { $in: ["pending", "accepted"] } // <-- Include accepted
    })
      .populate("sender", "name email")
      .populate("book", "title author")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error("Get received requests failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Accept a swap request
// Accept a swap request
exports.acceptRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    const request = await SwapRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    request.status = "accepted";  // <-- this should be "accepted"
    await request.save();

    res.json({ message: "Request accepted", request });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Reject a swap request
exports.rejectRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    const request = await SwapRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    request.status = "rejected";  // <-- this should be "rejected"
    await request.save();

    res.json({ message: "Request rejected", request });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};




// Get all swap requests sent by logged-in user
exports.getSentRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await SwapRequest.find({ sender: userId })
      .populate("owner", "name email")
      .populate("book", "title author")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error("Get sent requests failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Owner initiates chat with requester after accepting request
exports.startChat = async (req, res) => {
  try {
    const userId = req.user.id; // logged in user (owner)
    const { requesterId } = req.body;

    if (!requesterId) {
      return res.status(400).json({ success: false, message: 'Requester ID is required' });
    }

    // Confirm there's an accepted request between these users
    const request = await SwapRequest.findOne({
      owner: userId,
      sender: requesterId,
      status: 'accepted',
    });

    if (!request) {
      return res.status(400).json({ success: false, message: 'No accepted request found' });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({ owner: userId, requester: requesterId });
    if (chat) {
      return res.json({ success: true, message: 'Chat already started', chatId: chat._id });
    }

    // Create new chat and lock it
    chat = new Chat({ owner: userId, requester: requesterId, locked: true });
    await chat.save();

    res.json({ success: true, message: 'Chat started', chatId: chat._id });
  } catch (err) {
    console.error('startChat error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
