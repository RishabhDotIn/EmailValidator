import mongoose, { Schema, InferSchemaType } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  name: { type: String }
}, { timestamps: { createdAt: 'createdAt', updatedAt: false } });

export type UserDoc = InferSchemaType<typeof UserSchema> & { _id: mongoose.Types.ObjectId };
export const User = mongoose.model('User', UserSchema);
