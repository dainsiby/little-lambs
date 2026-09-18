import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getCustomerOrders } from '@/lib/orders/orderService';
import { PageHero } from '@/components/layout/PageHero';
import { Footer } from '@/components/layout/Footer';
import InnerHeader from '@/components/layout/InnerHeader';
import Link from 'next/link';

export const metadata = {
  title: 'My Orders | Little Lambs Store',
  description: 'View and track your Little Lambs purchase history.',
};

export const revalidate = 0; // Dynamic server rendering for live order history

export default async function CustomerOrderHistoryPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/account/orders');
  }

  const orders = await getCustomerOrders(session.user.id);

  return (
    <main id="main-content" className="site-canvas inner-canvas">
      <div className="landing-hero inner-hero-container">
        <PageHero
          title="My Orders"
          subtitle="View and track your Little Lambs purchase history."
          badge="Order History"
        />

        <article className="account-container max-w-4xl mx-auto pb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#092e4c] m-0">Order History</h2>
            <Link href="/account" className="text-xs font-bold text-[#74291e] hover:underline">
              &larr; Back to Account Profile
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="empty-cart-card text-center py-12">
              <p className="text-slate-600 mb-4">You haven&apos;t placed any orders yet.</p>
              <Link href="/books" className="primary-cta font-bold text-xs py-2.5 px-5">
                Explore Books &rarr;
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="order-card p-6 bg-[#fffefa] border border-[#e2ddcf] rounded-2xl flex flex-wrap justify-between items-center gap-4"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-extrabold text-base text-[#092e4c]">
                        Order #{order.orderNumber}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {new Date(order.placedAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 m-0">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'} &middot; Total:{' '}
                      <strong className="font-mono text-[#74291e]">
                        ₹{(order.totalPaise / 100).toFixed(2)}
                      </strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`status-badge ${
                        order.paymentStatus === 'PAID'
                          ? 'paid'
                          : order.paymentStatus === 'VERIFICATION_PENDING'
                          ? 'pending'
                          : 'rejected'
                      }`}
                    >
                      {order.paymentStatus.replace('_', ' ')}
                    </span>

                    <Link
                      href={`/account/orders/${order.orderNumber}`}
                      className="secondary-cta text-xs font-bold py-2 px-4 rounded-full"
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>

        <Footer inner />
      </div>
    </main>
  );
}
