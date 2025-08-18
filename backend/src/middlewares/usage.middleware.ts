import { NextFunction, Request, Response } from 'express';
import { UsageEvent } from '../models/UsageEvent.js';

export function recordUsage(endpoint: string) {
  return function usage(req: Request, res: Response, next: NextFunction) {
    const started = Date.now();
    res.on('finish', async () => {
      try {
        const ctx = req.apiKeyCtx;
        if (!ctx) return; // only for API key authenticated routes
        const status = res.statusCode;
        const ip = req.ip;
        const userEmail = (req.header('x-user-email') || req.body?.userEmail || '').toString() || undefined;
        const userExternalId = (req.header('x-user-id') || req.body?.userId || '').toString() || undefined;
        await UsageEvent.create({
          tenantId: ctx.tenantId,
          apiKeyId: ctx.apiKeyId,
          endpoint,
          status,
          cost: 1,
          ip,
          userEmail,
          userExternalId
        });
      } catch {
        // swallow
      }
    });
    next();
  }
}
