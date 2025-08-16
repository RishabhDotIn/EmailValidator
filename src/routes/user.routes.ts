import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { meHandler } from '../controllers/user.controller.js';

const router = Router();

router.get('/me', requireAuth, meHandler);

export default router;
