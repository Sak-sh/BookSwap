import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RequestsList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://bookswap-mi28.onrender.com/api/swap/incoming", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/swap/accept/${requestId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status: "accepted" } : req
        )
      );
      alert("Request Accepted");
    } catch (err) {
      alert("Failed to accept request");
      console.error(err);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/swap/reject/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests((prev) => prev.filter((req) => req._id !== requestId));
      alert("Request rejected and removed.");
    } catch (err) {
      alert("Failed to reject request");
      console.error(err);
    }
  };

  // Navigate to chat page with requester ID (the other user)
  const handleStartChat = (request) => {
    // `request.sender._id` = requester id (the user who sent request)
    // current user is owner, chatting with requester
    if (!request.sender?._id) {
      alert("Invalid chat user");
      return;
    }
    navigate(`/chat/${request.sender._id}`);
  };

  if (loading) return <p>Loading requests...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (requests.length === 0) return <p>No incoming swap requests.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">Incoming Swap Requests</h2>
      <ul>
        {requests.map((req) => (
          <li
            key={req._id}
            className="border rounded p-4 mb-3 flex flex-col md:flex-row md:justify-between md:items-center"
          >
            <div>
              <p>
                <strong>From User:</strong> {req.sender?.email || "Unknown"}
              </p>
              <p>
                <strong>Book Requested:</strong> {req.book?.title || "N/A"}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(req.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong> {req.status}
              </p>
            </div>
            <div className="mt-2 md:mt-0 flex flex-col space-y-2">
              <button
                onClick={() => handleAccept(req._id)}
                disabled={req.status === "accepted"}
                className={`px-4 py-2 rounded ${
                  req.status === "accepted"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {req.status === "accepted" ? "Accepted" : "Accept"}
              </button>
              <button
                onClick={() => handleReject(req._id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Reject
              </button>
             {req.status === "accepted" && (
  <button
    onClick={() => navigate(`/chat/${req.sender._id}`)} // use sender's userId here
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
  >
    Chat
  </button>
)}

            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RequestsList;
