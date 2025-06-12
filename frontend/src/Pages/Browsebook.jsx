import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Browsebook = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/books")
      .then((res) => {
        setBooks(res.data);
        setFilteredBooks(res.data);
      })
      .catch((err) => {
        console.error("Error fetching books:", err);
      });
  }, []);

  useEffect(() => {
    const filtered = books.filter((book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [searchQuery, books]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">Browse Books</h2>

      <input
        type="text"
        placeholder="Search by title..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full border px-3 py-2 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-600"
      />

      {filteredBooks.length === 0 ? (
        <p>No books found</p>
      ) : (
        <ul className="space-y-6">
          {filteredBooks.map((book) => (
            <li key={book._id} className="border-b pb-4">
              <h3 className="text-xl font-semibold">
                <Link
                  to={`/books/${book._id}`}
                  className="text-blue-600 hover:underline"
                >
                  {book.title}
                </Link>
              </h3>
              <p className="text-gray-700">Author: {book.author}</p>
              <p>{book.description}</p>
              {book.image && (
                <img
                  src={book.image}
                  alt={book.title}
                  width="150"
                  className="mt-2 rounded"
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Browsebook;
