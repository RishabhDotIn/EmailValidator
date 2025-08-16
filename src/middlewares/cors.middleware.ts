import cors from 'cors';
import { env } from '../config/env.js';

export const corsMiddleware = cors({
  origin(origin, callback) {
    // Allow no-origin (curl, mobile apps) and exact matches in allowlist
    if (!origin) return callback(null, true);
    if (env.corsOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS not allowed'), false);
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
});
