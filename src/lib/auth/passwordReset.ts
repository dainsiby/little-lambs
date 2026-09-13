import crypto from 'node:crypto';
import { prisma } from '@/lib/db/prisma';
import { hashPassword } from '@/lib/auth/password';

export function generateRandomResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function hashResetToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

/**
 * Creates a password reset token for a user.
 * Generates raw token, hashes token with SHA-256, sets 1-hour expiry.
 */
export async function createPasswordResetToken(email: string): Promise<{ success: boolean; devResetUrl?: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  // Generic response to prevent account enumeration
  if (!user) {
    return { success: true };
  }

  const rawToken = generateRandomResetToken();
  const tokenHash = hashResetToken(rawToken);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration

  // Delete existing unexpired tokens for this user
  await prisma.passwordResetToken.deleteMany({
    where: { userId: user.id },
  });

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
    },
  });

  const devResetUrl = `/reset-password?token=${rawToken}`;

  // Safe development-only log
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Dev Password Reset] Link created for ${normalizedEmail}: ${devResetUrl}`);
    return { success: true, devResetUrl };
  }

  return { success: true };
}

/**
 * Consumes a password reset token to update the user's password.
 * Rejects invalid, expired, or previously used tokens.
 */
export async function consumePasswordResetToken(
  rawToken: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  if (!rawToken || newPassword.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters long.' };
  }

  const tokenHash = hashResetToken(rawToken);
  const tokenRecord = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!tokenRecord) {
    return { success: false, error: 'Invalid or expired password reset link.' };
  }

  // Enforce single-use check
  if (tokenRecord.usedAt !== null) {
    return { success: false, error: 'This password reset link has already been used.' };
  }

  // Enforce expiration check
  if (tokenRecord.expiresAt < new Date()) {
    return { success: false, error: 'This password reset link has expired.' };
  }

  const newPasswordHash = await hashPassword(newPassword);

  // Update password and mark token as used in atomic transaction
  await prisma.$transaction([
    prisma.user.update({
      where: { id: tokenRecord.userId },
      data: {
        passwordHash: newPasswordHash,
        updatedAt: new Date(),
      },
    }),
    prisma.passwordResetToken.update({
      where: { id: tokenRecord.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return { success: true };
}
