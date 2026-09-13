import React from 'react';
import { notFound } from 'next/navigation';
import { getAdminOrderByNumber } from '@/lib/admin/adminOrderService';
import { OrderDetailClient } from './OrderDetailClient';

interface AdminOrderDetailPageProps {
  params: Promise<{
    orderNumber: string;
  }>;
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { orderNumber } = await params;
  const data = await getAdminOrderByNumber(orderNumber);

  if (!data || !data.order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <OrderDetailClient data={data} />
    </div>
  );
}
