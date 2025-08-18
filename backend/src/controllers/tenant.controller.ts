import { Request, Response, NextFunction } from 'express';
import { createTenant, listMyTenants, getTenant, updateTenant } from '../services/tenant.service.js';

export async function createTenantHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, domain } = req.body as { name: string; domain?: string };
    if (!req.user) return res.status(401).json({ error: { code: 'UNAUTHORIZED' } });
    const t = await createTenant(req.user.id, name, domain);
    res.status(201).json({ tenant: t });
  } catch (err) { next(err); }
}

export async function listMyTenantsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return res.status(401).json({ error: { code: 'UNAUTHORIZED' } });
    const items = await listMyTenants(req.user.id);
    res.json({ tenants: items });
  } catch (err) { next(err); }
}

export async function getTenantHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return res.status(401).json({ error: { code: 'UNAUTHORIZED' } });
    const t = await getTenant(req.user.id, req.params.tenantId);
    if (!t) return res.status(404).json({ error: { code: 'NOT_FOUND' } });
    res.json({ tenant: t });
  } catch (err) { next(err); }
}

export async function updateTenantHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return res.status(401).json({ error: { code: 'UNAUTHORIZED' } });
    const patch = req.body as any;
    const t = await updateTenant(req.user.id, req.params.tenantId, patch);
    res.json({ tenant: t });
  } catch (err) { next(err); }
}
