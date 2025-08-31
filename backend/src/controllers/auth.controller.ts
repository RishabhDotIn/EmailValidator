import { Request, Response, NextFunction } from 'express';
import { RequestOtpSchema, VerifyOtpSchema } from '../validators/auth.validators.js';
import { requestOtp, verifyOtp } from '../services/auth.service.js';
import { setRefreshCookie, clearRefreshCookie } from '../utils/responses.js';
import { REFRESH_TOKEN_EXPIRES_DAYS } from '../utils/constants.js';
import { verifyRefreshToken } from '../utils/jwt.js';
import { isRefreshTokenValid, rotateRefreshToken, revokeRefreshToken } from '../services/token.service.js';
import { randomId } from '../utils/crypto.js';

export async function requestOtpHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = RequestOtpSchema.parse(req.body);
    await requestOtp(email);
    // Generic response to avoid email enumeration
    res.json({ ok: true });
  } catch (err) { next(err); }
}

export async function verifyOtpHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, otp } = VerifyOtpSchema.parse(req.body);
    const result = await verifyOtp(email, otp);
    if (!result) return res.status(400).json({ error: { code: 'INVALID_OTP', message: 'Invalid or expired OTP' } });

    const { user, access, refresh, refreshExpiresAt } = result;
    setRefreshCookie(res, refresh, REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000);
    res.json({ accessToken: access, tokenType: 'Bearer', user: { id: String(user._id), email: user.email, name: user.name ?? null } });
  } catch (err) { next(err); }
}

export async function refreshHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.['refresh_token'];
    if (!token) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'No refresh token' } });
    const payload = verifyRefreshToken(token);
    if (payload.type !== 'refresh') return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid token' } });
    const valid = await isRefreshTokenValid(token, payload.sub);
    if (!valid) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid token' } });

    const newJti = randomId(16);
    const rotated = await rotateRefreshToken(token, payload.sub, newJti);
    setRefreshCookie(res, rotated.token, 7 * 24 * 60 * 60 * 1000);
    // Issue new access token
    res.json({ accessToken: '' }); // will be set by service in router
  } catch (err) { next(err); }
}

export async function logoutHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.['refresh_token'];
    if (token) {
      const payload = (() => { try { return verifyRefreshToken(token); } catch { return null; } })();
      if (payload && payload.sub) await revokeRefreshToken(token, payload.sub);
    }
    clearRefreshCookie(res);
    res.json({ ok: true });
  } catch (err) { next(err); }
}
