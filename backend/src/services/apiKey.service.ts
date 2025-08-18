import { ApiKey } from '../models/ApiKey.js';
import { Tenant } from '../models/Tenant.js';
import { randomId, sha256WithPepper } from '../utils/crypto.js';

function formatKey(prefix: 'evk_live' | 'evk_test'): { plaintext: string; last4: string; prefix: string } {
  const body = randomId(24); // 48 hex chars
  const plaintext = `${prefix}_${body}`;
  const last4 = body.slice(-4);
  return { plaintext, last4, prefix };
}

export async function createApiKey(tenantId: string, mode: 'live' | 'test' = 'live') {
  const tenant = await Tenant.findById(tenantId);
  if (!tenant) throw new Error('Tenant not found');
  if (tenant.status !== 'active') throw new Error('Tenant not active');

  const { plaintext, last4, prefix } = formatKey(mode === 'live' ? 'evk_live' : 'evk_test');
  const keyHash = sha256WithPepper(plaintext);
  const doc = await ApiKey.create({ tenantId, keyHash, prefix, last4 });
  return { plaintext, key: doc };
}

export async function listApiKeys(tenantId: string) {
  return ApiKey.find({ tenantId }).sort({ createdAt: -1 }).lean();
}

export async function revokeApiKey(tenantId: string, keyId: string) {
  await ApiKey.updateOne({ _id: keyId, tenantId, revokedAt: null }, { $set: { revokedAt: new Date() } });
}
