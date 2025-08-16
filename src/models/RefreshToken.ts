import mongoose, { Schema, InferSchemaType } from 'mongoose';

const RefreshTokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  tokenHash: { type: String, required: true, index: true },
  expiresAt: { type: Date, required: true, index: true },
  revoked: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'createdAt', updatedAt: false } });

RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type RefreshTokenDoc = InferSchemaType<typeof RefreshTokenSchema> & { _id: mongoose.Types.ObjectId };
export const RefreshToken = mongoose.model('RefreshToken', RefreshTokenSchema);
