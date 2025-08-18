import { Response } from 'express';
import { REFRESH_COOKIE_NAME } from './constants.js';
import { env } from '../config/env.js';

export function setRefreshCookie(res: Response, token: string, maxAgeMs: number) {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: maxAgeMs
  });
}

export function clearRefreshCookie(res: Response) {
  res.clearCookie(REFRESH_COOKIE_NAME, { path: '/' });
}
