import { prisma } from '@/lib/db/prisma';
import { authRegisterSchema } from '@/lib/validation/auth';
import { hashPassword } from '@/lib/auth/password';

export interface RegisterResult {
  success: boolean;
  error?: string;
}

export async function registerUser(input: unknown): Promise<RegisterResult> {
  const parsed = authRegisterSchema.safeParse(input);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message || 'Invalid registration data.';
    return { success: false, error: firstIssue };
  }

  const { fullName, email, password } = parsed.data;
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const passwordHash = await hashPassword(password);

    await prisma.user.create({
      data: {
        fullName,
        email: normalizedEmail,
        passwordHash,
        role: 'CUSTOMER', // Always CUSTOMER, never trust role from payload
      },
    });

    return { success: true };
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return { success: false, error: 'An account with this email address already exists.' };
    }
    console.error('[Registration Error] Registration processing failed:', error);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}
