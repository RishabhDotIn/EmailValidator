import crypto from 'crypto';
import { env } from '../config/env.js';

export function sha256WithPepper(value: string): string {
  const h = crypto.createHash('sha256');
  h.update(value + env.OTP_PEPPER);
  return h.digest('hex');
}

export function randomNumericCode(length: number): string {
  let code = '';
  while (code.length < length) {
    const byte = crypto.randomBytes(1)[0] % 10;
    code += String(byte);
  }
  return code;
}

export function randomId(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

export function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}
