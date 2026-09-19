import { prisma } from '@/lib/db/prisma';

export const LOW_STOCK_THRESHOLD = Number(process.env.LOW_STOCK_THRESHOLD) || 5;

export async function getAdminDashboardMetrics() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [
    activeBooksCount,
    totalBooks,
    stockAggregates,
    pendingVerificationsCount,
    confirmedOrdersCount,
    processingOrdersCount,
    shippedOrdersCount,
    deliveredOrdersCount,
    paidRevenueAggregate,
    recentOrders,
    recentPayments,
    recentAuditLogs,
    lowStockBooks,
    dtdcTrackingMissingCount,
    localProcessingCount,
    localShippedCount,
    localDeliveredTodayCount,
    dtdcShippedCount,
    dtdcDeliveredTodayCount,
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
    prisma.order.count({ where: { fulfilmentStatus: 'DELIVERED' } }),
    // EXPLICIT REQUIREMENT: Revenue ONLY counts successfully PAID orders.
    prisma.order.aggregate({
      where: { paymentStatus: 'PAID' },
      _sum: {
        totalPaise: true,
      },
    }),
    prisma.order.findMany({
      take: 8,
      orderBy: { placedAt: 'desc' },
      include: {
        user: { select: { fullName: true, email: true } },
      },
    }),
    prisma.payment.findMany({
      where: { status: 'VERIFICATION_PENDING' },
      take: 8,
      orderBy: { submittedAt: 'desc' },
      include: {
        order: {
          select: {
            orderNumber: true,
            totalPaise: true,
            user: { select: { fullName: true, email: true } },
          },
        },
      },
    }),
    prisma.auditLog.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        actor: { select: { fullName: true, email: true } },
      },
    }),
    prisma.book.findMany({
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
    }),
    prisma.order.count({
      where: {
        deliveryMethod: 'DTDC',
        fulfilmentStatus: 'PROCESSING',
        trackingNumber: null,
      },
    }),
    prisma.order.count({
      where: {
        deliveryMethod: 'LOCAL_DELIVERY',
        fulfilmentStatus: 'PROCESSING',
      },
    }),
    prisma.order.count({
      where: {
        deliveryMethod: 'LOCAL_DELIVERY',
        fulfilmentStatus: 'SHIPPED',
      },
    }),
    prisma.order.count({
      where: {
        deliveryMethod: 'LOCAL_DELIVERY',
        fulfilmentStatus: 'DELIVERED',
        updatedAt: { gte: startOfToday },
      },
    }),
    prisma.order.count({
      where: {
        deliveryMethod: 'DTDC',
        fulfilmentStatus: 'SHIPPED',
      },
    }),
    prisma.order.count({
      where: {
        deliveryMethod: 'DTDC',
        fulfilmentStatus: 'DELIVERED',
        updatedAt: { gte: startOfToday },
      },
    }),
  ]);

  const physicalStock = stockAggregates._sum.stock || 0;
  const reservedStock = stockAggregates._sum.reservedStock || 0;
  const availableStock = Math.max(0, physicalStock - reservedStock);

  // Assemble Needs Attention List (max 10 entries)
  const needsAttentionItems: Array<{
    id: string;
    type: 'PAYMENT_VERIFICATION' | 'DELIVERY_UNASSIGNED' | 'DTDC_MISSING_TRACKING' | 'LOCAL_READY' | 'LOW_STOCK';
    title: string;
    subtitle: string;
    actionUrl: string;
    urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  }> = [];

  // Add pending payments
  recentPayments.slice(0, 3).forEach((pmt) => {
    needsAttentionItems.push({
      id: `pmt-${pmt.id}`,
      type: 'PAYMENT_VERIFICATION',
      title: `Payment Verification Pending (${pmt.order.orderNumber})`,
      subtitle: `UTR: ${pmt.utrReference || 'Not provided'} | Customer: ${pmt.order.user.fullName}`,
      actionUrl: '/admin/payments',
      urgency: 'HIGH',
    });
  });

  // Add unassigned delivery orders
  if (confirmedOrdersCount > 0) {
    needsAttentionItems.push({
      id: 'attn-confirmed',
      type: 'DELIVERY_UNASSIGNED',
      title: `${confirmedOrdersCount} Confirmed Orders Awaiting Delivery Assignment`,
      subtitle: 'Assign shipping method (Local Delivery vs DTDC Courier)',
      actionUrl: '/admin/orders?fulfilmentStatus=CONFIRMED',
      urgency: 'HIGH',
    });
  }

  // Add DTDC missing tracking
  if (dtdcTrackingMissingCount > 0) {
    needsAttentionItems.push({
      id: 'attn-dtdc-tracking',
      type: 'DTDC_MISSING_TRACKING',
      title: `${dtdcTrackingMissingCount} DTDC Orders Missing AWB Tracking`,
      subtitle: 'Enter DTDC courier consignment AWB number to ship',
      actionUrl: '/admin/orders?deliveryMethod=DTDC&missingTracking=true',
      urgency: 'HIGH',
    });
  }

  // Add Local ready for delivery
  if (localProcessingCount > 0) {
    needsAttentionItems.push({
      id: 'attn-local-processing',
      type: 'LOCAL_READY',
      title: `${localProcessingCount} Local Orders Processing`,
      subtitle: 'Ready to mark as Out for Local Delivery',
      actionUrl: '/admin/orders?deliveryMethod=LOCAL_DELIVERY&fulfilmentStatus=PROCESSING',
      urgency: 'MEDIUM',
    });
  }

  // Add Low stock alert
  lowStockBooks.forEach((bk) => {
    needsAttentionItems.push({
      id: `lowstock-${bk.id}`,
      type: 'LOW_STOCK',
      title: `Low Stock Alert: ${bk.title}`,
      subtitle: `Current physical stock: ${bk.stock} | Reserved: ${bk.reservedStock}`,
      actionUrl: `/admin/inventory`,
      urgency: bk.stock === 0 ? 'HIGH' : 'MEDIUM',
    });
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
      deliveredOrdersCount,
      totalConfirmedRevenuePaise: paidRevenueAggregate._sum.totalPaise || 0,
      lowStockCount: lowStockBooks.length,
      missingTrackingCount: dtdcTrackingMissingCount,
    },
    deliverySummary: {
      local: {
        pending: confirmedOrdersCount,
        processing: localProcessingCount,
        shipped: localShippedCount, // Out for Local Delivery
        deliveredToday: localDeliveredTodayCount,
      },
      dtdc: {
        readyToBook: confirmedOrdersCount,
        trackingMissing: dtdcTrackingMissingCount,
        shipped: dtdcShippedCount,
        deliveredToday: dtdcDeliveredTodayCount,
      },
    },
    needsAttentionItems: needsAttentionItems.slice(0, 8),
    lowStockBooks,
    recentOrders,
    recentPayments,
    recentAuditLogs,
  };
}
