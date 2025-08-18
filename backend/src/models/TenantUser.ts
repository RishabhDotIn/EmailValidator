import mongoose, { Schema, InferSchemaType } from 'mongoose';

const TenantUserSchema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  email: { type: String, lowercase: true, index: true },
  externalId: { type: String, index: true },
  firstSeenAt: { type: Date, default: () => new Date() },
  lastSeenAt: { type: Date, default: () => new Date() },
  lastActivity: { type: String },
  attributes: { type: Schema.Types.Mixed }
}, { timestamps: { createdAt: false, updatedAt: false } });

export type TenantUserDoc = InferSchemaType<typeof TenantUserSchema> & { _id: mongoose.Types.ObjectId };
export const TenantUser = mongoose.model('TenantUser', TenantUserSchema);
