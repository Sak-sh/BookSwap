import React, { useState } from "react";
import axios from "axios";
const RequestSwapButton = ({ bookId, ownerId }) => {
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Decode token to get user ID
    const decoded = JSON.parse(atob(token.split(".")[1]));
    setCurrentUserId(decoded.id);
  }, []);

  const handleRequest = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/swap/request",
        { bookId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRequested(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (currentUserId === ownerId) {
    return <p className="text-gray-500 italic">This is your own book</p>;
  }

  if (requested) {
    return <button disabled className="bg-gray-400 text-white py-2 px-4 rounded">Request Sent</button>;
  }

  return (
    <button
      onClick={handleRequest}
      disabled={loading}
      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
    >
      {loading ? "Requesting..." : "Request Swap"}
    </button>
  );
};

export default RequestSwapButton;
