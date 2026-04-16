const mongoose = require('mongoose');

// Define explicitly approved Cost schema parameters
const costSchema = new mongoose.Schema({
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['food', 'health', 'housing', 'sports', 'education']
  },
  userid: { type: Number, required: true },
  sum: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Export generic document wrapper object
module.exports = mongoose.model('Cost', costSchema);
