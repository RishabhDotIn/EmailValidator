import { Router } from 'express';
import { apiKeyAuth } from '../middlewares/apiKey.middleware.js';
import { recordUsage } from '../middlewares/usage.middleware.js';
import { limitByApiKey } from '../middlewares/rateLimit.middleware.js';

const router = Router();

// Example email validation endpoint (placeholder). Replace with your real logic.
router.post('/validate', apiKeyAuth, limitByApiKey(60, 60 * 1000), recordUsage('email-validation.validate'), async (req, res) => {
  const { email } = (req.body || {}) as { email?: string };
  const isValidFormat = typeof email === 'string' && /.+@.+\..+/.test(email);
  // Here you would add DNS/MX checks, disposable checks, etc.
  res.json({ ok: true, email, isValidFormat });
});

export default router;
