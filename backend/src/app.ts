import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { corsMiddleware } from './middlewares/cors.middleware.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';
import healthRouter from './routes/health.routes.js';
import authRouter from './routes/auth.routes.js';

const app = express();

app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(corsMiddleware);

// Root - show basic info instead of 404
app.get('/', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'EmailValidator API',
    health: '/health',
    auth: '/v1/auth/*'
  });
});

// Routes
app.use('/health', healthRouter);
app.use('/v1/auth', authRouter);
app.use('/v1/email-validation', authRouter);

// 404
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

export default app;
