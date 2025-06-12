import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("token")));
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    setLoggedIn(Boolean(localStorage.getItem("token")));
    setShowProfileDropdown(false); // close dropdown on route change
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
            {/* Clickable Dropdown Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowProfileDropdown((prev) => !prev)}
                className="focus:outline-none"
              >
                Profile ▼
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-md z-50">
                  <NavLink
                    to="/profile"
                    className="block px-4 py-2 hover:bg-blue-200"
                  >
                    My Profile
                  </NavLink>
                  <NavLink
                    to="/requestlist"
                    className="block px-4 py-2 hover:bg-blue-200"
                  >
                    Request List
                  </NavLink>
                </div>
              )}
            </div>

            <NavLink to="/chat/123" className={({ isActive }) => (isActive ? "underline font-semibold" : "block")}>
              Chat
            </NavLink>
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
