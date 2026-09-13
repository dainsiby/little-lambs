import { prisma } from '@/lib/db/prisma';
import { adminInventoryAdjustmentSchema, AdminInventoryAdjustmentInput } from '@/lib/validation/adminInventory';

export async function getAdminInventoryOverview() {
  const books = await prisma.book.findMany({
    where: { status: { not: 'ARCHIVED' } },
    orderBy: { title: 'asc' },
    select: {
      id: true,
      title: true,
      sku: true,
      isbn: true,
      pricePaise: true,
      stock: true,
      reservedStock: true,
      status: true,
    },
  });

  return books.map((b) => ({
    ...b,
    availableStock: Math.max(0, b.stock - b.reservedStock),
  }));
}

export async function adjustPhysicalStock(adminUserId: string, input: AdminInventoryAdjustmentInput) {
  const validated = adminInventoryAdjustmentSchema.parse(input);

  return prisma.$transaction(async (tx) => {
    // 1. Reload Book record inside transaction
    const book = await tx.book.findUnique({
      where: { id: validated.bookId },
    });

    if (!book) {
      throw new Error('Book not found for stock adjustment.');
    }

    const previousStock = book.stock;
    const newStock = previousStock + validated.quantityDelta;

    // 2. Validate transactional inventory safety: physical stock MUST BE >= reservedStock
    if (newStock < book.reservedStock) {
      throw new Error(
        `Cannot reduce physical stock to ${newStock}. Current reserved stock is ${book.reservedStock}. Available stock cannot be negative.`
      );
    }

    if (newStock < 0) {
      throw new Error(`Physical stock cannot be negative (attempted: ${newStock}).`);
    }

    // 3. Update Book physical stock
    const updatedBook = await tx.book.update({
      where: { id: book.id },
      data: {
        stock: newStock,
      },
    });

    // 4. Create append-only StockMovement record
    const actorUser = await tx.user.findUnique({ where: { id: adminUserId } });
    const stockMovement = await tx.stockMovement.create({
      data: {
        bookId: book.id,
        type: validated.type,
        quantityDelta: validated.quantityDelta,
        previousStock,
        newStock,
        reason: validated.reason,
        actorUserId: actorUser ? adminUserId : null,
      },
    });

    // 5. Create AuditLog entry
    await tx.auditLog.create({
      data: {
        actorUserId: actorUser ? adminUserId : null,
        action: 'STOCK_ADJUSTED',
        entityType: 'Book',
        entityId: book.id,
        payload: {
          bookTitle: book.title,
          sku: book.sku,
          previousStock,
          newStock,
          quantityDelta: validated.quantityDelta,
          reason: validated.reason,
          type: validated.type,
        },
      },
    });

    return {
      book: updatedBook,
      availableStock: Math.max(0, updatedBook.stock - updatedBook.reservedStock),
      stockMovement,
    };
  });
}

export async function getRecentStockMovements(limit = 20) {
  return prisma.stockMovement.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      book: { select: { title: true, sku: true } },
      actor: { select: { fullName: true, email: true } },
    },
  });
}

