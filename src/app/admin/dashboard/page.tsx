import React from 'react';
import Link from 'next/link';
import {
  CreditCard,
  CheckCircle,
  Truck,
  AlertTriangle,
  IndianRupee,
  ShoppingBag,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Boxes,
  BookOpen,
} from 'lucide-react';
import { getAdminDashboardMetrics } from '@/lib/admin/adminDashboardService';

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardMetrics();
  const { metrics, needsAttentionItems, recentOrders, recentPayments, deliverySummary, lowStockBooks } = data;

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-body text-brand-navy">
      {/* Top Welcome & Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-maroon/10 pb-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-maroon">
            Admin Operational Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate">
            Real-time fulfillment, payments, inventory, and delivery controls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/payments"
            className="px-3.5 py-2 rounded-xl bg-brand-maroon text-white font-heading font-bold text-xs shadow-xs hover:bg-brand-maroon/90 transition-colors flex items-center gap-1.5"
          >
            <CreditCard className="h-3.5 w-3.5" />
            <span>Verify Payments</span>
          </Link>
          <Link
            href="/admin/orders"
            className="px-3.5 py-2 rounded-xl border border-brand-maroon/15 bg-brand-paper text-brand-navy font-heading font-bold text-xs shadow-xs hover:bg-brand-cream transition-colors flex items-center gap-1.5"
          >
            <ShoppingBag className="h-3.5 w-3.5 text-brand-maroon" />
            <span>Manage Orders</span>
          </Link>
        </div>
      </div>

      {/* ROW 1: 6 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* 1. Pending Payments */}
        <Link
          href="/admin/payments"
          className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 space-y-1.5 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Pending Payment</span>
            <CreditCard className="h-4 w-4" />
          </div>
          <p className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-900 group-hover:scale-105 transition-transform">
            {metrics.pendingVerificationsCount}
          </p>
          <p className="text-[10px] text-amber-700 font-medium">UTR verification needed</p>
        </Link>

        {/* 2. Confirmed Orders */}
        <Link
          href="/admin/orders?fulfilmentStatus=CONFIRMED"
          className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 space-y-1.5 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-blue-800">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Confirmed</span>
            <CheckCircle className="h-4 w-4" />
          </div>
          <p className="font-heading text-2xl sm:text-3xl font-extrabold text-blue-900 group-hover:scale-105 transition-transform">
            {metrics.confirmedOrdersCount}
          </p>
          <p className="text-[10px] text-blue-700 font-medium">Assign delivery method</p>
        </Link>

        {/* 3. Processing Orders */}
        <Link
          href="/admin/orders?fulfilmentStatus=PROCESSING"
          className="rounded-2xl border border-purple-200 bg-purple-50/60 p-4 space-y-1.5 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-purple-800">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Processing</span>
            <Truck className="h-4 w-4" />
          </div>
          <p className="font-heading text-2xl sm:text-3xl font-extrabold text-purple-900 group-hover:scale-105 transition-transform">
            {metrics.processingOrdersCount}
          </p>
          <p className="text-[10px] text-purple-700 font-medium">Packing & booking</p>
        </Link>

        {/* 4. Shipped / Local */}
        <Link
          href="/admin/orders?fulfilmentStatus=SHIPPED"
          className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4 space-y-1.5 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-indigo-800">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Shipped / Local</span>
            <Truck className="h-4 w-4 text-indigo-600" />
          </div>
          <p className="font-heading text-2xl sm:text-3xl font-extrabold text-indigo-900 group-hover:scale-105 transition-transform">
            {metrics.shippedOrdersCount}
          </p>
          <p className="text-[10px] text-indigo-700 font-medium">In transit / local delivery</p>
        </Link>

        {/* 5. Low Stock */}
        <Link
          href="/admin/inventory"
          className="rounded-2xl border border-red-200 bg-red-50/60 p-4 space-y-1.5 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-red-800">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Low Stock</span>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </div>
          <p className="font-heading text-2xl sm:text-3xl font-extrabold text-red-900 group-hover:scale-105 transition-transform">
            {metrics.lowStockCount}
          </p>
          <p className="text-[10px] text-red-700 font-medium">Stock ≤ 5 units</p>
        </Link>

        {/* 6. Paid Revenue (EXPLICIT: ONLY PAID ORDERS) */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Paid Revenue</span>
            <IndianRupee className="h-4 w-4 text-emerald-700" />
          </div>
          <p className="font-heading text-2xl sm:text-3xl font-extrabold text-emerald-950">
            ₹{(metrics.totalConfirmedRevenuePaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] text-emerald-700 font-medium">Confirmed paid orders only</p>
        </div>
      </div>

      {/* ROW 2: Needs Attention & Payment Verification Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Needs Attention Panel */}
        <div className="rounded-3xl border border-brand-maroon/15 bg-brand-paper p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-brand-maroon/10 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-brand-maroon" />
              <h2 className="font-heading text-lg font-bold text-brand-maroon">Needs Attention</h2>
            </div>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-brand-maroon/10 text-brand-maroon">
              {needsAttentionItems.length} Urgent Items
            </span>
          </div>

          <div className="space-y-2.5">
            {needsAttentionItems.length > 0 ? (
              needsAttentionItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.actionUrl}
                  className="flex items-center justify-between p-3 rounded-2xl border border-brand-maroon/10 bg-brand-cream/40 hover:bg-brand-cream transition-all group"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          item.urgency === 'HIGH' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'
                        }`}
                      />
                      <span className="font-heading font-bold text-xs text-brand-navy group-hover:text-brand-maroon transition-colors">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-brand-slate pl-4">{item.subtitle}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-brand-slate group-hover:text-brand-maroon group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-brand-slate flex flex-col items-center gap-1.5">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
                <span className="font-semibold">All operational queues are clear!</span>
              </div>
            )}
          </div>
        </div>

        {/* Payment Verification Queue */}
        <div className="rounded-3xl border border-brand-maroon/15 bg-brand-paper p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-brand-maroon/10 pb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-amber-700" />
              <h2 className="font-heading text-lg font-bold text-brand-maroon">Payment Verification Queue</h2>
            </div>
            <Link
              href="/admin/payments"
              className="text-xs font-bold text-brand-maroon hover:underline flex items-center gap-1"
            >
              View All ({metrics.pendingVerificationsCount}) →
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentPayments.length > 0 ? (
              recentPayments.map((pmt) => (
                <div
                  key={pmt.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-2xl border border-amber-200/80 bg-amber-50/50 gap-2 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-brand-maroon">{pmt.order.orderNumber}</span>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                        UTR: {pmt.utrReference || 'Missing'}
                      </span>
                    </div>
                    <p className="text-[11px] text-brand-slate">
                      Customer: {pmt.order.user.fullName} ({pmt.order.user.email})
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <span className="font-heading font-bold text-brand-navy">
                      ₹{(pmt.order.totalPaise / 100).toFixed(2)}
                    </span>
                    <Link
                      href="/admin/payments"
                      className="px-3 py-1 rounded-xl bg-amber-700 text-white font-bold text-[11px] hover:bg-amber-800 transition-colors"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-brand-slate flex flex-col items-center gap-1.5">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
                <span>No payments awaiting verification.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ROW 3: Recent Orders Table */}
      <div className="rounded-3xl border border-brand-maroon/15 bg-brand-paper p-6 space-y-4 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between border-b border-brand-maroon/10 pb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-brand-maroon" />
            <h2 className="font-heading text-lg font-bold text-brand-maroon">Recent Customer Orders</h2>
          </div>
          <Link href="/admin/orders" className="text-xs font-bold text-brand-maroon hover:underline">
            View All Orders →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-brand-maroon/10 text-brand-slate uppercase tracking-wider text-[10px] font-extrabold">
                <th className="py-2.5 px-3">Order Number</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Payment</th>
                <th className="py-2.5 px-3">Delivery</th>
                <th className="py-2.5 px-3">Fulfilment</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-maroon/10 font-medium">
              {recentOrders.length > 0 ? (
                recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-brand-cream/50 transition-colors">
                    <td className="py-3 px-3 font-heading font-bold text-brand-maroon">{ord.orderNumber}</td>
                    <td className="py-3 px-3 text-brand-navy">
                      <span className="font-semibold block">{ord.user.fullName}</span>
                      <span className="text-[10px] text-brand-slate block">{ord.user.email}</span>
                    </td>
                    <td className="py-3 px-3 font-heading font-bold text-brand-navy">
                      ₹{(ord.totalPaise / 100).toFixed(2)}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          ord.paymentStatus === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.paymentStatus === 'VERIFICATION_PENDING'
                            ? 'bg-amber-100 text-amber-900'
                            : ord.paymentStatus === 'REJECTED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-[11px] font-semibold text-brand-slate">
                        {ord.deliveryMethod === 'DTDC'
                          ? 'DTDC Courier'
                          : ord.deliveryMethod === 'LOCAL_DELIVERY'
                          ? 'Local Direct'
                          : 'Unassigned'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          ord.fulfilmentStatus === 'DELIVERED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.fulfilmentStatus === 'SHIPPED'
                            ? 'bg-blue-100 text-blue-800'
                            : ord.fulfilmentStatus === 'PROCESSING'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {ord.fulfilmentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-brand-slate text-[11px]">
                      {new Date(ord.placedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/admin/orders/${ord.orderNumber}`}
                        className="text-brand-maroon hover:underline font-bold text-xs inline-flex items-center gap-1"
                      >
                        View <ExternalLink className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-brand-slate text-xs">
                    No recent customer orders found in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ROW 4: Delivery Overview + Low Stock + Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Delivery Overview */}
        <div className="rounded-3xl border border-brand-maroon/15 bg-brand-paper p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-brand-maroon/10 pb-2.5">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-brand-maroon" />
              <h3 className="font-heading text-sm font-bold text-brand-maroon">Delivery Overview</h3>
            </div>
            <Link href="/admin/orders" className="text-[11px] font-bold text-brand-maroon hover:underline">
              Manage →
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            {/* Local Delivery */}
            <div className="p-2.5 rounded-xl bg-brand-cream/60 border border-brand-maroon/10 space-y-1.5">
              <span className="font-heading font-bold text-brand-navy block text-[11px]">
                LOCAL DELIVERY (≤15 km)
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-brand-slate">Processing:</span>{' '}
                  <span className="font-bold text-purple-900">{deliverySummary.local.processing}</span>
                </div>
                <div>
                  <span className="text-brand-slate">Out for Delivery:</span>{' '}
                  <span className="font-bold text-blue-900">{deliverySummary.local.shipped}</span>
                </div>
              </div>
            </div>

            {/* DTDC */}
            <div className="p-2.5 rounded-xl bg-brand-cream/60 border border-brand-maroon/10 space-y-1.5">
              <span className="font-heading font-bold text-brand-navy block text-[11px]">DTDC COURIER</span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-brand-slate">AWB Missing:</span>{' '}
                  <span className="font-bold text-red-900">{deliverySummary.dtdc.trackingMissing}</span>
                </div>
                <div>
                  <span className="text-brand-slate">Shipped:</span>{' '}
                  <span className="font-bold text-indigo-900">{deliverySummary.dtdc.shipped}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Titles */}
        <div className="rounded-3xl border border-brand-maroon/15 bg-brand-paper p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-brand-maroon/10 pb-2.5">
            <div className="flex items-center gap-2">
              <Boxes className="h-4 w-4 text-red-700" />
              <h3 className="font-heading text-sm font-bold text-brand-maroon">Inventory & Stock</h3>
            </div>
            <Link href="/admin/inventory" className="text-[11px] font-bold text-brand-maroon hover:underline">
              Adjust Stock →
            </Link>
          </div>

          <div className="space-y-2 text-xs">
            {lowStockBooks.length > 0 ? (
              lowStockBooks.map((bk) => (
                <div
                  key={bk.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-red-50/70 border border-red-200/80"
                >
                  <div>
                    <span className="font-bold text-red-950 block truncate max-w-[140px]">{bk.title}</span>
                    <span className="text-[10px] text-red-700">SKU: {bk.sku}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-bold text-red-900 block">{bk.stock} Physical</span>
                    <span className="text-[10px] text-red-700">{bk.reservedStock} Reserved</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-brand-slate text-xs flex flex-col items-center gap-1">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span>All books well stocked!</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-3xl border border-brand-maroon/15 bg-brand-paper p-5 space-y-3 shadow-xs">
          <div className="border-b border-brand-maroon/10 pb-2.5">
            <h3 className="font-heading text-sm font-bold text-brand-maroon">Quick Admin Actions</h3>
          </div>

          <div className="space-y-2 text-xs">
            <Link
              href="/admin/payments"
              className="flex items-center gap-3 p-2.5 rounded-xl border border-brand-maroon/10 bg-brand-cream/50 hover:bg-brand-cream transition-colors font-bold text-brand-maroon"
            >
              <CreditCard className="h-4 w-4" />
              <span>Verify UTR Payments</span>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-3 p-2.5 rounded-xl border border-brand-maroon/10 bg-brand-cream/50 hover:bg-brand-cream transition-colors font-bold text-brand-maroon"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Fulfil Orders (DTDC / Local)</span>
            </Link>

            <Link
              href="/admin/inventory"
              className="flex items-center gap-3 p-2.5 rounded-xl border border-brand-maroon/10 bg-brand-cream/50 hover:bg-brand-cream transition-colors font-bold text-brand-maroon"
            >
              <Boxes className="h-4 w-4" />
              <span>Adjust Book Inventory</span>
            </Link>

            <Link
              href="/admin/books/new"
              className="flex items-center gap-3 p-2.5 rounded-xl border border-brand-maroon/10 bg-brand-cream/50 hover:bg-brand-cream transition-colors font-bold text-brand-maroon"
            >
              <BookOpen className="h-4 w-4" />
              <span>Add New Catalogue Title</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
