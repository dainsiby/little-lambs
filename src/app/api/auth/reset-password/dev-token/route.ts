import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

/**
 * DEVELOPMENT ONLY helper endpoint to retrieve reset tokens during test execution.
 * HARD GUARDED against production execution.
 */
export async function GET(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    include: { passwordResetTokens: true },
  });

  if (!user || user.passwordResetTokens.length === 0) {
    return NextResponse.json({ error: 'No reset tokens found for user' }, { status: 404 });
  }

  return NextResponse.json({
    email: user.email,
    tokenCount: user.passwordResetTokens.length,
    latestExpiresAt: user.passwordResetTokens[user.passwordResetTokens.length - 1].expiresAt,
  });
}
