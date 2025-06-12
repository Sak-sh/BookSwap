const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const bookRoutes = require("./routes/bookRoutes");
const authRoutes = require("./routes/authRoutes");
const protectRoutes = require("./routes/protectedRoutes");
//const protectedRoutes = require('./routes/protectedRoutes'); // example path


const swapRequestRoutes = require("./routes/swapRequestRoutes");
const app = express();
app.use(cors());
app.use(express.json());
//app.use('/api', protectedRoutes);
// Connect to MongoDB
mongoose.connect("mongodb+srv://sakshichavan005:dFdBufFYycsxfOWV@cluster0.t4cykaq.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Use routes
app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/swap", swapRequestRoutes);
app.use("/api/protected", protectRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
