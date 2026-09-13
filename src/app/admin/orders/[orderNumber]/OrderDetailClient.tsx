"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface OrderDetailClientProps {
  data: {
    order: {
      id: string;
      orderNumber: string;
      placedAt: string | Date;
      subtotalPaise: number;
      shippingPaise: number;
      totalPaise: number;
      paymentStatus: string;
      fulfilmentStatus: string;
      shippingCarrier: string | null;
      trackingNumber: string | null;
      shippedAt: string | Date | null;
      deliveredAt: string | Date | null;
      reservationExpiresAt: string | Date | null;
      user: { id: string; fullName: string | null; email: string; phone: string | null };
      items: Array<{
        id: string;
        titleSnapshot: string;
        skuSnapshot: string;
        unitPricePaise: number;
        quantity: number;
        lineTotalPaise: number;
      }>;
      addressSnapshot: {
        fullName: string;
        addressLine1: string;
        addressLine2: string | null;
        city: string;
        state: string;
        postalCode: string;
        phone: string;
      } | null;
      payments: Array<{
        id: string;
        utrReference: string | null;
        status: string;
        submittedAt: string | Date | null;
        verifiedAt: string | Date | null;
        rejectionReason: string | null;
        adminNote: string | null;
      }>;
    };
    auditLogs: Array<{
      id: string;
      action: string;
      createdAt: string | Date;
      payload: any;
      actor: { fullName: string | null; email: string } | null;
    }>;
  };
}

export function OrderDetailClient({ data }: OrderDetailClientProps) {
  const { order, auditLogs } = data;
  const router = useRouter();

  const [verifying, setVerifying] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  const [updatingFulfilment, setUpdatingFulfilment] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [shippingCarrier, setShippingCarrier] = useState("India Post");
  const [trackingNumber, setTrackingNumber] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const formatRupees = (paise: number) => {
    return `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  };

  const latestPayment = order.payments[0];

  const handleVerifyPayment = async () => {
    if (
      !confirm(
        `Are you sure you want to VERIFY payment for Order ${order.orderNumber}? This will deduct physical stock and mark the order as CONFIRMED.`
      )
    ) {
      return;
    }

    setVerifying(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/admin/orders/${order.orderNumber}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "VERIFY" }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Payment verification failed.");
      }

      setSuccess("Payment successfully verified! Order state updated to CONFIRMED.");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to verify payment.");
    } finally {
      setVerifying(false);
    }
  };

  const handleRejectPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      setError("Please provide a rejection reason.");
      return;
    }

    setRejecting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/admin/orders/${order.orderNumber}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REJECT",
          rejectionReason: rejectionReason.trim(),
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Payment rejection failed.");
      }

      setSuccess("Payment marked as REJECTED.");
      setShowRejectModal(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to reject payment.");
    } finally {
      setRejecting(false);
    }
  };

  const handleFulfilmentTransition = async (targetStatus: string, payload: any = {}) => {
    setUpdatingFulfilment(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/admin/orders/${order.orderNumber}/fulfilment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: targetStatus,
          ...payload,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Fulfilment transition failed.");
      }

      setSuccess(`Fulfilment status updated to ${targetStatus}.`);
      setShowShippingModal(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to update fulfilment status.");
    } finally {
      setUpdatingFulfilment(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Back Link */}
      <div>
        <Link href="/admin/orders" style={{ color: "#8B263E", textDecoration: "underline", fontSize: "0.875rem", fontWeight: 600 }}>
          ← Back to Orders
        </Link>
      </div>

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

      {/* Top Header Card */}
      <div style={{ background: "#FFFFFF", borderRadius: "8px", border: "1px solid #E2E8F0", padding: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1B2A4A", margin: 0 }}>
                Order #{order.orderNumber}
              </h1>
              <span style={{ padding: "0.25rem 0.6rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, background: order.paymentStatus === "PAID" ? "#C6F6D5" : "#FEFCBF", color: order.paymentStatus === "PAID" ? "#22543D" : "#744210" }}>
                {order.paymentStatus}
              </span>
              <span style={{ padding: "0.25rem 0.6rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, background: "#E2E8F0", color: "#2D3748" }}>
                {order.fulfilmentStatus}
              </span>
            </div>
            <div style={{ fontSize: "0.8rem", color: "#718096", marginTop: "0.25rem" }}>
              Placed on {new Date(order.placedAt).toLocaleString("en-IN", { dateStyle: "full", timeStyle: "short" })}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {/* Payment Verification Buttons */}
            {order.paymentStatus === "VERIFICATION_PENDING" && (
              <>
                <button
                  onClick={handleVerifyPayment}
                  disabled={verifying}
                  style={{ background: "#2F855A", color: "#FFFFFF", padding: "0.5rem 1rem", borderRadius: "6px", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "0.875rem" }}
                >
                  {verifying ? "Verifying..." : "✓ Verify Payment"}
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  disabled={verifying}
                  style={{ background: "#C53030", color: "#FFFFFF", padding: "0.5rem 1rem", borderRadius: "6px", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "0.875rem" }}
                >
                  ✕ Reject Payment
                </button>
              </>
            )}

            {/* Fulfilment State Transitions */}
            {order.fulfilmentStatus === "CONFIRMED" && (
              <button
                onClick={() => handleFulfilmentTransition("PROCESSING")}
                disabled={updatingFulfilment}
                style={{ background: "#1B2A4A", color: "#FFFFFF", padding: "0.5rem 1rem", borderRadius: "6px", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "0.875rem" }}
              >
                {updatingFulfilment ? "Updating..." : "Mark as PROCESSING"}
              </button>
            )}

            {(order.fulfilmentStatus === "CONFIRMED" || order.fulfilmentStatus === "PROCESSING") && (
              <button
                onClick={() => setShowShippingModal(true)}
                disabled={updatingFulfilment}
                style={{ background: "#8B263E", color: "#FFFFFF", padding: "0.5rem 1rem", borderRadius: "6px", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "0.875rem" }}
              >
                📦 Add Shipping / Mark SHIPPED
              </button>
            )}

            {order.fulfilmentStatus === "SHIPPED" && (
              <button
                onClick={() => handleFulfilmentTransition("DELIVERED")}
                disabled={updatingFulfilment}
                style={{ background: "#2B6CB0", color: "#FFFFFF", padding: "0.5rem 1rem", borderRadius: "6px", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "0.875rem" }}
              >
                {updatingFulfilment ? "Updating..." : "Mark as DELIVERED"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
        {/* Left Column: Items & Payment info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Items Card */}
          <div style={{ background: "#FFFFFF", borderRadius: "8px", border: "1px solid #E2E8F0", padding: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1B2A4A", margin: "0 0 1rem 0" }}>
              Ordered Items
            </h3>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "2px solid #E2E8F0", color: "#1B2A4A" }}>
                  <th style={{ padding: "0.6rem" }}>Item</th>
                  <th style={{ padding: "0.6rem", textAlign: "right" }}>Unit Price</th>
                  <th style={{ padding: "0.6rem", textAlign: "right" }}>Qty</th>
                  <th style={{ padding: "0.6rem", textAlign: "right" }}>Line Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #EDF2F7" }}>
                    <td style={{ padding: "0.6rem" }}>
                      <div style={{ fontWeight: 600, color: "#1B2A4A" }}>{item.titleSnapshot}</div>
                      <div style={{ fontSize: "0.75rem", color: "#A0AEC0" }}>SKU: {item.skuSnapshot}</div>
                    </td>
                    <td style={{ padding: "0.6rem", textAlign: "right", color: "#4A5568" }}>
                      {formatRupees(item.unitPricePaise)}
                    </td>
                    <td style={{ padding: "0.6rem", textAlign: "right", fontWeight: 600, color: "#1B2A4A" }}>
                      {item.quantity}
                    </td>
                    <td style={{ padding: "0.6rem", textAlign: "right", fontWeight: 700, color: "#1B2A4A" }}>
                      {formatRupees(item.lineTotalPaise)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals Summary */}
            <div style={{ marginTop: "1rem", borderTop: "2px solid #EDF2F7", paddingTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.4rem", alignItems: "flex-end", fontSize: "0.875rem" }}>
              <div style={{ color: "#4A5568" }}>Subtotal: <strong>{formatRupees(order.subtotalPaise)}</strong></div>
              <div style={{ color: "#4A5568" }}>Shipping Fee: <strong>{order.shippingPaise === 0 ? "FREE" : formatRupees(order.shippingPaise)}</strong></div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1B2A4A", marginTop: "0.25rem" }}>
                Total Paid / Expected: {formatRupees(order.totalPaise)}
              </div>
            </div>
          </div>

          {/* Payment Details Card */}
          <div style={{ background: "#FFFFFF", borderRadius: "8px", border: "1px solid #E2E8F0", padding: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1B2A4A", margin: "0 0 1rem 0" }}>
              Manual UPI Payment Details
            </h3>
            {latestPayment ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.875rem" }}>
                <div>
                  <span style={{ color: "#718096" }}>Submitted UTR / Reference:</span>
                  <div style={{ fontWeight: 800, color: "#1B2A4A", fontSize: "1.1rem", background: "#EDF2F7", padding: "0.3rem 0.6rem", borderRadius: "4px", marginTop: "0.25rem" }}>
                    {latestPayment.utrReference || "None provided"}
                  </div>
                </div>
                <div>
                  <span style={{ color: "#718096" }}>Submission Timestamp:</span>
                  <div style={{ fontWeight: 600, color: "#2D3748", marginTop: "0.25rem" }}>
                    {latestPayment.submittedAt ? new Date(latestPayment.submittedAt).toLocaleString("en-IN") : "N/A"}
                  </div>
                </div>
                {latestPayment.verifiedAt && (
                  <div>
                    <span style={{ color: "#718096" }}>Verified At:</span>
                    <div style={{ fontWeight: 600, color: "#2F855A", marginTop: "0.25rem" }}>
                      {new Date(latestPayment.verifiedAt).toLocaleString("en-IN")}
                    </div>
                  </div>
                )}
                {latestPayment.rejectionReason && (
                  <div style={{ gridColumn: "1 / -1" }}>
                    <span style={{ color: "#C53030", fontWeight: 600 }}>Rejection Reason:</span>
                    <div style={{ background: "#FFF5F5", color: "#C53030", padding: "0.5rem", borderRadius: "4px", marginTop: "0.25rem" }}>
                      {latestPayment.rejectionReason}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ color: "#718096", fontSize: "0.875rem" }}>
                No payment submission recorded for this order yet.
              </div>
            )}
          </div>

          {/* Audit Timeline Card */}
          <div style={{ background: "#FFFFFF", borderRadius: "8px", border: "1px solid #E2E8F0", padding: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1B2A4A", margin: "0 0 1rem 0" }}>
              Order Audit Timeline
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {auditLogs.map((log) => (
                <div key={log.id} style={{ display: "flex", gap: "1rem", borderBottom: "1px solid #EDF2F7", paddingBottom: "0.5rem", fontSize: "0.8rem" }}>
                  <div style={{ color: "#A0AEC0", whiteSpace: "nowrap" }}>
                    {new Date(log.createdAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 700, color: "#1B2A4A", background: "#EDF2F7", padding: "0.1rem 0.35rem", borderRadius: "4px" }}>
                      {log.action}
                    </span>
                    <span style={{ color: "#4A5568", marginLeft: "0.5rem" }}>
                      by {log.actor ? (log.actor.fullName || log.actor.email) : "System"}
                    </span>
                  </div>
                </div>
              ))}
              {auditLogs.length === 0 && (
                <div style={{ color: "#A0AEC0", fontSize: "0.85rem" }}>No audit log events found for this order.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Delivery Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Customer Card */}
          <div style={{ background: "#FFFFFF", borderRadius: "8px", border: "1px solid #E2E8F0", padding: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1B2A4A", margin: "0 0 0.75rem 0" }}>
              Customer Details
            </h3>
            <div style={{ fontSize: "0.875rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <div><strong style={{ color: "#1B2A4A" }}>Name:</strong> {order.user.fullName || "N/A"}</div>
              <div><strong style={{ color: "#1B2A4A" }}>Email:</strong> {order.user.email}</div>
              <div><strong style={{ color: "#1B2A4A" }}>Phone:</strong> {order.user.phone || order.addressSnapshot?.phone || "—"}</div>
            </div>
          </div>

          {/* Delivery Address Card */}
          <div style={{ background: "#FFFFFF", borderRadius: "8px", border: "1px solid #E2E8F0", padding: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1B2A4A", margin: "0 0 0.75rem 0" }}>
              Delivery Address Snapshot
            </h3>
            {order.addressSnapshot ? (
              <div style={{ fontSize: "0.85rem", color: "#2D3748", lineHeight: "1.4" }}>
                <div style={{ fontWeight: 700, color: "#1B2A4A" }}>{order.addressSnapshot.fullName}</div>
                <div>{order.addressSnapshot.addressLine1}</div>
                {order.addressSnapshot.addressLine2 && <div>{order.addressSnapshot.addressLine2}</div>}
                <div>{order.addressSnapshot.city}, {order.addressSnapshot.state} - {order.addressSnapshot.postalCode}</div>
                <div style={{ marginTop: "0.25rem", color: "#718096" }}>Phone: {order.addressSnapshot.phone}</div>
              </div>
            ) : (
              <div style={{ fontSize: "0.85rem", color: "#718096" }}>No address snapshot recorded.</div>
            )}
          </div>


          {/* Tracking / Shipping Info Card */}
          <div style={{ background: "#FFFFFF", borderRadius: "8px", border: "1px solid #E2E8F0", padding: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1B2A4A", margin: "0 0 0.75rem 0" }}>
              Shipment & Tracking Info
            </h3>
            {order.trackingNumber ? (
              <div style={{ fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <div><strong style={{ color: "#1B2A4A" }}>Carrier:</strong> {order.shippingCarrier}</div>
                <div><strong style={{ color: "#1B2A4A" }}>Tracking #:</strong> <span style={{ fontFamily: "monospace", background: "#EDF2F7", padding: "0.15rem 0.4rem", borderRadius: "4px" }}>{order.trackingNumber}</span></div>
                {order.shippedAt && (
                  <div style={{ fontSize: "0.8rem", color: "#718096" }}>
                    Shipped: {new Date(order.shippedAt).toLocaleString("en-IN")}
                  </div>
                )}
                {order.deliveredAt && (
                  <div style={{ fontSize: "0.8rem", color: "#2F855A", fontWeight: 600 }}>
                    Delivered: {new Date(order.deliveredAt).toLocaleString("en-IN")}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ fontSize: "0.85rem", color: "#718096" }}>
                No tracking information recorded yet. Use &quot;Add Shipping / Mark SHIPPED&quot; when dispatching.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject Payment Modal */}
      {showRejectModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "1rem" }}>
          <div style={{ background: "#FFFFFF", width: "100%", maxWidth: "450px", borderRadius: "8px", padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#C53030", margin: "0 0 0.5rem 0" }}>
              Reject Payment Submission
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#4A5568", margin: "0 0 1rem 0" }}>
              Please specify the rejection reason (e.g. UTR reference not found in bank statement, amount mismatch).
            </p>
            <form onSubmit={handleRejectPaymentSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1B2A4A" }}>Rejection Reason *</label>
                <textarea
                  required
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Reference UTR 123456789012 was not detected in bank statements."
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #CBD5E0" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  style={{ background: "#EDF2F7", color: "#4A5568", padding: "0.5rem 1rem", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={rejecting}
                  style={{ background: "#C53030", color: "#FFFFFF", padding: "0.5rem 1rem", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: 600 }}
                >
                  {rejecting ? "Rejecting..." : "Confirm Rejection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shipping / Tracking Modal */}
      {showShippingModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "1rem" }}>
          <div style={{ background: "#FFFFFF", width: "100%", maxWidth: "450px", borderRadius: "8px", padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1B2A4A", margin: "0 0 0.5rem 0" }}>
              Enter Shipping & Tracking Information
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleFulfilmentTransition("SHIPPED", { shippingCarrier, trackingNumber });
              }}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1B2A4A" }}>Shipping Carrier *</label>
                <input
                  type="text"
                  required
                  value={shippingCarrier}
                  onChange={(e) => setShippingCarrier(e.target.value)}
                  placeholder="e.g. India Post, Blue Dart, DTDC"
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #CBD5E0" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1B2A4A" }}>Tracking Number / AWB *</label>
                <input
                  type="text"
                  required
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. IP123456789IN"
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #CBD5E0" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowShippingModal(false)}
                  style={{ background: "#EDF2F7", color: "#4A5568", padding: "0.5rem 1rem", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingFulfilment}
                  style={{ background: "#8B263E", color: "#FFFFFF", padding: "0.5rem 1rem", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: 600 }}
                >
                  {updatingFulfilment ? "Saving..." : "Mark as SHIPPED"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
