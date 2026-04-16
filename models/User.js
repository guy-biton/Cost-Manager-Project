const mongoose = require('mongoose');

// Explicitly define properties preventing dropping logic
const userSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  birthday: { type: Date, required: true }
});

// Export mapping integrating into routing components
module.exports = mongoose.model('User', userSchema);
