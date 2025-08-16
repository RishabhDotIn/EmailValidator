import { createServer } from 'http';
import app from './app.js';
import { connectDB } from './db/connect.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

async function start() {
  try {
    await connectDB(env.MONGODB_URI);
    const server = createServer(app);
    server.listen(env.PORT, () => {
      logger.info({ port: env.PORT, env: env.NODE_ENV }, 'Server started');
    });
  } catch (err) {
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  }
}

start();
