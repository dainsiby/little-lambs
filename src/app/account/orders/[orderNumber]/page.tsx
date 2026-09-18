import React from 'react';
import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { getOrderByNumber } from '@/lib/orders/orderService';
import { generateUpiPaymentUri, getUpiCredentials } from '@/lib/payment/upi';
import { PageHero } from '@/components/layout/PageHero';
import { Footer } from '@/components/layout/Footer';
import InnerHeader from '@/components/layout/InnerHeader';
import Link from 'next/link';
import { UtrForm } from './UtrForm';
import { CheckCircle2, Clock, MapPin, PackageCheck, QrCode } from 'lucide-react';

export const revalidate = 0; // Dynamic server rendering for live order status

export default async function CustomerOrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/account/orders');
  }

  const { orderNumber } = await params;
  const order = await getOrderByNumber(session.user.id, orderNumber);

  // Strict ownership protection: if order doesn't exist or belong to this user, 404
  if (!order) {
    notFound();
  }

  const upiUri = generateUpiPaymentUri({
    orderNumber: order.orderNumber,
    amountPaise: order.totalPaise,
  });

  const { vpa, payeeName } = getUpiCredentials();
  const latestPayment = order.payments[0];

  const subtotalDisplay = (order.subtotalPaise / 100).toFixed(2);
  const shippingDisplay = order.shippingPaise === 0 ? 'FREE' : `₹${(order.shippingPaise / 100).toFixed(2)}`;
  const totalDisplay = (order.totalPaise / 100).toFixed(2);

  return (
    <main id="main-content" className="site-canvas inner-canvas">
      <div className="landing-hero inner-hero-container">
        <PageHero
          title={`Order ${order.orderNumber}`}
          subtitle={`Placed on ${new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`}
          badge="Order Confirmation & Payment"
        />

        <article className="account-container order-detail-wrapper">
          <div className="mb-4">
            <Link href="/account/orders" className="text-xs font-bold text-brand-maroon hover:underline">
              &larr; Back to Order History
            </Link>
          </div>

          <div className="order-card">
            {/* Status Header */}
            <div className="order-status-header">
              <div>
                <h2 className="text-xl font-extrabold text-brand-navy m-0">
                  Order {order.orderNumber}
                </h2>
                <p className="text-xs text-slate-500 m-0 mt-1">
                  Reference ID: {order.id}
                </p>
              </div>

              <div className="order-status-badges">
                <span
                  className={`status-badge ${
                    order.paymentStatus === 'PAID'
                      ? 'paid'
                      : order.paymentStatus === 'VERIFICATION_PENDING'
                      ? 'pending'
                      : 'rejected'
                  }`}
                >
                  Payment: {order.paymentStatus.replace('_', ' ')}
                </span>
                <span className="status-badge fulfilment">
                  Fulfilment: {order.fulfilmentStatus.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Delivery Address Snapshot */}
            {order.addressSnapshot && (
              <div className="address-snapshot-box">
                <h3 className="text-sm font-bold text-brand-navy m-0 mb-2 flex items-center gap-2">
                  <MapPin size={16} className="text-brand-maroon" /> Delivery Address Snapshot
                </h3>
                <p className="text-xs text-slate-700 m-0 leading-relaxed">
                  <strong>{order.addressSnapshot.fullName}</strong> ({order.addressSnapshot.phone})<br />
                  {order.addressSnapshot.addressLine1}
                  {order.addressSnapshot.addressLine2 ? `, ${order.addressSnapshot.addressLine2}` : ''}<br />
                  {order.addressSnapshot.city}, {order.addressSnapshot.state} &ndash; {order.addressSnapshot.postalCode}, {order.addressSnapshot.country}
                </p>
              </div>
            )}

            {/* Shipping & Tracking Status */}
            {order.fulfilmentStatus === 'SHIPPED' || order.fulfilmentStatus === 'DELIVERED' || order.trackingNumber ? (
              <div className="tracking-info-box">
                <h3 className="text-sm font-bold m-0 mb-1 flex items-center gap-2">
                  <PackageCheck size={16} />{' '}
                  {order.deliveryMethod === 'LOCAL_DELIVERY' || order.shippingCarrier === 'Local Delivery'
                    ? order.fulfilmentStatus === 'DELIVERED'
                      ? 'Delivered via Local Delivery'
                      : 'Out for Local Delivery'
                    : order.fulfilmentStatus === 'DELIVERED'
                    ? 'Delivered via DTDC Courier'
                    : 'Order Shipped via DTDC'}
                </h3>
                <p className="text-xs m-0">
                  Delivery Method:{' '}
                  <strong>
                    {order.deliveryMethod === 'LOCAL_DELIVERY' || order.shippingCarrier === 'Local Delivery'
                      ? 'Local Direct Delivery'
                      : 'DTDC Courier'}
                  </strong>
                  {order.deliveryMethod !== 'LOCAL_DELIVERY' && order.shippingCarrier !== 'Local Delivery' && order.trackingNumber && (
                    <>
                      {' '}
                      | Tracking / AWB #:{' '}
                      <strong className="font-mono">{order.trackingNumber}</strong>
                    </>
                  )}
                </p>
              </div>
            ) : null}

            {/* Order Items Table */}
            <h3 className="text-sm font-bold text-brand-navy mb-3">Order Items</h3>
            <div className="border-t border-[#eee8db] mb-4">
              {order.items.map((item) => (
                <div key={item.id} className="ordered-item-row">
                  <div>
                    <p className="font-bold text-sm text-brand-navy m-0">{item.titleSnapshot}</p>
                    <p className="text-xs text-slate-500 m-0">
                      Qty: {item.quantity} &times; ₹{(item.unitPricePaise / 100).toFixed(2)} | SKU: {item.skuSnapshot}
                    </p>
                  </div>
                  <div className="font-mono font-bold text-sm text-brand-maroon">
                    ₹{(item.lineTotalPaise / 100).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Totals Summary */}
            <div className="order-totals-box">
              <div className="order-totals-row">
                <span>Subtotal:</span>
                <span>₹{subtotalDisplay}</span>
              </div>
              <div className="order-totals-row">
                <span>Shipping:</span>
                <span>{shippingDisplay}</span>
              </div>
              <div className="order-totals-grand">
                <span>Total Payable:</span>
                <span>₹{totalDisplay}</span>
              </div>
            </div>

            {/* Manual UPI Payment Presentation */}
            {order.paymentStatus === 'PAID' ? (
              <div className="payment-banner paid">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={24} className="text-emerald-700" />
                  <div>
                    <h4 className="font-bold text-sm m-0">Payment Received & Verified</h4>
                    <p className="text-xs m-0 mt-0.5">
                      Thank you! Your payment of ₹{totalDisplay} has been confirmed. Your order is being processed for shipping.
                    </p>
                  </div>
                </div>
              </div>
            ) : order.paymentStatus === 'VERIFICATION_PENDING' ? (
              <div className="payment-banner pending">
                <div className="flex items-center gap-3">
                  <Clock size={24} className="text-amber-700" />
                  <div>
                    <h4 className="font-bold text-sm m-0">Payment Verification Pending</h4>
                    <p className="text-xs m-0 mt-0.5">
                      Your UTR submission (Reference: <strong className="font-mono">{latestPayment?.utrReference || 'Submitted'}</strong>) is being verified by our team. You will receive an update once confirmed.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="upi-instructions-card mt-6">
                <h3 className="text-base font-bold text-brand-maroon m-0 mb-2 flex items-center gap-2">
                  <QrCode size={20} /> Complete Payment via Manual UPI
                </h3>
                <p className="text-xs text-slate-600 m-0 leading-relaxed">
                  Scan the QR code or use the UPI VPA details below to complete your payment of <strong>₹{totalDisplay}</strong> for Order #{order.orderNumber}.
                </p>

                <div className="upi-credentials-pill">
                  <p className="m-0"><strong>Payee:</strong> {payeeName}</p>
                  <p className="m-0"><strong>UPI VPA:</strong> <span className="font-mono text-brand-maroon font-bold">{vpa}</span></p>
                  <p className="m-0"><strong>Amount:</strong> ₹{totalDisplay}</p>
                  <p className="m-0"><strong>Note / Remark:</strong> {order.orderNumber}</p>
                </div>

                <div className="mb-6 flex flex-wrap gap-4 items-center">
                  <a
                    href={upiUri}
                    className="primary-cta inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-full"
                  >
                    Open in UPI App &rarr;
                  </a>
                </div>

                {/* UTR Submission Form Component */}
                <UtrForm orderNumber={order.orderNumber} />
              </div>
            )}
          </div>
        </article>

        <Footer inner />
      </div>
    </main>
  );
}
