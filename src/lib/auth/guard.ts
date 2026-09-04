import { prisma } from '@/lib/db/prisma';
import { Role } from '@prisma/client';

export interface UserSession {
  id: string;
  email: string;
  role: Role;
  fullName: string;
  updatedAt: Date;
}

/**
 * Server-authoritative admin verification against PostgreSQL.
 * Validates role AND checks if session token timestamp predates the last user password/security update.
 */
export async function requireAdmin(
  userId: string | undefined | null,
  sessionIat?: number
): Promise<UserSession | null> {
  if (!userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        fullName: true,
        updatedAt: true,
      },
    });

    if (!user || user.role !== Role.ADMIN) {
      return null;
    }

    // Server-authoritative session invalidation check
    if (sessionIat) {
      const userUpdatedAtEpoch = Math.floor(user.updatedAt.getTime() / 1000);
      // If session was issued before user security update (with 2s grace for clock precision), invalidate
      if (sessionIat < userUpdatedAtEpoch - 2) {
        console.warn(`[Session Invalidated] Session iat (${sessionIat}) predates user update (${userUpdatedAtEpoch})`);
        return null;
      }
    }

    return user;
  } catch (error) {
    console.error('Error verifying admin authorization:', error);
    return null;
  }
}

/**
 * Server-authoritative customer verification against PostgreSQL.
 * Validates session existence AND checks for pre-reset session invalidation.
 */
export async function requireCustomer(
  userId: string | undefined | null,
  sessionIat?: number
): Promise<UserSession | null> {
  if (!userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        fullName: true,
        updatedAt: true,
      },
    });

    if (!user) return null;

    // Server-authoritative session invalidation check
    if (sessionIat) {
      const userUpdatedAtEpoch = Math.floor(user.updatedAt.getTime() / 1000);
      if (sessionIat < userUpdatedAtEpoch - 2) {
        console.warn(`[Session Invalidated] Session iat (${sessionIat}) predates user update (${userUpdatedAtEpoch})`);
        return null;
      }
    }

    return user;
  } catch (error) {
    console.error('Error verifying customer session:', error);
    return null;
  }
}
