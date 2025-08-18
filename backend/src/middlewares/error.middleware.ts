import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import createError from 'http-errors';
import { logger } from '../config/logger.js';

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(createError(404, 'Route not found'));
}

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  let status = err.status || 500;
  let code = err.code || 'INTERNAL_ERROR';
  let message = err.message || 'Something went wrong';
  let details: any = undefined;

  if (err instanceof ZodError) {
    status = 400;
    code = 'VALIDATION_ERROR';
    message = 'Invalid request';
    details = err.flatten();
  }

  if (status >= 500) {
    logger.error({ err, path: req.path }, 'Unhandled error');
  } else {
    logger.warn({ err, path: req.path }, 'Handled error');
  }

  res.status(status).json({ error: { code, message, details } });
}
