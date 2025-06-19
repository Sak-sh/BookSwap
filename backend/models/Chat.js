// models/Chat.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
  createdAt: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },       // book owner
  requester: { type: mongoose.Schema.Types.ObjectId, ref: "User" },   // swap requester
  messages: [messageSchema],
  locked: { type: Boolean, default: true },  // your exclusive chat lock flag
}, { timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);
