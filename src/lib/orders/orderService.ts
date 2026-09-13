import { prisma } from '@/lib/db/prisma';
import { calculateShippingPaise } from '@/lib/shipping/shippingStrategy';
import { generateOrderNumber } from '@/lib/orders/orderNumberGenerator';
import { BookStatus, PaymentStatus, FulfilmentStatus } from '@prisma/client';

export const RESERVATION_EXPIRY_HOURS = Number(process.env.RESERVATION_EXPIRY_HOURS) || 24;

export interface CreateOrderParams {
  userId: string;
  addressId: string;
  customerNotes?: string;
  idempotencyKey?: string;
}

export async function createOrder({
  userId,
  addressId,
  customerNotes,
  idempotencyKey,
}: CreateOrderParams) {
  // Verify address ownership
  const address = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });

  if (!address) {
    throw new Error('Selected delivery address not found or unauthorized.');
  }

  // Idempotency check: if customer notes contain idempotency tag, check existing order first
  if (idempotencyKey) {
    const existingOrder = await prisma.order.findFirst({
      where: {
        userId,
        customerNotes: { contains: `[IDEMPOTENCY_KEY:${idempotencyKey}]` },
      },
      include: {
        items: true,
        addressSnapshot: true,
        payments: true,
      },
    });
    if (existingOrder) {
      return existingOrder;
    }
  }

  // Load user cart
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          book: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error('Your cart is empty.');
  }

  const reservationExpiresAt = new Date(Date.now() + RESERVATION_EXPIRY_HOURS * 60 * 60 * 1000);
  const formattedNotes = idempotencyKey
    ? `${customerNotes || ''} [IDEMPOTENCY_KEY:${idempotencyKey}]`.trim()
    : customerNotes || null;

  // Execute database transaction
  return prisma.$transaction(async (tx) => {
    // Reload items and verify active status & available stock inside transaction
    let subtotalPaise = 0;
    const itemSnapshots = [];

    for (const item of cart.items) {
      const book = await tx.book.findUnique({
        where: { id: item.bookId },
      });

      if (!book || book.status !== BookStatus.ACTIVE) {
        throw new Error(`Book "${item.book.title}" is currently unavailable.`);
      }

      const availableStock = book.stock - book.reservedStock;
      if (availableStock < item.quantity) {
        throw new Error(
          `Insufficient available stock for "${book.title}". Available: ${Math.max(0, availableStock)}, requested: ${item.quantity}.`
        );
      }

      const unitPricePaise = book.pricePaise;
      const lineTotalPaise = unitPricePaise * item.quantity;
      subtotalPaise += lineTotalPaise;

      itemSnapshots.push({
        bookId: book.id,
        titleSnapshot: book.title,
        skuSnapshot: book.sku,
        unitPricePaise,
        quantity: item.quantity,
        lineTotalPaise,
      });
    }

    const shippingPaise = calculateShippingPaise(subtotalPaise);
    const totalPaise = subtotalPaise + shippingPaise;

    // Generate unique order number
    let orderNumber = generateOrderNumber();
    let collisionCheck = await tx.order.findUnique({ where: { orderNumber } });
    let attempts = 0;
    while (collisionCheck && attempts < 5) {
      orderNumber = generateOrderNumber();
      collisionCheck = await tx.order.findUnique({ where: { orderNumber } });
      attempts++;
    }

    // Create Order
    const order = await tx.order.create({
      data: {
        orderNumber,
        userId,
        paymentStatus: PaymentStatus.PENDING,
        fulfilmentStatus: FulfilmentStatus.AWAITING_PAYMENT,
        subtotalPaise,
        shippingPaise,
        totalPaise,
        customerNotes: formattedNotes,
        reservationExpiresAt,
      },
    });

    // Create OrderItems
    for (const item of itemSnapshots) {
      await tx.orderItem.create({
        data: {
          orderId: order.id,
          bookId: item.bookId,
          titleSnapshot: item.titleSnapshot,
          skuSnapshot: item.skuSnapshot,
          unitPricePaise: item.unitPricePaise,
          quantity: item.quantity,
          lineTotalPaise: item.lineTotalPaise,
        },
      });
    }

    // Create OrderAddressSnapshot
    await tx.orderAddressSnapshot.create({
      data: {
        orderId: order.id,
        fullName: address.fullName,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        city: address.city,
        district: address.district,
        state: address.state,
        postalCode: address.postalCode,
        landmark: address.landmark,
        country: address.country,
      },
    });

    // Create Payment record
    await tx.payment.create({
      data: {
        orderId: order.id,
        expectedAmountPaise: totalPaise,
        status: PaymentStatus.PENDING,
      },
    });

    // Increment reserved stock for each book
    for (const item of itemSnapshots) {
      await tx.book.update({
        where: { id: item.bookId },
        data: {
          reservedStock: { increment: item.quantity },
        },
      });
    }

    // Clear cart items
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    // Audit Log
    await tx.auditLog.create({
      data: {
        actorUserId: userId,
        action: 'ORDER_CREATED',
        entityType: 'Order',
        entityId: order.id,
        payload: { orderNumber, totalPaise },
      },
    });

    return order;
  });
}

export async function getCustomerOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: true,
      addressSnapshot: true,
      payments: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { placedAt: 'desc' },
  });
}

export async function getOrderByNumber(userId: string, orderNumber: string) {
  const order = await prisma.order.findFirst({
    where: {
      orderNumber,
      userId, // Strict IDOR ownership enforcement
    },
    include: {
      items: true,
      addressSnapshot: true,
      payments: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  return order;
}
