import { prisma } from '@/lib/db/prisma';
import { adminBookSchema, AdminBookInput } from '@/lib/validation/adminBook';

export async function getAdminBooks() {
  return prisma.book.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      images: true,
      _count: {
        select: { orderItems: true },
      },
    },
  });
}

export async function getAdminBookById(id: string) {
  return prisma.book.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      stockMovements: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { actor: { select: { fullName: true, email: true } } },
      },
    },
  });
}

export async function createAdminBook(adminUserId: string, input: AdminBookInput) {
  const validated = adminBookSchema.parse(input);

  const existingSlug = await prisma.book.findUnique({ where: { slug: validated.slug } });
  if (existingSlug) {
    throw new Error('A book with this slug already exists.');
  }

  const existingSku = await prisma.book.findUnique({ where: { sku: validated.sku } });
  if (existingSku) {
    throw new Error('A book with this SKU already exists.');
  }

  const existingIsbn = await prisma.book.findUnique({ where: { isbn: validated.isbn } });
  if (existingIsbn) {
    throw new Error('A book with this ISBN already exists.');
  }

  return prisma.$transaction(async (tx) => {
    const releaseDateObj = validated.releaseDate ? new Date(validated.releaseDate) : null;

    const book = await tx.book.create({
      data: {
        title: validated.title,
        subtitle: validated.subtitle || null,
        slug: validated.slug,
        sku: validated.sku,
        isbn: validated.isbn,
        shortDescription: validated.shortDescription || null,
        description: validated.description,
        pricePaise: validated.pricePaise,
        ageMin: validated.ageMin,
        ageMax: validated.ageMax,
        language: validated.language,
        publisher: validated.publisher,
        edition: validated.edition || null,
        releaseDate: releaseDateObj,
        status: validated.status,
        featured: validated.featured,
        stock: 0, // Physical stock defaults to 0; updated via explicit inventory adjustments
        reservedStock: 0,
      },
    });

    const actorUser = await tx.user.findUnique({ where: { id: adminUserId } });
    await tx.auditLog.create({
      data: {
        actorUserId: actorUser ? adminUserId : null,
        action: 'BOOK_CREATED',
        entityType: 'Book',
        entityId: book.id,
        payload: { title: book.title, sku: book.sku, pricePaise: book.pricePaise },
      },
    });

    return book;
  });
}

export async function updateAdminBook(adminUserId: string, id: string, input: Partial<AdminBookInput>) {
  const existing = await prisma.book.findUnique({ where: { id } });
  if (!existing) {
    throw new Error('Book not found.');
  }

  const validated = adminBookSchema.partial().parse(input);

  return prisma.$transaction(async (tx) => {
    const updateData: any = { ...validated };
    if (validated.releaseDate !== undefined) {
      updateData.releaseDate = validated.releaseDate ? new Date(validated.releaseDate) : null;
    }

    const updated = await tx.book.update({
      where: { id },
      data: updateData,
    });

    const actorUser = await tx.user.findUnique({ where: { id: adminUserId } });
    await tx.auditLog.create({
      data: {
        actorUserId: actorUser ? adminUserId : null,
        action: 'BOOK_UPDATED',
        entityType: 'Book',
        entityId: id,
        payload: { title: updated.title, sku: updated.sku, status: updated.status },
      },
    });

    return updated;
  });
}

export async function archiveAdminBook(adminUserId: string, id: string) {
  const existing = await prisma.book.findUnique({ where: { id } });
  if (!existing) {
    throw new Error('Book not found.');
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.book.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });

    const actorUser = await tx.user.findUnique({ where: { id: adminUserId } });
    await tx.auditLog.create({
      data: {
        actorUserId: actorUser ? adminUserId : null,
        action: 'BOOK_ARCHIVED',
        entityType: 'Book',
        entityId: id,
        payload: { title: updated.title },
      },
    });

    return updated;
  });
}
