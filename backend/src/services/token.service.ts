import dayjs from 'dayjs';
import { RefreshToken } from '../models/RefreshToken.js';
import { sha256WithPepper } from '../utils/crypto.js';
import { signRefreshToken } from '../utils/jwt.js';
import { REFRESH_TOKEN_EXPIRES_DAYS } from '../utils/constants.js';

export async function issueRefreshToken(userId: string, jti: string) {
  const expiresAt = dayjs().add(REFRESH_TOKEN_EXPIRES_DAYS, 'day').toDate();
  const expiresInSeconds = REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60;
  const token = signRefreshToken({ sub: userId, jti }, expiresInSeconds);
  const tokenHash = sha256WithPepper(token);
  await RefreshToken.create({ userId, tokenHash, expiresAt, revoked: false });
  return { token, expiresAt };
}

export async function rotateRefreshToken(oldToken: string, userId: string, newJti: string) {
  const oldHash = sha256WithPepper(oldToken);
  await RefreshToken.updateOne({ userId, tokenHash: oldHash, revoked: false }, { $set: { revoked: true } });
  return issueRefreshToken(userId, newJti);
}

export async function revokeRefreshToken(token: string, userId: string) {
  const hash = sha256WithPepper(token);
  await RefreshToken.updateOne({ userId, tokenHash: hash, revoked: false }, { $set: { revoked: true } });
}

export async function isRefreshTokenValid(token: string, userId: string) {
  const hash = sha256WithPepper(token);
  const doc = await RefreshToken.findOne({ userId, tokenHash: hash, revoked: false });
  return !!doc;
}
