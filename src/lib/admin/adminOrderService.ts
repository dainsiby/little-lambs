import { prisma } from '@/lib/db/prisma';
import { PaymentStatus, FulfilmentStatus, StockMovementType } from '@prisma/client';
import {
  adminVerifyPaymentSchema,
  adminRejectPaymentSchema,
  adminFulfilmentTransitionSchema,
} from '@/lib/validation/adminOrder';

export interface AdminOrderFilterOptions {
  paymentStatus?: PaymentStatus;
  fulfilmentStatus?: FulfilmentStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getAdminOrders(options: AdminOrderFilterOptions = {}) {
  const { paymentStatus, fulfilmentStatus, search, page = 1, limit = 20 } = options;

  const where: any = {};

  if (paymentStatus) {
    where.paymentStatus = paymentStatus;
  }

  if (fulfilmentStatus) {
    where.fulfilmentStatus = fulfilmentStatus;
  }

  if (search && search.trim()) {
    const term = search.trim();
    where.OR = [
      { orderNumber: { contains: term, mode: 'insensitive' } },
      { user: { email: { contains: term, mode: 'insensitive' } } },
      { user: { fullName: { contains: term, mode: 'insensitive' } } },
    ];
  }

  const [orders, totalCount] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { placedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        items: true,
        addressSnapshot: true,
        payments: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    page,
  };
}

export async function getAdminOrderByNumber(orderNumber: string) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      user: { select: { id: true, fullName: true, email: true, phone: true } },
      items: true,
      addressSnapshot: true,
      payments: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!order) return null;

  // Fetch related audit logs for timeline
  const auditLogs = await prisma.auditLog.findMany({
    where: {
      entityType: 'Order',
      entityId: order.id,
    },
    orderBy: { createdAt: 'asc' },
    include: {
      actor: { select: { fullName: true, email: true } },
    },
  });

  return {
    order,
    auditLogs,
  };
}

// Critical Payment Verification Service (Idempotent & Transaction-Safe)
export async function verifyOrderPayment(adminUserId: string, orderId: string, adminNote?: string) {
  adminVerifyPaymentSchema.parse({ action: 'VERIFY', adminNote });

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        payments: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });

    if (!order) {
      throw new Error('Order not found.');
    }

    // Idempotency check: if order is already PAID, return without state mutation
    if (order.paymentStatus === PaymentStatus.PAID) {
      return order;
    }

    if (order.paymentStatus !== PaymentStatus.VERIFICATION_PENDING) {
      throw new Error(`Cannot verify payment for order in ${order.paymentStatus} state. Order must be in VERIFICATION_PENDING state with submitted payment evidence.`);
    }


    // Decrement physical stock and reserved stock for each item, recording StockMovement
    const actorUser = await tx.user.findUnique({ where: { id: adminUserId } });

    for (const item of order.items) {
      const book = await tx.book.findUnique({ where: { id: item.bookId } });
      if (!book) continue;

      const previousStock = book.stock;
      const newStock = Math.max(0, book.stock - item.quantity);
      const newReservedStock = Math.max(0, book.reservedStock - item.quantity);

      await tx.book.update({
        where: { id: book.id },
        data: {
          stock: newStock,
          reservedStock: newReservedStock,
        },
      });

      await tx.stockMovement.create({
        data: {
          bookId: book.id,
          type: StockMovementType.ORDER_CONFIRMED,
          quantityDelta: -item.quantity,
          previousStock,
          newStock,
          reason: `Order payment verified (${order.orderNumber})`,
          actorUserId: actorUser ? adminUserId : null,
        },
      });
    }

    // Update Payment record
    const payment = order.payments[0];
    if (payment) {
      await tx.payment.updateMany({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.PAID,
          verifiedByUserId: adminUserId,
          verifiedAt: new Date(),
          adminNote: adminNote || null,
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
          adminNote: adminNote || null,
        },
      });
    }

    // Update Order record
    const updatedOrder = await tx.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: PaymentStatus.PAID,
        fulfilmentStatus: FulfilmentStatus.CONFIRMED,
        reservationExpiresAt: null,
      },
    });

    // Write AuditLog entry
    await tx.auditLog.create({
      data: {
        actorUserId: actorUser ? adminUserId : null,
        action: 'PAYMENT_VERIFIED',
        entityType: 'Order',
        entityId: order.id,
        payload: {
          orderNumber: order.orderNumber,
          totalPaise: order.totalPaise,
          verifiedBy: adminUserId,
        },
      },
    });

    return updatedOrder;
  });
}

// Transaction-Safe Payment Rejection Service
export async function rejectOrderPayment(
  adminUserId: string,
  orderId: string,
  rejectionReason: string,
  adminNote?: string
) {
  const validated = adminRejectPaymentSchema.parse({
    action: 'REJECT',
    rejectionReason,
    adminNote,
  });

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: {
        payments: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });

    if (!order) {
      throw new Error('Order not found.');
    }

    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new Error('Cannot reject an already verified and paid order.');
    }

    const payment = order.payments[0];
    if (payment) {
      await tx.payment.updateMany({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.REJECTED,
          rejectionReason: validated.rejectionReason,
          adminNote: validated.adminNote || null,
        },
      });
    }

    // Set order paymentStatus = REJECTED. Reserved stock remains intact until reservation expiry
    const updatedOrder = await tx.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: PaymentStatus.REJECTED,
      },
    });

    const actorUser = await tx.user.findUnique({ where: { id: adminUserId } });
    await tx.auditLog.create({
      data: {
        actorUserId: actorUser ? adminUserId : null,
        action: 'PAYMENT_REJECTED',
        entityType: 'Order',
        entityId: order.id,
        payload: {
          orderNumber: order.orderNumber,
          rejectionReason: validated.rejectionReason,
        },
      },
    });

    return updatedOrder;
  });
}

// Transactional Fulfilment State Transitions
export async function updateOrderFulfilment(
  adminUserId: string,
  orderNumber: string,
  input: { status: FulfilmentStatus; shippingCarrier?: string; trackingNumber?: string }
) {
  const validated = adminFulfilmentTransitionSchema.parse(input);

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { orderNumber },
    });

    if (!order) {
      throw new Error('Order not found.');
    }

    const targetStatus = validated.status;

    // State machine guards
    if (targetStatus === FulfilmentStatus.PROCESSING) {
      if (order.fulfilmentStatus !== FulfilmentStatus.CONFIRMED) {
        throw new Error(`Cannot move order to PROCESSING from ${order.fulfilmentStatus}. Must be CONFIRMED.`);
      }
    } else if (targetStatus === FulfilmentStatus.SHIPPED) {
      if (
        order.fulfilmentStatus !== FulfilmentStatus.CONFIRMED &&
        order.fulfilmentStatus !== FulfilmentStatus.PROCESSING
      ) {
        throw new Error(`Cannot move order to SHIPPED from ${order.fulfilmentStatus}.`);
      }
      if (!validated.shippingCarrier || !validated.trackingNumber) {
        throw new Error('Shipping carrier and tracking number are required when shipping an order.');
      }
    } else if (targetStatus === FulfilmentStatus.DELIVERED) {
      if (order.fulfilmentStatus !== FulfilmentStatus.SHIPPED) {
        throw new Error(`Cannot move order to DELIVERED from ${order.fulfilmentStatus}. Must be SHIPPED.`);
      }
    }

    const updateData: any = {
      fulfilmentStatus: targetStatus,
    };

    let auditAction = `ORDER_${targetStatus}`;

    if (targetStatus === FulfilmentStatus.SHIPPED) {
      updateData.shippingCarrier = validated.shippingCarrier;
      updateData.trackingNumber = validated.trackingNumber;
      updateData.shippedAt = new Date();
    } else if (targetStatus === FulfilmentStatus.DELIVERED) {
      updateData.deliveredAt = new Date();
    }

    const updatedOrder = await tx.order.update({
      where: { id: order.id },
      data: updateData,
    });

    const actorUser = await tx.user.findUnique({ where: { id: adminUserId } });
    await tx.auditLog.create({
      data: {
        actorUserId: actorUser ? adminUserId : null,
        action: auditAction,
        entityType: 'Order',
        entityId: order.id,
        payload: {
          orderNumber: order.orderNumber,
          previousStatus: order.fulfilmentStatus,
          newStatus: targetStatus,
          shippingCarrier: validated.shippingCarrier,
          trackingNumber: validated.trackingNumber,
        },
      },
    });

    return updatedOrder;
  });
}
