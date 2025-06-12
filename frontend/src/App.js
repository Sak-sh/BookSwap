import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import Addbook from "./Pages/Addbook";
import Bookdetails from "./Pages/Bookdetails";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Profile from "./Pages/Profile";
import Chatbox from "./Components/Chatbox";
import Browsebook from "./Pages/Browsebook";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import EditBook from "./Pages/EditBook"; // ✅ Make sure path is correct
import RequestList from "./Components/RequestList"

// PrivateRoute component
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

// PublicRoute component for login/register pages
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/" replace /> : children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Private routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/add"
          element={
            <PrivateRoute>
              <Addbook />
            </PrivateRoute>
          }
        />
        <Route
          path="/books/:id" // ✅ View single book
          element={
            <PrivateRoute>
              <Bookdetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/books/edit/:id" // ✅ Edit book
          element={
            <PrivateRoute>
              <EditBook />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat/:userId"
          element={
            <PrivateRoute>
              <Chatbox />
            </PrivateRoute>
          }
        />
        <Route path="/books/:id" element={<Bookdetails />} />
<Route path="/browsebook/update/:id" element={<EditBook />} />
<Route path="/profile" element={<Profile />} />

        <Route
          path="/browsebook"
          element={
            <PrivateRoute>
              <Browsebook />
            </PrivateRoute>
          }
        />
    

      <Route
          path="/requestlist"
          element={
            <PrivateRoute>
              <RequestList />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
