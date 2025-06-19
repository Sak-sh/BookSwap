import React, { useEffect, useState } from "react";
import axios from "axios";

const RequestsList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // For button disabling
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to view requests");
        return;
      }

      const res = await axios.get("https://bookswap-1-frontend.onrender.com/api/swap/incoming", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRespond = async (requestId, action) => {
    setActionLoading(requestId);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/swap/respond/${requestId}`,
        { action }, // action: 'accepted' or 'rejected'
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Remove the request from UI after response
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <p>Loading requests...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  if (requests.length === 0)
    return <p>You have no incoming swap requests.</p>;

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
              <p><strong>From User:</strong> {req.fromUser?.username || "Unknown"}</p>
              <p><strong>Book Requested:</strong> {req.book?.title || "N/A"}</p>
              <p><strong>Request Date:</strong> {new Date(req.createdAt).toLocaleString()}</p>
            </div>
            <div className="mt-2 md:mt-0 flex space-x-2">
              <button
                onClick={() => handleRespond(req._id, "accepted")}
                disabled={actionLoading === req._id}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Accept
              </button>
              <button
                onClick={() => handleRespond(req._id, "rejected")}
                disabled={actionLoading === req._id}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RequestsList;
