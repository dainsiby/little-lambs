import { getAdminDashboardMetrics } from '@/lib/admin/adminDashboardService';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardMetrics();
  const { metrics, lowStockBooks, recentOrders, recentPayments, recentAuditLogs } = data;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', margin: 0, color: '#1B2A4A' }}>Admin Executive Dashboard</h1>
          <p style={{ margin: '0.25rem 0 0', color: '#718096', fontSize: '0.9rem' }}>
            Real-time operational summary derived from PostgreSQL.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link
            href="/admin/payments"
            style={{
              background: '#8B263E',
              color: '#FFFFFF',
              padding: '0.6rem 1rem',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            Review Payments ({metrics.pendingVerificationsCount})
          </Link>
          <Link
            href="/admin/inventory"
            style={{
              background: '#1B2A4A',
              color: '#FFFFFF',
              padding: '0.6rem 1rem',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            Adjust Inventory
          </Link>
        </div>
      </div>

      {/* Low Stock Warning Banner */}
      {lowStockBooks.length > 0 && (
        <div
          style={{
            background: '#FFF5F5',
            border: '1px solid #FEB2B2',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            color: '#9B2C2C',
          }}
        >
          <strong>⚠️ Low Stock Alert ({lowStockBooks.length} active items):</strong>
          <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem', fontSize: '0.9rem' }}>
            {lowStockBooks.map((b) => (
              <li key={b.id}>
                <strong>{b.title}</strong> (SKU: {b.sku}) — Physical Stock: {b.stock}, Reserved: {b.reservedStock}, Available:{' '}
                <strong>{Math.max(0, b.stock - b.reservedStock)}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #1B2A4A' }}>
          <span style={{ fontSize: '0.8rem', color: '#718096', textTransform: 'uppercase', fontWeight: 700 }}>Active Books</span>
          <h2 style={{ fontSize: '1.8rem', margin: '0.25rem 0 0', color: '#1B2A4A' }}>{metrics.activeBooksCount}</h2>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #3182CE' }}>
          <span style={{ fontSize: '0.8rem', color: '#718096', textTransform: 'uppercase', fontWeight: 700 }}>Physical Stock</span>
          <h2 style={{ fontSize: '1.8rem', margin: '0.25rem 0 0', color: '#2B6CB0' }}>{metrics.physicalStock}</h2>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #DD6B20' }}>
          <span style={{ fontSize: '0.8rem', color: '#718096', textTransform: 'uppercase', fontWeight: 700 }}>Reserved Stock</span>
          <h2 style={{ fontSize: '1.8rem', margin: '0.25rem 0 0', color: '#C05621' }}>{metrics.reservedStock}</h2>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #38A169' }}>
          <span style={{ fontSize: '0.8rem', color: '#718096', textTransform: 'uppercase', fontWeight: 700 }}>Available Stock</span>
          <h2 style={{ fontSize: '1.8rem', margin: '0.25rem 0 0', color: '#2F855A' }}>{metrics.availableStock}</h2>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #D4AF37' }}>
          <span style={{ fontSize: '0.8rem', color: '#718096', textTransform: 'uppercase', fontWeight: 700 }}>Pending Verification</span>
          <h2 style={{ fontSize: '1.8rem', margin: '0.25rem 0 0', color: '#D4AF37' }}>{metrics.pendingVerificationsCount}</h2>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #8B263E' }}>
          <span style={{ fontSize: '0.8rem', color: '#718096', textTransform: 'uppercase', fontWeight: 700 }}>Confirmed Revenue</span>
          <h2 style={{ fontSize: '1.8rem', margin: '0.25rem 0 0', color: '#8B263E' }}>
            ₹{(metrics.totalConfirmedRevenuePaise / 100).toFixed(2)}
          </h2>
        </div>
      </div>

      {/* Main Operational Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Recent Orders */}
        <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1B2A4A' }}>Recent Orders</h3>
            <Link href="/admin/orders" style={{ fontSize: '0.85rem', color: '#8B263E', textDecoration: 'none', fontWeight: 600 }}>
              View All &rarr;
            </Link>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #EDF2F7', textAlign: 'left', color: '#718096' }}>
                <th style={{ padding: '0.5rem' }}>Order #</th>
                <th style={{ padding: '0.5rem' }}>Customer</th>
                <th style={{ padding: '0.5rem' }}>Total</th>
                <th style={{ padding: '0.5rem' }}>Payment</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} style={{ borderBottom: '1px solid #EDF2F7' }}>
                  <td style={{ padding: '0.5rem' }}>
                    <Link href={`/admin/orders/${o.orderNumber}`} style={{ color: '#8B263E', fontWeight: 600, textDecoration: 'none' }}>
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td style={{ padding: '0.5rem' }}>{o.user.fullName}</td>
                  <td style={{ padding: '0.5rem' }}>₹{(o.totalPaise / 100).toFixed(2)}</td>
                  <td style={{ padding: '0.5rem' }}>
                    <span
                      style={{
                        padding: '0.2rem 0.4rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: o.paymentStatus === 'PAID' ? '#C6F6D5' : '#FEFCBF',
                        color: o.paymentStatus === 'PAID' ? '#22543D' : '#744210',
                      }}
                    >
                      {o.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pending Payments Queue */}
        <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1B2A4A' }}>Pending UPI Verification Queue</h3>
            <Link href="/admin/payments" style={{ fontSize: '0.85rem', color: '#8B263E', textDecoration: 'none', fontWeight: 600 }}>
              Queue ({recentPayments.length}) &rarr;
            </Link>
          </div>

          {recentPayments.length === 0 ? (
            <p style={{ color: '#718096', fontSize: '0.9rem' }}>No pending UPI payments to verify.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #EDF2F7', textAlign: 'left', color: '#718096' }}>
                  <th style={{ padding: '0.5rem' }}>Order #</th>
                  <th style={{ padding: '0.5rem' }}>UTR Reference</th>
                  <th style={{ padding: '0.5rem' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #EDF2F7' }}>
                    <td style={{ padding: '0.5rem' }}>
                      <Link href={`/admin/orders/${p.order.orderNumber}`} style={{ color: '#8B263E', fontWeight: 600, textDecoration: 'none' }}>
                        {p.order.orderNumber}
                      </Link>
                    </td>
                    <td style={{ padding: '0.5rem' }}>
                      <code>{p.utrReference || 'N/A'}</code>
                    </td>
                    <td style={{ padding: '0.5rem' }}>₹{(p.expectedAmountPaise / 100).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
