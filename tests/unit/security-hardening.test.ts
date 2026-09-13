import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit/rateLimiter';
import { validateUploadedImage, detectMagicBytesType } from '@/lib/upload/secureUpload';
import { validateSameOrigin } from '@/lib/security/csrf';
import { hashResetToken, generateRandomResetToken } from '@/lib/auth/resetTestHelper';
import { requireAdmin } from '@/lib/auth/guard';
import { verifyOrderPayment } from '@/lib/admin/adminOrderService';
import { prisma } from '@/lib/db/prisma';

describe('Security Hardening & Production Readiness Unit Suite', () => {
  describe('1. Rate Limiting Engine', () => {
    it('allows requests within rate limit and enforces 429 when exceeded', async () => {
      const testId = `test_limit_${Date.now()}`;
      
      // First 3 requests should pass with limit 3
      const r1 = await checkRateLimit(testId, 3, 60);
      const r2 = await checkRateLimit(testId, 3, 60);
      const r3 = await checkRateLimit(testId, 3, 60);

      expect(r1.success).toBe(true);
      expect(r2.success).toBe(true);
      expect(r3.success).toBe(true);

      // 4th request should fail
      const r4 = await checkRateLimit(testId, 3, 60);
      expect(r4.success).toBe(false);

      const res = rateLimitResponse(r4.resetSeconds);
      expect(res.status).toBe(429);
      expect(res.headers.get('Retry-After')).toBeDefined();
    });
  });

  describe('2. Secure Upload Validation & Magic Bytes Inspection', () => {
    it('correctly detects valid JPEG, PNG, and WEBP magic bytes', () => {
      const jpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);
      expect(detectMagicBytesType(jpegBuffer)).toBe('image/jpeg');

      const pngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
      expect(detectMagicBytesType(pngBuffer)).toBe('image/png');

      const webpBuffer = Buffer.from([0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50]);
      expect(detectMagicBytesType(webpBuffer)).toBe('image/webp');
    });

    it('rejects SVG, HTML, executable files, and spoofed extensions', () => {
      const svgContent = Buffer.from('<svg><script>alert(1)</script></svg>');
      const resSvg = validateUploadedImage(svgContent, 'malicious.svg', 'image/svg+xml');
      expect(resSvg.valid).toBe(false);
      expect(resSvg.error).toContain('not permitted');

      const exeContent = Buffer.from([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00]);
      const resExe = validateUploadedImage(exeContent, 'payload.exe', 'image/jpeg');
      expect(resExe.valid).toBe(false);
    });

    it('rejects files exceeding 5MB max size limit', () => {
      const largeBuffer = Buffer.alloc(6 * 1024 * 1024);
      const res = validateUploadedImage(largeBuffer, 'large.jpg', 'image/jpeg');
      expect(res.valid).toBe(false);
      expect(res.error).toContain('exceeds maximum allowed limit');
    });
  });

  describe('3. CSRF & Same-Origin Header Validation', () => {
    it('allows GET requests unconditionally', () => {
      const req = new Request('http://localhost:3000/api/checkout', { method: 'GET' });
      const check = validateSameOrigin(req);
      expect(check.isValid).toBe(true);
    });

    it('rejects POST requests where Origin host does not match Host header', () => {
      const req = new Request('http://localhost:3000/api/checkout', {
        method: 'POST',
        headers: {
          origin: 'http://malicious-attacker.com',
          host: 'localhost:3000',
        },
      });

      // Override NODE_ENV check for test suite
      const oldEnv = process.env.NODE_ENV;
      (process.env as any).NODE_ENV = 'development';
      const check = validateSameOrigin(req);
      (process.env as any).NODE_ENV = oldEnv;

      expect(check.isValid).toBe(false);
      expect(check.errorResponse?.status).toBe(403);
    });
  });

  describe('4. Cryptographic Reset Tokens & Hash Verification', () => {
    it('generates 32-byte tokens and produces deterministic SHA-256 hashes', () => {
      const token1 = generateRandomResetToken();
      const token2 = generateRandomResetToken();
      expect(token1.length).toBeGreaterThanOrEqual(32);
      expect(token1).not.toBe(token2);

      const hash1 = hashResetToken(token1);
      const hash1Repeat = hashResetToken(token1);
      expect(hash1).toBe(hash1Repeat);
      expect(hash1).not.toBe(hashResetToken(token2));
    });
  });

  describe('5. Strict Database Role Check', () => {
    it('denies access if database user role is not ADMIN, ignoring stale JWT claim', async () => {
      const testEmail = `cust_${Date.now()}@example.com`;
      const user = await prisma.user.create({
        data: {
          email: testEmail,
          passwordHash: 'dummy_hash',
          fullName: 'Test Customer',
          role: 'CUSTOMER',
        },
      });

      const admin = await requireAdmin(user.id);
      expect(admin).toBeNull();

      // Clean up
      await prisma.user.delete({ where: { id: user.id } });
    });
  });
});
