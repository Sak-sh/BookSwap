import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";

// Swap Button Component
const RequestSwapButton = ({ bookId, ownerId }) => {
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserId(decoded.id || decoded._id);
      } catch (e) {
        console.error("Invalid token", e);
      }
    }
  }, []);

  const handleRequest = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://bookswap-mi28.onrender.com/api/swap/request",
        { bookId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRequested(true);
    } catch (err) {
      console.error("Swap request error:", err);
      setError(err.response?.data?.message || "Failed to send swap request");
    } finally {
      setLoading(false);
    }
  };

  if (currentUserId === ownerId) {
    return <p className="italic text-gray-500">You can't request your own book.</p>;
  }

  if (requested) {
    return <p className="text-green-600 font-semibold">Swap request sent!</p>;
  }

  return (
    <>
      <button
        onClick={handleRequest}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        {loading ? "Requesting..." : "Request Swap"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </>
  );
};

const Bookdetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserId(decoded.id || decoded._id);
      } catch (e) {
        console.error("Invalid token", e);
      }
    }
  }, []);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/books/${id}`);
        setBook(res.data);
      } catch (err) {
        setError("Failed to fetch book details");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const ownerId = book?.owner?._id || book?.owner;

  const initiateChat = async (otherUserId) => {
    if (!currentUserId) {
      alert("Please log in to chat.");
      return;
    }
    if (currentUserId === otherUserId) {
      alert("This is your own book.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/chat/start/${otherUserId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ Navigate to chat page with that user
      navigate(`/chat/${otherUserId}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to initiate chat");
    }
  };

  if (loading) return <p>Loading book details...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!book) return <p>Book not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-8">
      {book.image && (
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-64 object-cover rounded mb-4"
        />
      )}
      <h1 className="text-3xl font-bold">{book.title}</h1>
      <p className="italic text-gray-700">Author: {book.author}</p>
      <p className="mt-4">{book.description}</p>

      <div className="mt-6 flex space-x-4 items-center">
        <RequestSwapButton bookId={book._id} ownerId={ownerId} />

        

        <Link
          to="/browsebook"
          className="ml-auto text-indigo-600 hover:underline"
        >
          Back to Books List
        </Link>
      </div>
    </div>
  );
};

export default Bookdetails;
