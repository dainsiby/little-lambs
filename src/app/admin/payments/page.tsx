import React from 'react';
import { getAdminOrders } from '@/lib/admin/adminOrderService';
import { PaymentsClient } from './PaymentsClient';
import { PaymentStatus } from '@prisma/client';

export default async function AdminPaymentsPage() {
  const result = await getAdminOrders({
    paymentStatus: PaymentStatus.VERIFICATION_PENDING,
    limit: 50,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-extrabold text-brand-maroon">
          Payment Verification Queue
        </h1>
        <p className="text-xs text-brand-slate">
          Review pending manual UPI UTR payment references submitted by customers and execute transactional payment verification or rejection.
        </p>
      </div>

      <PaymentsClient orders={result.orders as any} totalCount={result.totalCount} />
    </div>
  );
}
