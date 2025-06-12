import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Addbook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newBook = { title, author, description, image };

      const token = localStorage.getItem("token"); // get token from storage

      const res = await axios.post("http://localhost:5000/api/books", newBook, {
        headers: {
          Authorization: `Bearer ${token}`, // pass token to backend
        },
      });

      console.log(res.data);
      alert("Book added successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error adding book:", error.response?.data || error.message);
      alert("Failed to add book. Please try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4">Add a New Book</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
        <input
          type="url"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700 transition"
        >
          Add Book
        </button>
      </form>
    </div>
  );
};

export default Addbook;
