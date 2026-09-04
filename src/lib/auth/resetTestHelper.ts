import crypto from 'node:crypto';

/**
 * Creates a sha256 hash of a raw reset token for secure DB storage
 */
export function hashResetToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

/**
 * Generates a 32-byte cryptographically secure random reset token
 */
export function generateRandomResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
