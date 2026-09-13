import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  AUTH_SECRET: z.string().min(16, 'AUTH_SECRET must be at least 16 characters').optional().or(z.string().min(1)),
  CRON_SECRET: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Environment Variable Validation Errors:');
    console.error(result.error.flatten().fieldErrors);
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Invalid environment configuration in production');
    }
  }

  return result.success ? result.data : (process.env as unknown as Env);
}

export const env = validateEnv();
