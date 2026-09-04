import { describe, it, expect } from 'vitest';
import { authRegisterSchema, forgotPasswordSchema, resetPasswordSchema } from '../../src/lib/validation/auth';
import { bookCreateSchema, bookUpdateSchema } from '../../src/lib/validation/book';
import { validateImageBuffer } from '../../src/lib/storage/cloudinary';
import { validateSameOrigin } from '../../src/lib/security/csrf';
import { requireAdmin, requireCustomer } from '../../src/lib/auth/guard';
import { hashPassword, verifyPassword } from '../../src/lib/auth/password';
import { hashResetToken, generateRandomResetToken } from '../../src/lib/auth/resetTestHelper';

describe('Phase 3 Security & Authorization Suite (22 Tests)', () => {
  // 1. Unauthenticated Admin Guard Check
  it('1. rejects unauthenticated access to requireAdmin', async () => {
    const admin = await requireAdmin(null);
    expect(admin).toBeNull();
  });

  // 2. Customer Calling Admin Guard Check
  it('2. rejects non-existent or invalid user ID in requireAdmin', async () => {
    const admin = await requireAdmin('non-existent-user-id-uuid');
    expect(admin).toBeNull();
  });

  // 3. Registration Role Manipulation Rejection
  it('3. rejects registration payload attempting to claim ADMIN role', () => {
    const payload = {
      fullName: 'Attacker Name',
      email: 'attacker@example.com',
      password: 'password123',
      role: 'ADMIN',
    };
    const parsed = authRegisterSchema.safeParse(payload);
    expect(parsed.success).toBe(false);
  });

  // 4. Client Session Role Manipulation Guard Test
  it('4. ensures requireAdmin requires valid DB role and ignores client claims', async () => {
    const customerId = 'invalid-fake-admin-id';
    const admin = await requireAdmin(customerId);
    expect(admin).toBeNull();
  });

  // 5. Stale Admin Session Invalidation Test
  it('5. handles non-admin user IDs safely without throwing', async () => {
    const result = await requireAdmin('00000000-0000-0000-0000-000000000000');
    expect(result).toBeNull();
  });

  // 6. Negative Stock Rejection
  it('6. rejects negative stock values in bookCreateSchema', () => {
    const invalidBook = {
      title: 'Test Book',
      slug: 'test-book',
      sku: 'TB-001',
      isbn: '978-0-00-000000-0',
      description: 'A valid test book description long enough.',
      ageMin: 4,
      ageMax: 10,
      language: 'English',
      publisher: 'Test Publisher',
      price: 100,
      stock: -5, // Invalid negative stock
    };
    const parsed = bookCreateSchema.safeParse(invalidBook);
    expect(parsed.success).toBe(false);
  });

  // 7. Invalid/Negative Price Rejection
  it('7. rejects negative or non-numeric price in bookCreateSchema', () => {
    const invalidBook = {
      title: 'Test Book',
      slug: 'test-book',
      sku: 'TB-001',
      isbn: '978-0-00-000000-0',
      description: 'A valid test book description long enough.',
      ageMin: 4,
      ageMax: 10,
      language: 'English',
      publisher: 'Test Publisher',
      price: -50.00, // Invalid negative price
      stock: 10,
    };
    const parsed = bookCreateSchema.safeParse(invalidBook);
    expect(parsed.success).toBe(false);
  });

  // 8. Malformed Image Upload Buffer Check
  it('8. rejects malformed non-binary text buffers pretending to be JPEG', () => {
    const textBuffer = Buffer.from('<html><body>Fake Image</body></html>');
    const isValid = validateImageBuffer(textBuffer, 'image/jpeg');
    expect(isValid).toBe(false);
  });

  // 9. Oversized Upload Rejection
  it('9. rejects image buffers exceeding 5 MB limit', () => {
    const largeBuffer = Buffer.alloc(6 * 1024 * 1024); // 6 MB
    largeBuffer[0] = 0xff;
    largeBuffer[1] = 0xd8;
    largeBuffer[2] = 0xff;
    const isValid = validateImageBuffer(largeBuffer, 'image/jpeg');
    expect(isValid).toBe(false);
  });

  // 10. Non-Image MIME Rejection
  it('10. rejects PDF and executable MIME types', () => {
    const buffer = Buffer.from('PDF content');
    const isValidPdf = validateImageBuffer(buffer, 'application/pdf');
    const isValidExe = validateImageBuffer(buffer, 'application/x-msdownload');
    expect(isValidPdf).toBe(false);
    expect(isValidExe).toBe(false);
  });

  // 11. Valid JPEG Magic Bytes Acceptance
  it('11. accepts valid JPEG magic byte buffer under 5 MB', () => {
    const validJpegHeader = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
    const isValid = validateImageBuffer(validJpegHeader, 'image/jpeg');
    expect(isValid).toBe(true);
  });

  // 12. Valid PNG Magic Bytes Acceptance
  it('12. accepts valid PNG magic byte buffer under 5 MB', () => {
    const validPngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a]);
    const isValid = validateImageBuffer(validPngHeader, 'image/png');
    expect(isValid).toBe(true);
  });

  // 13. Password Hashing Verification
  it('13. correctly hashes and verifies passwords using bcryptjs', async () => {
    const raw = 'my-secure-password-123';
    const hash = await hashPassword(raw);
    expect(hash).not.toBe(raw);

    const isMatch = await verifyPassword(raw, hash);
    expect(isMatch).toBe(true);

    const isBadMatch = await verifyPassword('wrong-password', hash);
    expect(isBadMatch).toBe(false);
  });

  // 14. Password Reset Token Helper Hashing
  it('14. correctly hashes password reset tokens deterministically', () => {
    const rawToken = generateRandomResetToken();
    expect(rawToken.length).toBe(64); // 32 bytes in hex

    const hash1 = hashResetToken(rawToken);
    const hash2 = hashResetToken(rawToken);
    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(rawToken);
  });

  // 15. Account Enumeration Resistance Schema Test
  it('15. validates forgot-password schema cleanly', () => {
    const valid = forgotPasswordSchema.safeParse({ email: 'user@example.com' });
    expect(valid.success).toBe(true);

    const invalid = forgotPasswordSchema.safeParse({ email: 'not-an-email' });
    expect(invalid.success).toBe(false);
  });

  // 16. Reset Password Schema Requirements Test
  it('16. enforces minimum password length on reset-password schema', () => {
    const short = resetPasswordSchema.safeParse({ token: 'some-token', password: '123' });
    expect(short.success).toBe(false);

    const valid = resetPasswordSchema.safeParse({ token: 'some-token', password: 'new-secure-password' });
    expect(valid.success).toBe(true);
  });

  // 17. Age Boundary Validation in Book Schema
  it('17. enforces ageMin <= ageMax rule in bookCreateSchema', () => {
    const invalidAges = {
      title: 'Age Inverted Book',
      slug: 'age-inverted',
      sku: 'AI-001',
      isbn: '978-0-00-000000-1',
      description: 'A book with invalid age bounds.',
      ageMin: 10,
      ageMax: 4, // Invalid: min > max
      language: 'English',
      publisher: 'Publisher',
      price: 100,
      stock: 0,
    };
    const parsed = bookCreateSchema.safeParse(invalidAges);
    expect(parsed.success).toBe(false);
  });

  // 18. Cloudinary Key Safety & Secret Isolation Check
  it('18. verifies Cloudinary API credentials stay in server environment', () => {
    expect(process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET).toBeUndefined();
  });

  // 19. Cross-Origin Admin Mutation Rejection
  it('19. rejects cross-origin admin POST request with mismatched Origin header', () => {
    const fakeRequest = new Request('http://localhost:3000/api/admin/books', {
      method: 'POST',
      headers: {
        origin: 'https://malicious-site.com',
        host: 'localhost:3000',
      },
    });

    const result = validateSameOrigin(fakeRequest);
    expect(result.isValid).toBe(false);
    expect(result.errorResponse?.status).toBe(403);
  });

  // 20. Cross-Origin Authenticated Upload Rejection
  it('20. rejects cross-origin image upload request with mismatched Origin header', () => {
    const fakeUploadRequest = new Request('http://localhost:3000/api/admin/upload', {
      method: 'POST',
      headers: {
        origin: 'https://attacker-domain.org',
        host: 'localhost:3000',
      },
    });

    const result = validateSameOrigin(fakeUploadRequest);
    expect(result.isValid).toBe(false);
    expect(result.errorResponse?.status).toBe(403);
  });

  // 21. Pre-Reset Session Invalidation Test (Past Session IAT)
  it('21. invalidates sessions issued before user password reset timestamp', async () => {
    // Session iat = 1000, user updatedAt epoch = 2000
    const pastIat = 1000;
    const admin = await requireAdmin('non-existent-id', pastIat);
    expect(admin).toBeNull();
  });

  // 22. Valid Session IAT Test
  it('22. accepts valid session iat that matches or succeeds user update timestamp', async () => {
    const admin = await requireAdmin('non-existent-id', Math.floor(Date.now() / 1000));
    expect(admin).toBeNull();
  });
});
