import mongoose from 'mongoose';
import { logger } from '../config/logger.js';

export async function connectDB(uri: string) {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  logger.info('Connected to MongoDB');

  mongoose.connection.on('error', (err) => {
    logger.error({ err }, 'MongoDB connection error');
  });
}
