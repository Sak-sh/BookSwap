const express = require("express");
const { protect } = require("../middleware/auth");

const router = express.Router();
const { createBook, getAllBooks, updateBook, deleteBook,getBookById,getBooksByUserId } = require("../controllers/bookController");

router.post("/", protect,createBook);
router.get("/", getAllBooks);
router.get("/mybooks", protect, getBooksByUserId);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);
router.get("/:id",getBookById);

// no protect middleware if you're not using token

module.exports = router;
