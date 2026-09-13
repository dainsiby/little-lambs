"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface OrderListItem {
  id: string;
  orderNumber: string;
  placedAt: string | Date;
  totalPaise: number;
  paymentStatus: string;
  fulfilmentStatus: string;
  user: { fullName: string | null; email: string };
  items: Array<{ id: string; titleSnapshot: string; quantity: number }>;
  payments: Array<{ utrReference: string | null; status: string }>;
}

interface OrdersClientProps {
  orders: OrderListItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  initialSearch?: string;
  initialPaymentStatus?: string;
  initialFulfilmentStatus?: string;
}

export function OrdersClient({
  orders,
  totalCount,
  totalPages,
  currentPage,
  initialSearch = "",
  initialPaymentStatus = "",
  initialFulfilmentStatus = "",
}: OrdersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus);
  const [fulfilmentStatus, setFulfilmentStatus] = useState(initialFulfilmentStatus);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (paymentStatus) params.set("paymentStatus", paymentStatus);
    if (fulfilmentStatus) params.set("fulfilmentStatus", fulfilmentStatus);
    params.set("page", "1");
    router.push(`/admin/orders?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    setPaymentStatus("");
    setFulfilmentStatus("");
    router.push("/admin/orders");
  };

  const formatRupees = (paise: number) => {
    return `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Filter Bar */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "8px",
          border: "1px solid #E2E8F0",
          padding: "1rem 1.25rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <div style={{ flex: "1 1 200px" }}>
          <input
            type="text"
            placeholder="Search by Order #, Email, Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "6px",
              border: "1px solid #CBD5E0",
              fontSize: "0.875rem",
            }}
          />
        </div>

        <div>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "6px",
              border: "1px solid #CBD5E0",
              fontSize: "0.875rem",
            }}
          >
            <option value="">All Payment Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="VERIFICATION_PENDING">VERIFICATION_PENDING</option>
            <option value="PAID">PAID</option>
            <option value="REJECTED">REJECTED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>
        </div>

        <div>
          <select
            value={fulfilmentStatus}
            onChange={(e) => setFulfilmentStatus(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "6px",
              border: "1px solid #CBD5E0",
              fontSize: "0.875rem",
            }}
          >
            <option value="">All Fulfilment Statuses</option>
            <option value="AWAITING_PAYMENT">AWAITING_PAYMENT</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>

        <button
          onClick={applyFilters}
          style={{
            background: "#8B263E",
            color: "#FFFFFF",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            border: "none",
            fontWeight: 600,
            fontSize: "0.875rem",
            cursor: "pointer",
          }}
        >
          Filter
        </button>

        {(search || paymentStatus || fulfilmentStatus) && (
          <button
            onClick={clearFilters}
            style={{
              background: "#EDF2F7",
              color: "#4A5568",
              padding: "0.5rem 0.85rem",
              borderRadius: "6px",
              border: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        )}
      </div>

      {/* Orders Table */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "8px",
          border: "1px solid #E2E8F0",
          padding: "1.25rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <div style={{ fontSize: "0.9rem", color: "#4A5568" }}>
            Showing <strong>{orders.length}</strong> of <strong>{totalCount}</strong> orders
          </div>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            fontSize: "0.875rem",
          }}
        >
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "2px solid #E2E8F0", color: "#1B2A4A" }}>
              <th style={{ padding: "0.75rem" }}>Order #</th>
              <th style={{ padding: "0.75rem" }}>Customer</th>
              <th style={{ padding: "0.75rem" }}>Date</th>
              <th style={{ padding: "0.75rem" }}>Items</th>
              <th style={{ padding: "0.75rem", textAlign: "right" }}>Total</th>
              <th style={{ padding: "0.75rem" }}>Payment Status</th>
              <th style={{ padding: "0.75rem" }}>Fulfilment Status</th>
              <th style={{ padding: "0.75rem", textAlign: "right" }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const utr = o.payments[0]?.utrReference;
              return (
                <tr key={o.id} style={{ borderBottom: "1px solid #EDF2F7" }}>
                  <td style={{ padding: "0.75rem", fontWeight: 700, color: "#1B2A4A" }}>
                    <Link
                      href={`/admin/orders/${o.orderNumber}`}
                      style={{ color: "#1B2A4A", textDecoration: "underline" }}
                    >
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td style={{ padding: "0.75rem" }}>
                    <div style={{ fontWeight: 600, color: "#2D3748" }}>
                      {o.user.fullName || "Customer"}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#718096" }}>{o.user.email}</div>
                  </td>
                  <td style={{ padding: "0.75rem", color: "#718096", fontSize: "0.8rem" }}>
                    {new Date(o.placedAt).toLocaleString("en-IN", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  <td style={{ padding: "0.75rem" }}>
                    <div style={{ fontWeight: 600, color: "#4A5568" }}>
                      {o.items.reduce((sum, item) => sum + item.quantity, 0)} unit(s)
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "0.75rem",
                      textAlign: "right",
                      fontWeight: 700,
                      color: "#1B2A4A",
                    }}
                  >
                    {formatRupees(o.totalPaise)}
                  </td>
                  <td style={{ padding: "0.75rem" }}>
                    <span
                      style={{
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        background:
                          o.paymentStatus === "PAID"
                            ? "#C6F6D5"
                            : o.paymentStatus === "VERIFICATION_PENDING"
                            ? "#FEFCBF"
                            : o.paymentStatus === "REJECTED"
                            ? "#FED7D7"
                            : "#EDF2F7",
                        color:
                          o.paymentStatus === "PAID"
                            ? "#22543D"
                            : o.paymentStatus === "VERIFICATION_PENDING"
                            ? "#744210"
                            : o.paymentStatus === "REJECTED"
                            ? "#9B2C2C"
                            : "#4A5568",
                      }}
                    >
                      {o.paymentStatus}
                    </span>
                    {utr && (
                      <div style={{ fontSize: "0.7rem", color: "#718096", marginTop: "0.1rem" }}>
                        UTR: {utr}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "0.75rem" }}>
                    <span
                      style={{
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        background:
                          o.fulfilmentStatus === "DELIVERED"
                            ? "#BEE3F8"
                            : o.fulfilmentStatus === "SHIPPED"
                            ? "#EBF8FF"
                            : o.fulfilmentStatus === "PROCESSING"
                            ? "#E2E8F0"
                            : "#EDF2F7",
                        color:
                          o.fulfilmentStatus === "DELIVERED"
                            ? "#2B6CB0"
                            : o.fulfilmentStatus === "SHIPPED"
                            ? "#2C5282"
                            : o.fulfilmentStatus === "PROCESSING"
                            ? "#2D3748"
                            : "#4A5568",
                      }}
                    >
                      {o.fulfilmentStatus}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem", textAlign: "right" }}>
                    <Link
                      href={`/admin/orders/${o.orderNumber}`}
                      style={{
                        background: "#1B2A4A",
                        color: "#FFFFFF",
                        padding: "0.35rem 0.75rem",
                        borderRadius: "6px",
                        textDecoration: "none",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                      }}
                    >
                      View Order
                    </Link>
                  </td>
                </tr>
              );
            })}
            {orders.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: "2rem", textAlign: "center", color: "#A0AEC0" }}>
                  No orders found matching the selected criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "0.5rem",
              marginTop: "1.5rem",
              alignItems: "center",
            }}
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("page", p.toString());
                  router.push(`/admin/orders?${params.toString()}`);
                }}
                style={{
                  padding: "0.4rem 0.75rem",
                  borderRadius: "4px",
                  border: "1px solid #CBD5E0",
                  background: p === currentPage ? "#8B263E" : "#FFFFFF",
                  color: p === currentPage ? "#FFFFFF" : "#1B2A4A",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
