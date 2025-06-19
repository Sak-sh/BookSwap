const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },     // requester
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },      // book owner
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },       // requested book
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SwapRequest', swapRequestSchema);
