const express = require('express');
const connectDB = require('./db');
const { httpLoggerMiddleware } = require('./logger');

const User = require('./models/User');
const Cost = require('./models/Cost');

const app = express();

// Parse JSON and apply logger
app.use(express.json());
app.use(httpLoggerMiddleware);

// Main post route checking validations
app.post('/api/add', async (req, res) => {
  try {
    const { id, first_name, last_name, birthday } = req.body;
    
    // Check parameters to satisfy Q1
    if (!id || !first_name || !last_name || !birthday) {
      return res.status(400).json({ id: Date.now(), message: 'Missing required parameters' });
    }

    // Verify user doesn't already exist
    const existing = await User.findOne({ id: Number(id) });
    if (existing) {
      return res.status(400).json({ id: Date.now(), message: 'User already exists' });
    }

    // Create the new user document
    const newUser = await User.create({ id: Number(id), first_name, last_name, birthday });
    
    const result = newUser.toJSON();
    delete result._id;

    res.json(result);
  } catch (error) {
    res.status(500).json({ id: Date.now(), message: error.message });
  }
});

// Get specified user profile and calculate total
app.get('/api/users/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    
    // Find matching user natively
    const user = await User.findOne({ id }).lean();
    if (!user) {
      return res.status(404).json({ id: Date.now(), message: 'User not found' });
    }

    // Accumulate total costs securely for user
    const totalCostsAgg = await Cost.aggregate([
      { $match: { userid: id } },
      { $group: { _id: null, total: { $sum: "$sum" } } }
    ]);
    
    const total = totalCostsAgg.length > 0 ? totalCostsAgg[0].total : 0;

    res.json({
      first_name: user.first_name,
      last_name: user.last_name,
      id: user.id,
      total: total
    });
  } catch (error) {
    res.status(500).json({ id: Date.now(), message: error.message });
  }
});

// Return array of all users securely
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, '-_id -__v').lean();
    res.json(users);
  } catch (error) {
    res.status(500).json({ id: Date.now(), message: error.message });
  }
});

// Initialize database and bind port
if (require.main === module) {
  connectDB().then(() => {
    const PORT = process.env.PORT_USERS || 3002;
    app.listen(PORT, () => console.log(`Users Service running on port ${PORT}`));
  });
}

module.exports = app;
