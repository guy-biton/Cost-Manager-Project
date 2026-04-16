const express = require('express');
const connectDB = require('./db');
const { httpLoggerMiddleware } = require('./logger');
const Log = require('./models/Log');

const app = express();

// Set express up to parse JSON payloads
app.use(express.json());
// Activate custom Pino logging middleware
app.use(httpLoggerMiddleware);

// Fetch all historical logs from MongoDB
app.get('/api/logs', async (req, res) => {
  try {
    const logs = await Log.find({}).lean();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ id: Date.now(), message: error.message });
  }
});

// Boot up server bindings independently
if (require.main === module) {
  connectDB().then(() => {
    const PORT = process.env.PORT_LOGS || 3001;
    app.listen(PORT, () => console.log(`Logs Service running on port ${PORT}`));
  });
}

module.exports = app;
