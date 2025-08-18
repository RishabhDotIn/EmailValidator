import mongoose, { Schema, InferSchemaType } from 'mongoose';

const UsageEventSchema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  apiKeyId: { type: Schema.Types.ObjectId, ref: 'ApiKey', required: true, index: true },
  endpoint: { type: String, required: true },
  status: { type: Number, required: true },
  cost: { type: Number, default: 1 },
  ip: { type: String },
  userEmail: { type: String, lowercase: true },
  userExternalId: { type: String }
}, { timestamps: { createdAt: 'createdAt', updatedAt: false } });

export type UsageEventDoc = InferSchemaType<typeof UsageEventSchema> & { _id: mongoose.Types.ObjectId };
export const UsageEvent = mongoose.model('UsageEvent', UsageEventSchema);
