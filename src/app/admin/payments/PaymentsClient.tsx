"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PendingPaymentOrder {
  id: string;
  orderNumber: string;
  placedAt: string | Date;
  totalPaise: number;
  paymentStatus: string;
  fulfilmentStatus: string;
  user: { fullName: string | null; email: string };
  payments: Array<{
    id: string;
    utrReference: string | null;
    status: string;
    submittedAt: string | Date | null;
  }>;
}

interface PaymentsClientProps {
  orders: PendingPaymentOrder[];
  totalCount: number;
}

export function PaymentsClient({ orders, totalCount }: PaymentsClientProps) {
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<PendingPaymentOrder | null>(null);
  const [rejectModalOrder, setRejectModalOrder] = useState<PendingPaymentOrder | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const formatRupees = (paise: number) => {
    return `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  };

  const handleVerify = async (order: PendingPaymentOrder) => {
    if (
      !confirm(
        `Confirm verification of ${formatRupees(order.totalPaise)} for Order ${order.orderNumber} (UTR: ${order.payments[0]?.utrReference || "N/A"})?`
      )
    ) {
      return;
    }

    setLoadingId(order.id);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/admin/orders/${order.orderNumber}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "VERIFY" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Payment verification failed.");
      }

      setSuccess(`Payment for Order ${order.orderNumber} successfully VERIFIED.`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to verify payment.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalOrder || !rejectionReason.trim()) return;

    setLoadingId(rejectModalOrder.id);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/admin/orders/${rejectModalOrder.orderNumber}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REJECT",
          rejectionReason: rejectionReason.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Payment rejection failed.");
      }

      setSuccess(`Payment for Order ${rejectModalOrder.orderNumber} marked as REJECTED.`);
      setRejectModalOrder(null);
      setRejectionReason("");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to reject payment.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Notifications */}
      {success && (
        <div style={{ background: "#F0FFF4", color: "#22543D", border: "1px solid #C6F6D5", padding: "0.85rem 1rem", borderRadius: "6px" }}>
          {success}
        </div>
      )}
      {error && (
        <div style={{ background: "#FFF5F5", color: "#C53030", border: "1px solid #FEB2B2", padding: "0.85rem 1rem", borderRadius: "6px" }}>
          {error}
        </div>
      )}

      {/* Main Table */}
      <div style={{ background: "#FFFFFF", borderRadius: "8px", border: "1px solid #E2E8F0", padding: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1B2A4A", margin: 0 }}>
              Payment Verification Queue ({totalCount})
            </h2>
            <p style={{ fontSize: "0.8rem", color: "#718096", margin: 0 }}>
              Orders with submitted UPI transaction references waiting for manual verification against bank statement.
            </p>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "2px solid #E2E8F0", color: "#1B2A4A" }}>
              <th style={{ padding: "0.75rem" }}>Order #</th>
              <th style={{ padding: "0.75rem" }}>Customer</th>
              <th style={{ padding: "0.75rem" }}>Amount Expected</th>
              <th style={{ padding: "0.75rem" }}>Submitted UTR Reference</th>
              <th style={{ padding: "0.75rem" }}>Submitted At</th>
              <th style={{ padding: "0.75rem", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const payment = o.payments[0];
              const isProcessing = loadingId === o.id;

              return (
                <tr key={o.id} style={{ borderBottom: "1px solid #EDF2F7" }}>
                  <td style={{ padding: "0.75rem", fontWeight: 700, color: "#1B2A4A" }}>
                    <Link href={`/admin/orders/${o.orderNumber}`} style={{ color: "#1B2A4A", textDecoration: "underline" }}>
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td style={{ padding: "0.75rem" }}>
                    <div style={{ fontWeight: 600, color: "#2D3748" }}>{o.user.fullName || "Customer"}</div>
                    <div style={{ fontSize: "0.75rem", color: "#718096" }}>{o.user.email}</div>
                  </td>
                  <td style={{ padding: "0.75rem", fontWeight: 800, color: "#1B2A4A" }}>
                    {formatRupees(o.totalPaise)}
                  </td>
                  <td style={{ padding: "0.75rem" }}>
                    <span style={{ fontFamily: "monospace", fontSize: "1rem", fontWeight: 700, background: "#FEFCBF", color: "#744210", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                      {payment?.utrReference || "Missing UTR"}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem", color: "#718096", fontSize: "0.8rem" }}>
                    {payment?.submittedAt ? new Date(payment.submittedAt).toLocaleString("en-IN") : "N/A"}
                  </td>
                  <td style={{ padding: "0.75rem", textAlign: "right" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                      <button
                        onClick={() => handleVerify(o)}
                        disabled={isProcessing}
                        style={{
                          background: "#2F855A",
                          color: "#FFFFFF",
                          padding: "0.35rem 0.75rem",
                          borderRadius: "6px",
                          border: "none",
                          fontWeight: 700,
                          fontSize: "0.8rem",
                          cursor: "pointer",
                        }}
                      >
                        {isProcessing ? "..." : "Verify Payment"}
                      </button>
                      <button
                        onClick={() => setRejectModalOrder(o)}
                        disabled={isProcessing}
                        style={{
                          background: "#C53030",
                          color: "#FFFFFF",
                          padding: "0.35rem 0.75rem",
                          borderRadius: "6px",
                          border: "none",
                          fontWeight: 700,
                          fontSize: "0.8rem",
                          cursor: "pointer",
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: "2.5rem", textAlign: "center", color: "#A0AEC0" }}>
                  🎉 No pending payment verification submissions in queue.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Reject Modal */}
      {rejectModalOrder && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "1rem" }}>
          <div style={{ background: "#FFFFFF", width: "100%", maxWidth: "450px", borderRadius: "8px", padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#C53030", margin: "0 0 0.5rem 0" }}>
              Reject Payment for Order #{rejectModalOrder.orderNumber}
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#4A5568", margin: "0 0 1rem 0" }}>
              Provide the rejection reason for reference.
            </p>
            <form onSubmit={handleRejectSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1B2A4A" }}>Rejection Reason *</label>
                <textarea
                  required
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. UTR reference invalid or not found in bank statement."
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #CBD5E0" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setRejectModalOrder(null)}
                  style={{ background: "#EDF2F7", color: "#4A5568", padding: "0.5rem 1rem", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: "#C53030", color: "#FFFFFF", padding: "0.5rem 1rem", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: 600 }}
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
