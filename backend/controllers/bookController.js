const Book = require("../models/Book");

// Create a new book
const createBook = async (req, res) => {
  const { title, author, description, image } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: "Title and author are required" });
  }

  try {
    const book = new Book({
      title,
      author,
      description,
      image,
      owner: req.user.id, // ✅ dynamically from token
    });

    const saved = await book.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Error saving book", error });
  }
};



// Get all books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
};

// Get a specific book by ID
const getBookById = async (req, res) => {
  try {
    const { id } = req.params; // get the book ID from URL parameters
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book", error });
  }
};
// Update a book by ID
const updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, description, image } = req.body;

  try {
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { title, author, description, image },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: "Error updating book", error });
  }
};

// Delete a book by ID
const deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting book", error });
  }
};

//get only admin books
const getBooksByUserId = async (req, res) => {
  try {
    const books = await Book.find({ owner: req.user.id });
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Error fetching books', error });
  }
};







module.exports = {
  createBook,
  getAllBooks,
  updateBook,
  deleteBook,
  getBookById,
  getBooksByUserId,
};
