import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("token")));
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    setLoggedIn(Boolean(localStorage.getItem("token")));
    setShowProfileDropdown(false);
  }, [location.pathname]);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("/api/chat/owners", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOwners(res.data.owners);
      } catch (error) {
        console.error("Error fetching owners:", error);
      }
    };

    if (loggedIn) fetchOwners();
  }, [loggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    navigate("/login");
  };

  const hideLogout = location.pathname === "/login" || location.pathname === "/register";

  return (
    <nav className="flex flex-col sm:flex-row justify-between items-center p-4 bg-blue-600 text-white relative">
      <h1 className="text-xl font-bold cursor-pointer" onClick={() => navigate("/")}>
        BookSwap
      </h1>

      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
        <NavLink to="/" className={({ isActive }) => (isActive ? "underline font-semibold" : "block")}>
          Home
        </NavLink>
        <NavLink to="/add" className={({ isActive }) => (isActive ? "underline font-semibold" : "block")}>
          Add Book
        </NavLink>

        {loggedIn && (
          <>
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setShowProfileDropdown((prev) => !prev)} className="focus:outline-none">
                Profile ▼
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-md z-50">
                  <NavLink to="/profile" className="block px-4 py-2 hover:bg-blue-200">
                    My Profile
                  </NavLink>
                  <NavLink to="/requestlist" className="block px-4 py-2 hover:bg-blue-200">
                    Incoming Request List
                  </NavLink>
                  <NavLink to="/sent-requests" className="block px-4 py-2 hover:bg-blue-200">
                    My Sent Requests
                  </NavLink>
                </div>
              )}
            </div>

            {/* Dynamic chat links for owners who sent you requests */}
            {owners.length > 0 ? (
              owners.map((ownerId) => (
                <NavLink
                  key={ownerId}
                  to={`/chat/${ownerId}`}
                  className={({ isActive }) => (isActive ? "underline font-semibold" : "block")}
                >
                  Chat with Owner {ownerId.slice(0, 6)}
                </NavLink>
              ))
            ) : (
              <NavLink to="/chat" className={({ isActive }) => (isActive ? "underline font-semibold" : "block")}>
                Chat
              </NavLink>
            )}

            <NavLink to="/browsebook" className={({ isActive }) => (isActive ? "underline font-semibold" : "block")}>
              Browse Books
            </NavLink>
          </>
        )}

        {!loggedIn && (
          <>
            <NavLink to="/login" className={({ isActive }) => (isActive ? "underline font-semibold" : "block")}>
              Login
            </NavLink>
            <NavLink to="/register" className={({ isActive }) => (isActive ? "underline font-semibold" : "block")}>
              Register
            </NavLink>
          </>
        )}

        {loggedIn && !hideLogout && (
          <button
            onClick={handleLogout}
            className="ml-0 sm:ml-4 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white cursor-pointer"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 
