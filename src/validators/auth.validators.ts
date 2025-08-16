import { z } from 'zod';

export const RequestOtpSchema = z.object({
  email: z.string().email()
});

export const VerifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().regex(/^\d{6}$/)
});
