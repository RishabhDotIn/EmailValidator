import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASS }
});

export async function sendOtpEmail(to: string, otp: string) {
  const info = await transporter.sendMail({
    from: env.SMTP_USER,
    to,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    html: `<p>Your OTP code is <b>${otp}</b>. It will expire in 10 minutes.</p>`
  });
  logger.info({ to, messageId: info.messageId }, 'OTP email sent');
}
