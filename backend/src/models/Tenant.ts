import mongoose, { Schema, InferSchemaType } from 'mongoose';

const TenantSchema = new Schema({
  ownerUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  domain: { type: String, lowercase: true, trim: true, index: true },
  allowedOrigins: [{ type: String }],
  status: { type: String, enum: ['active','suspended'], default: 'active' }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

export type TenantDoc = InferSchemaType<typeof TenantSchema> & { _id: mongoose.Types.ObjectId };
export const Tenant = mongoose.model('Tenant', TenantSchema);
