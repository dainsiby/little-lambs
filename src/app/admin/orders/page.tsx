import React from 'react';
import { getAdminOrders } from '@/lib/admin/adminOrderService';
import { OrdersClient } from './OrdersClient';
import { PaymentStatus, FulfilmentStatus } from '@prisma/client';

interface AdminOrdersPageProps {
  searchParams: Promise<{
    paymentStatus?: string;
    fulfilmentStatus?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || '1', 10);
  const paymentStatus = resolvedSearchParams.paymentStatus as PaymentStatus | undefined;
  const fulfilmentStatus = resolvedSearchParams.fulfilmentStatus as FulfilmentStatus | undefined;
  const search = resolvedSearchParams.search;

  const result = await getAdminOrders({
    paymentStatus,
    fulfilmentStatus,
    search,
    page,
    limit: 20,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-extrabold text-brand-maroon">
          Order Management
        </h1>
        <p className="text-xs text-brand-slate">
          Filter and manage customer orders, track payments, review items, and update fulfilment and shipping statuses.
        </p>
      </div>

      <OrdersClient
        orders={result.orders}
        totalCount={result.totalCount}
        totalPages={result.totalPages}
        currentPage={result.page}
        initialSearch={search || ''}
        initialPaymentStatus={paymentStatus || ''}
        initialFulfilmentStatus={fulfilmentStatus || ''}
      />
    </div>
  );
}
