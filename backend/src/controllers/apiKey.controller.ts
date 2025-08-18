import { Request, Response, NextFunction } from 'express';
import { createApiKey, listApiKeys, revokeApiKey } from '../services/apiKey.service.js';

export async function createApiKeyHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { mode } = (req.body || {}) as { mode?: 'live' | 'test' };
    const { tenantId } = req.params as { tenantId: string };
    const { plaintext, key } = await createApiKey(tenantId, mode ?? 'live');
    const k = key.toObject() as any;
    res.status(201).json({ apiKey: { id: String(key._id), prefix: key.prefix, last4: key.last4, createdAt: k.createdAt }, plaintext });
  } catch (err) { next(err); }
}

export async function listApiKeysHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { tenantId } = req.params as { tenantId: string };
    const items = await listApiKeys(tenantId);
    res.json({ apiKeys: items.map(k => ({ id: String(k._id), prefix: k.prefix, last4: k.last4, createdAt: (k as any).createdAt, revokedAt: k.revokedAt })) });
  } catch (err) { next(err); }
}

export async function revokeApiKeyHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { tenantId, keyId } = req.params as { tenantId: string; keyId: string };
    await revokeApiKey(tenantId, keyId);
    res.json({ ok: true });
  } catch (err) { next(err); }
}
