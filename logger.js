const pino = require('pino');
const Log = require('./models/Log');

// Initialize Pino logger for console formatting
const logger = pino({
  transport: {
    target: 'pino-pretty', 
    options: { colorize: true }
  }
});

// Express middleware tracking request durations
const httpLoggerMiddleware = async (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', async () => {
    const duration = Date.now() - start;
    const msg = `${req.method} ${req.originalUrl} - ${res.statusCode} [${duration}ms]`;
    
    // Log error levels based on HTTP status
    if (res.statusCode >= 400) {
      logger.error(msg);
    } else {
      logger.info(msg);
    }

    try {
      // Save the generated log document to MongoDB
      await Log.create({
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: duration,
        message: msg
      });
    } catch(err) {
      logger.error('Failed to write log to MongoDB: ' + err.message);
    }
  });

  next();
};

module.exports = { logger, httpLoggerMiddleware };
