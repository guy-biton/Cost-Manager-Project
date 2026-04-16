const mongoose = require('mongoose');

// Ensure logging captures metrics consistently natively
const logSchema = new mongoose.Schema({
  method: String,
  url: String,
  status: Number,
  duration: Number,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

// Tie Log interface into mongoose organically
module.exports = mongoose.model('Log', logSchema);
