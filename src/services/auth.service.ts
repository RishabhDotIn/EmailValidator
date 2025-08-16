import dayjs from 'dayjs';
import { EmailOtp } from '../models/EmailOtp.js';
import { User } from '../models/User.js';
import { randomNumericCode, sha256WithPepper } from '../utils/crypto.js';
import { OTP_CODE_LENGTH, OTP_TTL_MINUTES, MAX_OTP_ATTEMPTS } from '../utils/constants.js';
import { sendOtpEmail } from './email.service.js';
import { signAccessToken } from '../utils/jwt.js';
import { issueRefreshToken } from './token.service.js';
import { randomId } from '../utils/crypto.js';

export async function requestOtp(email: string) {
  const otp = randomNumericCode(OTP_CODE_LENGTH);
  const otpHash = sha256WithPepper(otp);
  const expiresAt = dayjs().add(OTP_TTL_MINUTES, 'minute').toDate();
  await EmailOtp.create({ email: email.toLowerCase(), otpHash, expiresAt });
  await sendOtpEmail(email, otp);
}

export async function verifyOtp(email: string, otp: string) {
  const now = new Date();
  const doc = await EmailOtp.findOne({ email: email.toLowerCase(), used: false, expiresAt: { $gt: now } }).sort({ createdAt: -1 });
  if (!doc) return null;

  // Increment attempts if wrong
  const otpHash = sha256WithPepper(otp);
  const isCorrect = doc.otpHash === otpHash;
  if (!isCorrect) {
    const attempts = (doc.attempts ?? 0) + 1;
    await EmailOtp.updateOne({ _id: doc._id }, { $set: { attempts } });
    if (attempts > MAX_OTP_ATTEMPTS) {
      await EmailOtp.updateOne({ _id: doc._id }, { $set: { used: true } });
    }
    return null;
  }

  // Mark used
  await EmailOtp.updateOne({ _id: doc._id }, { $set: { used: true } });

  // Upsert user
  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { $setOnInsert: { email: email.toLowerCase() } },
    { upsert: true, new: true }
  );

  const access = signAccessToken({ sub: String(user._id), email: user.email });
  const jti = randomId(16);
  const { token: refresh, expiresAt } = await issueRefreshToken(String(user._id), jti);
  return { user, access, refresh, refreshExpiresAt: expiresAt };
}
