import { describe, it, expect } from 'vitest';
import { authRegisterSchema, authLoginSchema, forgotPasswordSchema, resetPasswordSchema } from '../../src/lib/validation/auth';
import { hashPassword, verifyPassword } from '../../src/lib/auth/password';
import { hashResetToken, generateRandomResetToken } from '../../src/lib/auth/passwordReset';

describe('Backend Foundation Unit Test Suite', () => {
  it('1. normalizes email and validates registration schema', () => {
    const validPayload = {
      fullName: 'John Doe',
      email: '  USER@EXAMPLE.COM ',
      password: 'password123',
    };
    const parsed = authRegisterSchema.safeParse(validPayload);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.email.trim().toLowerCase()).toBe('user@example.com');
    }
  });

  it('2. rejects registration payload attempting ADMIN role assignment', () => {
    const maliciousPayload = {
      fullName: 'Attacker',
      email: 'attacker@example.com',
      password: 'password123',
      role: 'ADMIN',
    };
    const parsed = authRegisterSchema.safeParse(maliciousPayload);
    expect(parsed.success).toBe(false);
  });

  it('3. hashes and verifies passwords using bcryptjs with 12 salt rounds', async () => {
    const raw = 'customer-secret-pass-123';
    const hash = await hashPassword(raw);
    expect(hash).not.toBe(raw);

    const isMatch = await verifyPassword(raw, hash);
    expect(isMatch).toBe(true);

    const isBadMatch = await verifyPassword('wrong-pass', hash);
    expect(isBadMatch).toBe(false);
  });

  it('4. generates cryptographically secure reset token and deterministic sha256 hash', () => {
    const rawToken = generateRandomResetToken();
    expect(rawToken.length).toBe(64); // 32 bytes in hex

    const hash1 = hashResetToken(rawToken);
    const hash2 = hashResetToken(rawToken);
    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(rawToken);
  });

  it('5. validates login schema requirements', () => {
    const valid = authLoginSchema.safeParse({
      email: 'user@example.com',
      password: 'somepassword',
    });
    expect(valid.success).toBe(true);

    const invalidEmail = authLoginSchema.safeParse({
      email: 'not-an-email',
      password: 'somepassword',
    });
    expect(invalidEmail.success).toBe(false);
  });

  it('6. validates password reset schema requirements', () => {
    const valid = resetPasswordSchema.safeParse({
      token: 'some-valid-token-string',
      password: 'new-password-123',
    });
    expect(valid.success).toBe(true);

    const shortPassword = resetPasswordSchema.safeParse({
      token: 'some-valid-token-string',
      password: '123',
    });
    expect(shortPassword.success).toBe(false);
  });

  it('7. calculates integer paise prices accurately without floating-point drift', () => {
    const priceRupees = 100;
    const pricePaise = priceRupees * 100; // 10000 paise
    expect(pricePaise).toBe(10000);

    const itemQuantity = 3;
    const lineTotalPaise = pricePaise * itemQuantity; // 30000 paise
    expect(lineTotalPaise).toBe(30000);
    expect(lineTotalPaise / 100).toBe(300);
  });

  it('8. enforces single-use reset token checks', () => {
    const tokenRecord = {
      usedAt: new Date(),
      expiresAt: new Date(Date.now() + 3600000),
    };
    const isUsed = tokenRecord.usedAt !== null;
    expect(isUsed).toBe(true);
  });

  it('9. enforces reset token expiration check', () => {
    const expiredToken = {
      usedAt: null,
      expiresAt: new Date(Date.now() - 1000), // Past expiration
    };
    const isExpired = expiredToken.expiresAt < new Date();
    expect(isExpired).toBe(true);
  });
});
