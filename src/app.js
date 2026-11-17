const express = require('express');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');
const { notFound, errorHandler } = require('./middleware/errors');

function createApp(config) {
  const app = express();
  app.locals.config = config;
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(express.json({ limit: '20kb' }));
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 200, standardHeaders: 'draft-7', legacyHeaders: false }));
  app.get('/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/reports', reportRoutes);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
