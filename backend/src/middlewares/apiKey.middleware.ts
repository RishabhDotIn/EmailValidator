import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import { ApiKey } from '../models/ApiKey.js';
import { Tenant } from '../models/Tenant.js';
import { sha256WithPepper } from '../utils/crypto.js';

export type ApiKeyContext = {
  apiKeyId: string;
  tenantId: string;
  prefix: string;
};

declare global {
  namespace Express {
    interface Request { apiKeyCtx?: ApiKeyContext }
  }
}

function extractKey(req: Request): string | null {
  const header = req.header('authorization') || req.header('Authorization');
  if (header && header.startsWith('Bearer ')) return header.substring('Bearer '.length).trim();
  const xKey = req.header('x-api-key');
  if (xKey) return xKey.trim();
  return null;
}

export async function apiKeyAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const key = extractKey(req);
    if (!key) return next(createError(401, 'Missing API key', { code: 'UNAUTHORIZED' }));

    const [prefix] = key.split('_').length > 2 ? [key.split('_').slice(0,2).join('_')] : [''];
    const hash = sha256WithPepper(key);

    const doc = await ApiKey.findOne({ keyHash: hash, revokedAt: null });
    if (!doc) return next(createError(401, 'Invalid API key', { code: 'UNAUTHORIZED' }));

    const tenant = await Tenant.findById(doc.tenantId).lean();
    if (!tenant || tenant.status !== 'active') return next(createError(403, 'Tenant is not active', { code: 'FORBIDDEN' }));

    req.apiKeyCtx = { apiKeyId: String(doc._id), tenantId: String(doc.tenantId), prefix: doc.prefix };
    next();
  } catch (err) {
    next(createError(401, 'Unauthorized', { code: 'UNAUTHORIZED' }));
  }
}
