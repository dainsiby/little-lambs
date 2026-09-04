import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { forgotPasswordSchema } from '@/lib/validation/auth';
import { validateSameOrigin } from '@/lib/security/csrf';
import { checkRateLimit } from '@/lib/security/rateLimit';
import { generateRandomResetToken, hashResetToken } from '@/lib/auth/resetTestHelper';

export async function POST(request: Request) {
  // CSRF / Origin Validation
  const csrfCheck = validateSameOrigin(request);
  if (!csrfCheck.isValid && csrfCheck.errorResponse) {
    return csrfCheck.errorResponse;
  }

  // Rate Limiting
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const rateLimit = await checkRateLimit(`rate:forgot-password:${ip}`, 5, 15 * 60 * 1000);
  if (!rateLimit.success && rateLimit.response) {
    return rateLimit.response;
  }

  try {
    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed' },
        { status: 400 }
      );
    }

    const normalizedEmail = parsed.data.email.toLowerCase().trim();

    // Uniform response to prevent account enumeration
    const genericResponse = NextResponse.json({
      message: 'If an account exists with that email address, password reset instructions have been dispatched.',
    });

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return genericResponse;
    }

    // Generate 32-byte token & hash it for DB storage
    const rawToken = generateRandomResetToken();
    const tokenHash = hashResetToken(rawToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Clean existing tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // Store token hash in database
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    // NOTE: Raw tokens are NEVER logged in application console/logs.
    // In production, transactional email dispatch occurs here.
    return genericResponse;
  } catch (error) {
    console.error('Error handling forgot password request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
