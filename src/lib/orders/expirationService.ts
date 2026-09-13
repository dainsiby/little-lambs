import { prisma } from '@/lib/db/prisma';
import { PaymentStatus, FulfilmentStatus } from '@prisma/client';

export async function expireStaleReservations() {
  const now = new Date();

  // Eligible orders: expired reservation date, paymentStatus is PENDING or REJECTED, fulfilmentStatus is not CANCELLED or DELIVERED.
  // CRITICAL: VERIFICATION_PENDING orders are NOT expired because evidence is submitted.
  const expiredOrders = await prisma.order.findMany({
    where: {
      reservationExpiresAt: { lte: now },
      paymentStatus: { in: [PaymentStatus.PENDING, PaymentStatus.REJECTED] },
      fulfilmentStatus: { notIn: [FulfilmentStatus.CANCELLED, FulfilmentStatus.DELIVERED] },
    },
    include: {
      items: true,
    },
  });

  let processedCount = 0;

  for (const order of expiredOrders) {
    try {
      await prisma.$transaction(async (tx) => {
        // Re-verify order inside transaction to prevent double release / race condition
        const freshOrder = await tx.order.findUnique({
          where: { id: order.id },
          include: { items: true },
        });

        if (
          !freshOrder ||
          freshOrder.fulfilmentStatus === FulfilmentStatus.CANCELLED ||
          freshOrder.paymentStatus === PaymentStatus.VERIFICATION_PENDING ||
          freshOrder.paymentStatus === PaymentStatus.PAID
        ) {
          return;
        }

        // Release reserved stock for each item safely
        for (const item of freshOrder.items) {
          const book = await tx.book.findUnique({ where: { id: item.bookId } });
          if (book) {
            await tx.book.update({
              where: { id: item.bookId },
              data: {
                reservedStock: Math.max(0, book.reservedStock - item.quantity),
              },
            });
          }
        }

        // Update order status to CANCELLED and clear expiry timestamp safely
        await tx.order.updateMany({
          where: { id: order.id },
          data: {
            fulfilmentStatus: FulfilmentStatus.CANCELLED,
            reservationExpiresAt: null,
          },
        });

        // Log audit entry
        await tx.auditLog.create({
          data: {
            actorUserId: null,
            action: 'RESERVATION_EXPIRED',
            entityType: 'Order',
            entityId: order.id,
            payload: { orderNumber: order.orderNumber, reason: 'Reservation time limit exceeded' },
          },
        });

        processedCount++;
      });
    } catch (err) {
      console.error(`[ExpirationService] Error expiring order ${order.id}:`, err);
    }
  }

  return { expiredCount: processedCount };
}
