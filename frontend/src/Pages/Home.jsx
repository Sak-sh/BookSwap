import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      className="h-screen bg-cover bg-center flex flex-col justify-center items-center text-white px-4"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1470&q=80')",
      }}
    >
      <div className="bg-black bg-opacity-50 p-8 rounded-lg max-w-xl text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Welcome to BookSwap</h1>
        <p className="mb-8 text-lg sm:text-xl">
          Swap books easily with others and discover your next great read.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/Browsebook")}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded font-semibold transition"
          >
            Browse Books
          </button>
          <button
            onClick={() => navigate("/add")}
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded font-semibold transition"
          >
            Add a Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
