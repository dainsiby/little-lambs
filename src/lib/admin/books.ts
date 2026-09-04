import { prisma } from '@/lib/db/prisma';
import type { BookStatus, Prisma } from '@prisma/client';

export async function getAllAdminBooks() {
  return prisma.book.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      images: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  });
}

export async function getAdminBookById(id: string) {
  return prisma.book.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  });
}

export async function createAdminBook(
  data: Prisma.BookCreateInput,
  actorUserId?: string | null
) {
  const book = await prisma.book.create({ data });

  // Record AuditLog if actorUserId is provided
  try {
    await prisma.auditLog.create({
      data: {
        actorUserId: actorUserId || null,
        action: 'BOOK_CREATE',
        entityType: 'Book',
        entityId: book.id,
        payload: JSON.parse(JSON.stringify(book)),
      },
    });
  } catch (err) {
    console.warn('Could not record AuditLog:', err);
  }

  return book;
}

export async function updateAdminBook(
  id: string,
  data: Prisma.BookUpdateInput,
  actorUserId?: string | null
) {
  const book = await prisma.book.update({
    where: { id },
    data,
  });

  // Record AuditLog
  try {
    await prisma.auditLog.create({
      data: {
        actorUserId: actorUserId || null,
        action: 'BOOK_UPDATE',
        entityType: 'Book',
        entityId: book.id,
        payload: JSON.parse(JSON.stringify(data)),
      },
    });
  } catch (err) {
    console.warn('Could not record AuditLog:', err);
  }

  return book;
}

export async function archiveAdminBook(id: string, actorUserId?: string | null) {
  const book = await prisma.book.update({
    where: { id },
    data: { status: 'ARCHIVED' as BookStatus },
  });

  // Record AuditLog
  try {
    await prisma.auditLog.create({
      data: {
        actorUserId: actorUserId || null,
        action: 'BOOK_ARCHIVE',
        entityType: 'Book',
        entityId: book.id,
      },
    });
  } catch (err) {
    console.warn('Could not record AuditLog:', err);
  }

  return book;
}
