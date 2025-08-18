import mongoose, { Schema, InferSchemaType } from 'mongoose';

const ApiKeySchema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  keyHash: { type: String, required: true, index: true },
  prefix: { type: String, required: true, index: true },
  last4: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed },
  revokedAt: { type: Date, default: null }
}, { timestamps: { createdAt: 'createdAt', updatedAt: false } });

export type ApiKeyDoc = InferSchemaType<typeof ApiKeySchema> & { _id: mongoose.Types.ObjectId };
export const ApiKey = mongoose.model('ApiKey', ApiKeySchema);
