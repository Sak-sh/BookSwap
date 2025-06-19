import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SentRequestsList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSentRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://bookswap-mi28.onrender.com/api/swap/sent", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load requests");
      } finally {
        setLoading(false);
      }
    };

    fetchSentRequests();
  }, []);

  const handleChatClick = (ownerId) => {
    // Navigate to chat page with owner's userId
    navigate(`/chat/${ownerId}`);
  };

  if (loading) return <p>Loading your swap requests...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (requests.length === 0) return <p>You have not sent any swap requests.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Swap Requests</h2>
      <ul>
        {requests.map((req) => (
          <li key={req._id} className="border rounded p-4 mb-3">
            <p>
              <strong>Book:</strong> {req.book?.title || "N/A"}
            </p>
            <p>
              <strong>Owner:</strong> {req.owner?.email || "Unknown"}
            </p>
            <p>
              <strong>Status:</strong> {req.status}
            </p>

            {req.status === "accepted" && (
              <>
                <p className="text-green-600 font-semibold">
                  Your request was accepted!
                </p>
                <button
                  onClick={() => handleChatClick(req.owner?._id || req.owner)}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Chat with Owner
                </button>
              </>
            )}
            {req.status === "rejected" && (
              <p className="text-red-600 font-semibold">Your request was rejected.</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SentRequestsList;
