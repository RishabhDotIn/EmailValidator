import { Tenant } from '../models/Tenant.js';

export async function createTenant(ownerUserId: string, name: string, domain?: string) {
  const t = await Tenant.create({ ownerUserId, name, domain, allowedOrigins: [] });
  return t;
}

export async function listMyTenants(ownerUserId: string) {
  return Tenant.find({ ownerUserId }).sort({ createdAt: -1 }).lean();
}

export async function getTenant(ownerUserId: string, tenantId: string) {
  return Tenant.findOne({ _id: tenantId, ownerUserId }).lean();
}

export async function updateTenant(ownerUserId: string, tenantId: string, patch: Partial<{ name: string; domain: string; allowedOrigins: string[]; status: 'active' | 'suspended' }>) {
  await Tenant.updateOne({ _id: tenantId, ownerUserId }, { $set: patch });
  return Tenant.findById(tenantId).lean();
}
