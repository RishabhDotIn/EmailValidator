import 'dotenv/config';
import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(10000),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_ACCESS_SECRET: z.string().min(1, 'JWT_ACCESS_SECRET is required'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required'),
  OTP_PEPPER: z.string().min(1, 'OTP_PEPPER is required'),
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.coerce.number().int().default(465),
  SMTP_USER: z.string().email('SMTP_USER must be an email'),
  SMTP_PASS: z.string().min(1, 'SMTP_PASS is required'),
  APP_BASE_URL: z.string().url('APP_BASE_URL must be a URL'),
  CORS_ORIGINS: z.string().optional(),
  LOG_LEVEL: z.enum(['fatal','error','warn','info','debug','trace','silent']).default('info')
});

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  // Print friendly error messages
  console.error('Invalid environment configuration:');
  parsed.error.issues.forEach((i) => console.error(`- ${i.path.join('.')}: ${i.message}`));
  process.exit(1);
}

const e = parsed.data;

export const env = {
  NODE_ENV: e.NODE_ENV,
  PORT: e.PORT,
  MONGODB_URI: e.MONGODB_URI,
  JWT_ACCESS_SECRET: e.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: e.JWT_REFRESH_SECRET,
  OTP_PEPPER: e.OTP_PEPPER,
  SMTP_HOST: e.SMTP_HOST,
  SMTP_PORT: e.SMTP_PORT,
  SMTP_USER: e.SMTP_USER,
  SMTP_PASS: e.SMTP_PASS,
  APP_BASE_URL: e.APP_BASE_URL,
  LOG_LEVEL: e.LOG_LEVEL,
  get isProd() { return this.NODE_ENV === 'production'; },
  get isDev() { return this.NODE_ENV === 'development'; },
  get corsOrigins(): string[] {
    const base = [e.APP_BASE_URL];
    if (!e.CORS_ORIGINS) return base;
    const extras = e.CORS_ORIGINS.split(',').map(s => s.trim()).filter(Boolean);
    return Array.from(new Set([...base, ...extras]));
  }
} as const;
