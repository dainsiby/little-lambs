import { prisma } from '@/lib/db/prisma';

export const LOW_STOCK_THRESHOLD = Number(process.env.LOW_STOCK_THRESHOLD) || 5;

export async function getAdminDashboardMetrics() {
  const [
    activeBooksCount,
    totalBooks,
    stockAggregates,
    pendingVerificationsCount,
    confirmedOrdersCount,
    processingOrdersCount,
    shippedOrdersCount,
    paidRevenueAggregate,
    recentOrders,
    recentPayments,
    recentAuditLogs,
  ] = await Promise.all([
    prisma.book.count({ where: { status: 'ACTIVE' } }),
    prisma.book.count({ where: { status: { not: 'ARCHIVED' } } }),
    prisma.book.aggregate({
      where: { status: { not: 'ARCHIVED' } },
      _sum: {
        stock: true,
        reservedStock: true,
      },
    }),
    prisma.payment.count({ where: { status: 'VERIFICATION_PENDING' } }),
    prisma.order.count({ where: { fulfilmentStatus: 'CONFIRMED' } }),
    prisma.order.count({ where: { fulfilmentStatus: 'PROCESSING' } }),
    prisma.order.count({ where: { fulfilmentStatus: 'SHIPPED' } }),
    prisma.order.aggregate({
      where: { paymentStatus: 'PAID' },
      _sum: {
        totalPaise: true,
      },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { placedAt: 'desc' },
      include: {
        user: { select: { fullName: true, email: true } },
      },
    }),
    prisma.payment.findMany({
      where: { status: 'VERIFICATION_PENDING' },
      take: 5,
      orderBy: { submittedAt: 'desc' },
      include: {
        order: { select: { orderNumber: true, totalPaise: true } },
      },
    }),
    prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const physicalStock = stockAggregates._sum.stock || 0;
  const reservedStock = stockAggregates._sum.reservedStock || 0;
  const availableStock = Math.max(0, physicalStock - reservedStock);

  // Check low stock books
  const lowStockBooks = await prisma.book.findMany({
    where: {
      status: 'ACTIVE',
      stock: { lte: LOW_STOCK_THRESHOLD },
    },
    select: {
      id: true,
      title: true,
      sku: true,
      stock: true,
      reservedStock: true,
    },
  });

  return {
    metrics: {
      activeBooksCount,
      totalBooks,
      physicalStock,
      reservedStock,
      availableStock,
      pendingVerificationsCount,
      confirmedOrdersCount,
      processingOrdersCount,
      shippedOrdersCount,
      totalConfirmedRevenuePaise: paidRevenueAggregate._sum.totalPaise || 0,
      lowStockCount: lowStockBooks.length,
    },
    lowStockBooks,
    recentOrders,
    recentPayments,
    recentAuditLogs,
  };
}
