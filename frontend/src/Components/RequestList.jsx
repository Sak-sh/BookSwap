import React, { useEffect, useState } from "react";
import axios from "axios";

const RequestsList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/swap/incoming", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRequests(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) return <p>Loading requests...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (requests.length === 0) return <p>You have no incoming swap requests.</p>;

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
              <p><strong>From User:</strong> {req.sender?.email || "Unknown"}</p>
              <p><strong>Book Requested:</strong> {req.book?.title || "N/A"}</p>
              <p><strong>Date:</strong> {new Date(req.createdAt).toLocaleString()}</p>
            </div>
            <div className="mt-2 md:mt-0">
              {/* Optional: Accept/Reject actions */}
              <button className="bg-green-600 text-white px-4 py-2 rounded mr-2 hover:bg-green-700">
                Accept
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
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
