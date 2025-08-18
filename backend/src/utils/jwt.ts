import jwt from 'jsonwebtoken';
import type { Secret, SignOptions } from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../config/env.js';
import { ACCESS_TOKEN_EXPIRES_IN } from './constants.js';

export type AccessTokenPayload = { sub: string; email: string; type: 'access' };
export type RefreshTokenPayload = { sub: string; jti: string; type: 'refresh' };

const AccessPayloadSchema = z.object({
  sub: z.string(),
  email: z.string(),
  type: z.literal('access')
});

const RefreshPayloadSchema = z.object({
  sub: z.string(),
  jti: z.string(),
  type: z.literal('refresh')
});

export function signAccessToken(payload: Omit<AccessTokenPayload, 'type'>) {
  const options: SignOptions = { expiresIn: ACCESS_TOKEN_EXPIRES_IN };
  return jwt.sign({ ...payload, type: 'access' }, env.JWT_ACCESS_SECRET as Secret, options);
}

export function signRefreshToken(payload: Omit<RefreshTokenPayload, 'type'>, expiresInSeconds: number) {
  const options: SignOptions = { expiresIn: expiresInSeconds };
  return jwt.sign({ ...payload, type: 'refresh' }, env.JWT_REFRESH_SECRET as Secret, options);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET as Secret);
  if (typeof decoded === 'string') throw new Error('Invalid token payload');
  return AccessPayloadSchema.parse(decoded);
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET as Secret);
  if (typeof decoded === 'string') throw new Error('Invalid token payload');
  return RefreshPayloadSchema.parse(decoded);
}
