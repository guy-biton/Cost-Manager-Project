const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB Atlas or localhost
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/cost_manager';
    await mongoose.connect(uri);
    console.log(`Connected to MongoDB`);
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

module.exports = connectDB;
