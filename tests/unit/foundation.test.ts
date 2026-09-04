import { describe, it, expect } from 'vitest';
import { envSchema } from '../../src/lib/validation/env';

describe('Project Foundation Verification', () => {
  it('validates environment schema correctly with safe placeholders', () => {
    const mockEnv = {
      NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test_db',
      AUTH_SECRET: 'test-secret-at-least-32-characters-long',
      UPI_VPA: 'test-vpa@upi',
      UPI_PAYEE_NAME: 'Test Payee',
      CRON_SECRET: 'test-cron-secret',
    };

    const parsed = envSchema.safeParse(mockEnv);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.DEV_SHIPPING_FLAT_RATE).toBe(40);
      expect(parsed.data.DEV_SHIPPING_FREE_THRESHOLD).toBe(300);
    }
  });

  it('rejects environment configuration when required variables are missing', () => {
    const invalidEnv = {
      NODE_ENV: 'test',
    };

    const parsed = envSchema.safeParse(invalidEnv);
    expect(parsed.success).toBe(false);
  });
});
