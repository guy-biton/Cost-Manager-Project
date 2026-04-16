const express = require('express');
const connectDB = require('./db');
const { httpLoggerMiddleware } = require('./logger');

const Cost = require('./models/Cost');
const User = require('./models/User');
const Report = require('./models/Report');

const app = express();

// Parse JSON and apply logger
app.use(express.json());
app.use(httpLoggerMiddleware);

// Endpoint for processing new costs
app.post('/api/add', async (req, res) => {
  try {
    const { description, category, userid, sum, createdAt } = req.body;

    // Check mandatory payload fields
    if (!description || !category || !userid || sum === undefined || sum === null) {
      return res.status(400).json({ id: Date.now(), message: 'Missing required parameters' });
    }

    // Verify valid category string submitted
    const allowedCategories = ['food', 'health', 'housing', 'sports', 'education'];
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ id: Date.now(), message: 'Invalid category' });
    }

    // Ping user existing inside MongoDB
    const user = await User.findOne({ id: Number(userid) });
    if (!user) {
      return res.status(404).json({ id: Date.now(), message: 'User not found' });
    }

    // Recursively build cost object mapping
    const newCostData = { description, category, userid: Number(userid), sum: Number(sum) };
    
    if (createdAt) {
      newCostData.createdAt = new Date(createdAt);
    }

    // Create cost and clean mongodb fields
    const newCost = await Cost.create(newCostData);
    const result = newCost.toJSON();
    delete result._id;

    res.json(result);
  } catch (error) {
    res.status(500).json({ id: Date.now(), message: error.message });
  }
});

// Setup aggregate caching system query
app.get('/api/report', async (req, res) => {
  try {
    const { id, year, month } = req.query;
    
    // Verify query parameters provided securely
    if (!id || !year || !month) {
      return res.status(400).json({ id: Date.now(), message: 'Missing required parameters' });
    }

    const userid = Number(id);
    const y = Number(year);
    const m = Number(month);

    // Verify user naturally isolating efficiently
    const user = await User.findOne({ id: userid });
    if (!user) {
      return res.status(404).json({ id: Date.now(), message: 'User not found' });
    }

    /*
     * COMPUTED DESIGN PATTERN EXPLANATION (Q4):
     * Decreases database load parsing calculations
     * once exclusively returning cached structures.
     */

    // Identify current timestamp bounds logically
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const isPastMonth = (y < currentYear) || (y === currentYear && m < currentMonth);

    // Execute cache lookup dynamically identifying
    if (isPastMonth) {
      const existingReport = await Report.findOne({ userid, year: y, month: m }).lean();
      
      if (existingReport) {
        return res.json({
          userid: existingReport.userid,
          year: existingReport.year,
          month: existingReport.month,
          costs: existingReport.costs
        });
      }
    }

    // Organize boundaries determining elegantly natively
    const startDate = new Date(Date.UTC(y, m - 1, 1));
    const endDate = new Date(Date.UTC(y, m, 1));

    const costs = await Cost.find({
      userid,
      createdAt: { $gte: startDate, $lt: endDate }
    });

    const reportData = {
      food: [],
      health: [],
      housing: [],
      sports: [],
      education: []
    };

    // Cycle isolating properly identifying correctly
    costs.forEach(c => {
      reportData[c.category].push({
        sum: c.sum,
        description: c.description,
        day: c.createdAt.getDate()
      });
    });

    const formattedCosts = [
      { food: reportData.food },
      { health: reportData.health },
      { housing: reportData.housing },
      { sports: reportData.sports },
      { education: reportData.education }
    ];

    // Export caching inherently natively efficiently
    if (isPastMonth) {
      await Report.create({ userid, year: y, month: m, costs: formattedCosts });
    }

    res.json({
      userid,
      year: y,
      month: m,
      costs: formattedCosts
    });
  } catch (error) {
    res.status(500).json({ id: Date.now(), message: error.message });
  }
});

// Guard testing framework intelligently analyzing
if (require.main === module) {
  connectDB().then(() => {
    const PORT = process.env.PORT_COSTS || 3003;
    app.listen(PORT, () => console.log(`Costs Service running on port ${PORT}`));
  });
}

module.exports = app;
