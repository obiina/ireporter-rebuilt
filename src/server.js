require('dotenv').config();
const mongoose = require('mongoose');
const { loadConfig } = require('./config');
const { createApp } = require('./app');

async function start() {
  const config = loadConfig();
  await mongoose.connect(config.mongoUri);
  const app = createApp(config);
  const server = app.listen(config.port, () => {
    console.log(`iReporter API listening on port ${config.port}`);
  });
  const shutdown = async () => {
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

start().catch(error => {
  console.error('Unable to start iReporter:', error.message);
  process.exit(1);
});
