import { z } from 'zod';

export const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DIRECT_URL: z.string().optional(),
  AUTH_SECRET: z.string().min(1, 'AUTH_SECRET is required'),
  AUTH_URL: z.string().url().optional(),
  UPI_VPA: z.string().min(1, 'UPI_VPA is required'),
  UPI_PAYEE_NAME: z.string().min(1, 'UPI_PAYEE_NAME is required'),
  CRON_SECRET: z.string().min(1, 'CRON_SECRET is required'),
  DEV_SHIPPING_FLAT_RATE: z.string().transform(Number).default(40),
  DEV_SHIPPING_FREE_THRESHOLD: z.string().transform(Number).default(300),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(env: Record<string, string | undefined> = process.env): Env {
  const result = envSchema.safeParse(env);
  if (!result.success) {
    console.error('Invalid environment variables:', result.error.format());
    throw new Error('Environment variable validation failed');
  }
  return result.data;
}
