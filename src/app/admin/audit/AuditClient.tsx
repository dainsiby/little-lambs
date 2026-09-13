"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface AuditLogItem {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  payload: any;
  createdAt: string | Date;
  actor: { fullName: string | null; email: string } | null;
}

interface AuditClientProps {
  logs: AuditLogItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  initialSearch?: string;
  initialAction?: string;
  initialEntityType?: string;
}

export function AuditClient({
  logs,
  totalCount,
  totalPages,
  currentPage,
  initialSearch = "",
  initialAction = "",
  initialEntityType = "",
}: AuditClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);
  const [action, setAction] = useState(initialAction);
  const [entityType, setEntityType] = useState(initialEntityType);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (action) params.set("action", action);
    if (entityType) params.set("entityType", entityType);
    params.set("page", "1");
    router.push(`/admin/audit?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    setAction("");
    setEntityType("");
    router.push("/admin/audit");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Filter Header */}
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
            placeholder="Search action, actor email, entity ID..."
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
            value={action}
            onChange={(e) => setAction(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "6px",
              border: "1px solid #CBD5E0",
              fontSize: "0.875rem",
            }}
          >
            <option value="">All Audit Actions</option>
            <option value="ORDER_CREATED">ORDER_CREATED</option>
            <option value="UTR_SUBMITTED">UTR_SUBMITTED</option>
            <option value="PAYMENT_VERIFIED">PAYMENT_VERIFIED</option>
            <option value="PAYMENT_REJECTED">PAYMENT_REJECTED</option>
            <option value="RESERVATION_EXPIRED">RESERVATION_EXPIRED</option>
            <option value="STOCK_ADJUSTED">STOCK_ADJUSTED</option>
            <option value="ORDER_PROCESSING">ORDER_PROCESSING</option>
            <option value="ORDER_SHIPPED">ORDER_SHIPPED</option>
            <option value="ORDER_DELIVERED">ORDER_DELIVERED</option>
            <option value="BOOK_CREATE">BOOK_CREATE</option>
            <option value="BOOK_UPDATE">BOOK_UPDATE</option>
            <option value="BOOK_ARCHIVE">BOOK_ARCHIVE</option>
          </select>
        </div>

        <div>
          <select
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "6px",
              border: "1px solid #CBD5E0",
              fontSize: "0.875rem",
            }}
          >
            <option value="">All Entity Types</option>
            <option value="Order">Order</option>
            <option value="Book">Book</option>
            <option value="Payment">Payment</option>
            <option value="User">User</option>
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
          Filter Logs
        </button>

        {(search || action || entityType) && (
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

      {/* Table */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "8px",
          border: "1px solid #E2E8F0",
          padding: "1.25rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ fontSize: "0.85rem", color: "#718096", marginBottom: "1rem" }}>
          Showing <strong>{logs.length}</strong> of <strong>{totalCount}</strong> append-only operational audit entries
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            fontSize: "0.85rem",
          }}
        >
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "2px solid #E2E8F0", color: "#1B2A4A" }}>
              <th style={{ padding: "0.75rem" }}>Timestamp</th>
              <th style={{ padding: "0.75rem" }}>Actor</th>
              <th style={{ padding: "0.75rem" }}>Action</th>
              <th style={{ padding: "0.75rem" }}>Entity</th>
              <th style={{ padding: "0.75rem" }}>Details / Payload</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} style={{ borderBottom: "1px solid #EDF2F7" }}>
                <td style={{ padding: "0.75rem", color: "#718096", whiteSpace: "nowrap" }}>
                  {new Date(log.createdAt).toLocaleString("en-IN", {
                    dateStyle: "short",
                    timeStyle: "medium",
                  })}
                </td>
                <td style={{ padding: "0.75rem" }}>
                  <div style={{ fontWeight: 600, color: "#1B2A4A" }}>
                    {log.actor ? (log.actor.fullName || log.actor.email) : "System Automated"}
                  </div>
                  {log.actor && (
                    <div style={{ fontSize: "0.75rem", color: "#718096" }}>{log.actor.email}</div>
                  )}
                </td>
                <td style={{ padding: "0.75rem" }}>
                  <span
                    style={{
                      background: "#EDF2F7",
                      color: "#1B2A4A",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "4px",
                    }}
                  >
                    {log.action}
                  </span>
                </td>
                <td style={{ padding: "0.75rem" }}>
                  <div style={{ fontWeight: 600, color: "#2D3748" }}>{log.entityType}</div>
                  <div style={{ fontSize: "0.7rem", color: "#A0AEC0", fontFamily: "monospace" }}>
                    {log.entityId}
                  </div>
                </td>
                <td style={{ padding: "0.75rem" }}>
                  <pre
                    style={{
                      margin: 0,
                      fontSize: "0.75rem",
                      background: "#F7FAFC",
                      padding: "0.4rem 0.6rem",
                      borderRadius: "4px",
                      border: "1px solid #E2E8F0",
                      maxHeight: "80px",
                      overflowY: "auto",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-all",
                    }}
                  >
                    {log.payload ? JSON.stringify(log.payload, null, 2) : "—"}
                  </pre>
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: "2.5rem", textAlign: "center", color: "#A0AEC0" }}>
                  No audit log entries matching criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
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
                  router.push(`/admin/audit?${params.toString()}`);
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
