import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { hashPassword } from '@/lib/auth/password';
import { resetPasswordSchema } from '@/lib/validation/auth';
import { validateSameOrigin } from '@/lib/security/csrf';
import { hashResetToken } from '@/lib/auth/resetTestHelper';

export async function POST(request: Request) {
  // CSRF / Origin Validation
  const csrfCheck = validateSameOrigin(request);
  if (!csrfCheck.isValid && csrfCheck.errorResponse) {
    return csrfCheck.errorResponse;
  }

  try {
    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed' },
        { status: 400 }
      );
    }

    const { token, password } = parsed.data;
    const tokenHash = hashResetToken(token);

    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!resetRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired password reset token' },
        { status: 400 }
      );
    }

    if (resetRecord.expiresAt < new Date()) {
      // Invalidate expired token
      await prisma.passwordResetToken.delete({ where: { id: resetRecord.id } });
      return NextResponse.json(
        { error: 'Invalid or expired password reset token' },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Update user password and touch updatedAt to invalidate active sessions
    await prisma.user.update({
      where: { id: resetRecord.userId },
      data: {
        passwordHash,
        updatedAt: new Date(),
      },
    });

    // Invalidate spent reset token immediately
    await prisma.passwordResetToken.delete({
      where: { id: resetRecord.id },
    });

    return NextResponse.json(
      { message: 'Password reset successful. Please log in with your new password.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
