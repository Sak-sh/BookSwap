import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [myBooks, setMyBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchMyBooks = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("https://bookswap-mi28.onrender.com/api/books/mybooks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMyBooks(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const handleUpdate = (bookId) => {
   navigate(`/books/edit/${bookId}`);

  };

  const handleDelete = async (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`http://localhost:5000/api/books/${bookId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Book deleted successfully");
        fetchMyBooks(); // refresh list
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete the book");
      }
    }
  };

  if (loading) return <p className="text-center mt-10">Loading your books...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">My Books</h2>
      {myBooks.length === 0 ? (
        <p className="text-center text-gray-600">No books found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {myBooks.map((book) => (
            <div
              key={book._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              {book.image && (
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4 flex flex-col flex-grow">
                <h3
                  onClick={() => handleUpdate(book._id)}
                  className="text-xl font-semibold text-blue-600 cursor-pointer hover:underline"
                >
                  {book.title}
                </h3>
                <p className="text-gray-700 italic mt-1">Author: {book.author}</p>
                <p className="mt-2 text-gray-600 flex-grow">{book.description}</p>

                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={() => handleUpdate(book._id)}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
