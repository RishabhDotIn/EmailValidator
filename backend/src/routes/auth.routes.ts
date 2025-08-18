import { Router } from 'express';
import { requestOtpHandler, verifyOtpHandler, refreshHandler, logoutHandler } from '../controllers/auth.controller.js';
import { limitByIP, limitByEmail } from '../middlewares/rateLimit.middleware.js';
import { signAccessToken, verifyRefreshToken } from '../utils/jwt.js';
import { isRefreshTokenValid, rotateRefreshToken } from '../services/token.service.js';
import { setRefreshCookie } from '../utils/responses.js';
import { randomId } from '../utils/crypto.js';

const router = Router();

// 5 per minute per IP, and 3 per hour per email
router.post('/request-otp',
  limitByIP(5, 60 * 1000),
  limitByEmail(3, 60 * 60 * 1000),
  requestOtpHandler
);

router.post('/verify-otp', verifyOtpHandler);

router.post('/refresh', async (req, res) => {
  const token = req.cookies?.['refresh_token'];
  if (!token) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'No refresh token' } });
  try {
    const payload = verifyRefreshToken(token);
    if (payload.type !== 'refresh') return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid token' } });
    const valid = await isRefreshTokenValid(token, payload.sub);
    if (!valid) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid token' } });

    const newJti = randomId(16);
    const rotated = await rotateRefreshToken(token, payload.sub, newJti);
    setRefreshCookie(res, rotated.token, 7 * 24 * 60 * 60 * 1000);
    const access = signAccessToken({ sub: payload.sub, email: '' as any });
    return res.json({ accessToken: access, tokenType: 'Bearer' });
  } catch {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid token' } });
  }
});

router.post('/logout', logoutHandler);

export default router;
