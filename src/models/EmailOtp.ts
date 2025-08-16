import mongoose, { Schema, InferSchemaType } from 'mongoose';

const EmailOtpSchema = new Schema({
  email: { type: String, required: true, index: true },
  otpHash: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: true },
  attempts: { type: Number, default: 0 },
  used: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'createdAt', updatedAt: false } });

EmailOtpSchema.index({ email: 1, createdAt: -1 });
EmailOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type EmailOtpDoc = InferSchemaType<typeof EmailOtpSchema> & { _id: mongoose.Types.ObjectId };
export const EmailOtp = mongoose.model('EmailOtp', EmailOtpSchema);
