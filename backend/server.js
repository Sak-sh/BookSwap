const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");
require("dotenv").config();

// Routes
const bookRoutes = require("./routes/bookRoutes");
const authRoutes = require("./routes/authRoutes");
const swapRequestRoutes = require("./routes/swapRequestRoutes");
const protectRoutes = require("./routes/protectedRoutes");

const setupSocket = require("./socket");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

setupSocket(io);

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/bookswap", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/swap", swapRequestRoutes);
app.use("/api/protected", protectRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
