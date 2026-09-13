import { prisma } from '@/lib/db/prisma';
import { PaymentStatus, FulfilmentStatus } from '@prisma/client';

type TransactionClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

export async function submitUtr(userId: string, orderNumber: string, utrReference: string) {
  const cleanUtr = utrReference.trim();
  const cleanOrderNumber = orderNumber.trim();

  if (!cleanUtr || cleanUtr.length < 6 || !/^[a-zA-Z0-9_-]+$/.test(cleanUtr)) {
    throw new Error('Invalid UTR / Transaction Reference number. Minimum 6 alphanumeric characters required.');
  }

  return prisma.$transaction(async (tx: TransactionClient) => {
    // 1. Fetch order inside transaction with insensitive match
    const order = await tx.order.findFirst({
      where: {
        orderNumber: { equals: cleanOrderNumber, mode: 'insensitive' },
        userId,
      },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!order) {
      throw new Error('Order not found or unauthorized access.');
    }

    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new Error('This order has already been paid and verified.');
    }

    // 2. Check duplicate UTR reference
    const existingUtr = await tx.payment.findFirst({
      where: {
        utrReference: cleanUtr,
        orderId: { not: order.id },
      },
    });

    if (existingUtr) {
      throw new Error('This UTR / Transaction Reference has already been submitted for another payment.');
    }

    // 3. Find or create Payment record
    const latestPayment = order.payments[0];

    if (latestPayment) {
      await tx.payment.updateMany({
        where: { id: latestPayment.id },
        data: {
          utrReference: cleanUtr,
          status: PaymentStatus.VERIFICATION_PENDING,
          submittedAt: new Date(),
        },
      });
    } else {
      await tx.payment.create({
        data: {
          orderId: order.id,
          expectedAmountPaise: order.totalPaise,
          utrReference: cleanUtr,
          status: PaymentStatus.VERIFICATION_PENDING,
          submittedAt: new Date(),
        },
      });
    }

    // 4. Update order status to VERIFICATION_PENDING
    const updatedOrder = await tx.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: PaymentStatus.VERIFICATION_PENDING,
      },
      include: {
        items: true,
        addressSnapshot: true,
        payments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    // 5. Audit log
    await tx.auditLog.create({
      data: {
        actorUserId: userId,
        action: 'UTR_SUBMITTED',
        entityType: 'Order',
        entityId: order.id,
        payload: { orderNumber: cleanOrderNumber, utrReference: cleanUtr },
      },
    });

    return updatedOrder;
  });
}

// Prepared service for future admin verification phase
export async function confirmPaymentTransaction(adminUserId: string, orderId: string) {
  return prisma.$transaction(async (tx: TransactionClient) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true, payments: true },
    });

    if (!order) {
      throw new Error('Order not found.');
    }

    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new Error('Payment has already been confirmed.');
    }

    // Decrement physical stock and reserved stock
    for (const item of order.items) {
      const book = await tx.book.findUnique({ where: { id: item.bookId } });
      if (!book) continue;

      await tx.book.update({
        where: { id: item.bookId },
        data: {
          stock: Math.max(0, book.stock - item.quantity),
          reservedStock: Math.max(0, book.reservedStock - item.quantity),
        },
      });
    }

    // Update payment record
    const payment = order.payments[0];
    if (payment) {
      await tx.payment.updateMany({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.PAID,
          verifiedByUserId: adminUserId,
          verifiedAt: new Date(),
        },
      });
    } else {
      await tx.payment.create({
        data: {
          orderId: order.id,
          expectedAmountPaise: order.totalPaise,
          status: PaymentStatus.PAID,
          verifiedByUserId: adminUserId,
          verifiedAt: new Date(),
        },
      });
    }

    // Update order
    const updatedOrder = await tx.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: PaymentStatus.PAID,
        fulfilmentStatus: FulfilmentStatus.CONFIRMED,
        reservationExpiresAt: null,
      },
    });

    // Audit log
    const actorUser = adminUserId ? await tx.user.findUnique({ where: { id: adminUserId } }) : null;
    await tx.auditLog.create({
      data: {
        actorUserId: actorUser ? adminUserId : null,
        action: 'PAYMENT_VERIFIED',
        entityType: 'Order',
        entityId: order.id,
        payload: { orderNumber: order.orderNumber, verifiedBy: adminUserId },
      },
    });

    return updatedOrder;
  });
}
