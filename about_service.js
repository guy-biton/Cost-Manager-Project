const express = require('express');
const connectDB = require('./db');
const { httpLoggerMiddleware } = require('./logger');

const app = express();

// Ensure the application can read JSON bodies
app.use(express.json());
// Apply Pino logging interceptor
app.use(httpLoggerMiddleware);

// Handle developer team metric retrievals
app.get('/api/about', (req, res) => {
  try {
    const dev1First = process.env.TEAM_MEMBER_1_FIRST || "Lenor";
    const dev1Last = process.env.TEAM_MEMBER_1_LAST || "Unknown";
    
    // Check optional second developer configurations
    const dev2First = process.env.TEAM_MEMBER_2_FIRST || "Unknown";
    const dev2Last = process.env.TEAM_MEMBER_2_LAST || "Unknown";
    
    const team = [
      { first_name: dev1First, last_name: dev1Last }
    ];

    // Push second developer if details exist
    if (dev2First !== "Unknown") {
      team.push({ first_name: dev2First, last_name: dev2Last });
    }

    res.json(team);
  } catch (error) {
    res.status(500).json({ id: Date.now(), message: error.message });
  }
});

// Bind listener port and start database
if (require.main === module) {
  connectDB().then(() => {
    const PORT = process.env.PORT_ABOUT || 3004;
    app.listen(PORT, () => console.log(`About Service running on port ${PORT}`));
  });
}

module.exports = app;
