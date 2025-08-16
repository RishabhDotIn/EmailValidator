import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import { verifyAccessToken } from '../utils/jwt.js';

export type AuthUser = { id: string; email: string };

declare global {
  namespace Express {
    interface Request { user?: AuthUser }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const auth = req.header('Authorization') || '';
  const [, token] = auth.split(' ');
  if (!token) return next(createError(401, 'Unauthorized', { code: 'UNAUTHORIZED' }));
  try {
    const payload = verifyAccessToken(token);
    if (payload.type !== 'access') throw new Error('Invalid token');
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch {
    next(createError(401, 'Unauthorized', { code: 'UNAUTHORIZED' }));
  }
}
