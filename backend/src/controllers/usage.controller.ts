import { Request, Response, NextFunction } from 'express';
import { getTenantUsageSummary } from '../services/usage.service.js';

export async function getUsageHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { tenantId } = req.params as { tenantId: string };
    const days = Number(req.query.days ?? 7);
    const data = await getTenantUsageSummary(tenantId, isNaN(days) ? 7 : days);
    res.json({ usage: data });
  } catch (err) { next(err); }
}
