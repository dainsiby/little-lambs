import React from 'react';
import { getAdminCustomers, AdminCustomerSummary } from '@/lib/admin/adminCustomerService';

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-extrabold text-brand-maroon">
          Customer Management
        </h1>
        <p className="text-xs text-brand-slate">
          Minimal operational list of registered customer accounts and order totals.
        </p>
      </div>

      <div style={{ background: "#FFFFFF", borderRadius: "8px", border: "1px solid #E2E8F0", padding: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "2px solid #E2E8F0", color: "#1B2A4A" }}>
              <th style={{ padding: "0.75rem" }}>Name</th>
              <th style={{ padding: "0.75rem" }}>Email</th>
              <th style={{ padding: "0.75rem" }}>Phone</th>
              <th style={{ padding: "0.75rem" }}>Account Joined</th>
              <th style={{ padding: "0.75rem", textAlign: "right" }}>Total Orders</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c: AdminCustomerSummary) => (
              <tr key={c.id} style={{ borderBottom: "1px solid #EDF2F7" }}>
                <td style={{ padding: "0.75rem", fontWeight: 600, color: "#1B2A4A" }}>
                  {c.fullName || "Customer"}
                </td>
                <td style={{ padding: "0.75rem", color: "#2D3748" }}>{c.email}</td>
                <td style={{ padding: "0.75rem", color: "#718096" }}>{c.phone || "—"}</td>
                <td style={{ padding: "0.75rem", color: "#718096", fontSize: "0.8rem" }}>
                  {new Date(c.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                </td>
                <td style={{ padding: "0.75rem", textAlign: "right", fontWeight: 700, color: "#8B263E" }}>
                  {c.orderCount}
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "#A0AEC0" }}>
                  No customer accounts registered yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
