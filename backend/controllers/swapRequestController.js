// controllers/swapRequestController.js
const SwapRequest = require("../models/SwapRequest");
const Book = require("../models/Book");

exports.sendSwapRequest = async (req, res) => {
  const { bookId } = req.body;

  try {
    const book = await Book.findById(bookId).lean();
    console.log("Book fetched:", book);
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
    });

    if (alreadyRequested) {
      return res.status(400).json({ message: "Request already sent" });
    }

    const newRequest = new SwapRequest({
      book: bookId,
      sender: req.user.id,
      receiver: book.owner,
    });

    await newRequest.save();

    res.status(201).json({ message: "Request sent successfully", request: newRequest });
  } catch (err) {
    console.error("Send swap request failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getIncomingRequests = async (req, res) => {
  try {
    const requests = await SwapRequest.find({ receiver: req.user.id })
      .populate("book")
      .populate("sender", "email");

    res.json(requests);
  } catch (err) {
    console.error("Error fetching incoming requests:", err);
    res.status(500).json({ message: "Server error" });
  }
};

