"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface BookInventoryItem {
  id: string;
  title: string;
  sku: string;
  isbn: string;
  pricePaise: number;
  stock: number;
  reservedStock: number;
  availableStock: number;
  status: string;
}

interface StockMovementItem {
  id: string;
  type: string;
  quantityDelta: number;
  previousStock: number;
  newStock: number;
  reason: string;
  createdAt: string | Date;
  book: { title: string; sku: string };
  actor: { fullName: string | null; email: string } | null;
}

interface InventoryClientProps {
  books: BookInventoryItem[];
  movements: StockMovementItem[];
}

export function InventoryClient({ books, movements }: InventoryClientProps) {
  const router = useRouter();
  const [selectedBook, setSelectedBook] = useState<BookInventoryItem | null>(null);
  const [quantityDelta, setQuantityDelta] = useState<number>(0);
  const [movementType, setMovementType] = useState<string>("RESTOCK");
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook) return;

    if (quantityDelta === 0) {
      setError("Quantity delta cannot be zero.");
      return;
    }

    if (!reason.trim()) {
      setError("Please provide a reason for this stock adjustment.");
      return;
    }

    const calculatedNewStock = selectedBook.stock + quantityDelta;
    if (calculatedNewStock < selectedBook.reservedStock) {
      setError(
        `Cannot reduce stock to ${calculatedNewStock}. Reserved stock is ${selectedBook.reservedStock}. Available stock cannot be negative.`
      );
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: selectedBook.id,
          quantityDelta,
          type: movementType,
          reason: reason.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to adjust inventory.");
      }

      setSuccess(`Physical stock for "${selectedBook.title}" successfully updated from ${selectedBook.stock} to ${data.book.stock}.`);
      setSelectedBook(null);
      setQuantityDelta(0);
      setReason("");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to adjust stock.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Top Banner & Notifications */}
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

      {/* Inventory Table Card */}
      <div style={{ background: "#FFFFFF", borderRadius: "8px", border: "1px solid #E2E8F0", padding: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1B2A4A", margin: 0 }}>
              Physical & Reserved Inventory
            </h2>
            <p style={{ fontSize: "0.8rem", color: "#718096", margin: 0 }}>
              Physical Stock minus Reserved Stock equals Available Stock. Reserved stock is system-managed by customer orders.
            </p>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "2px solid #E2E8F0", color: "#1B2A4A" }}>
              <th style={{ padding: "0.75rem" }}>Title / SKU</th>
              <th style={{ padding: "0.75rem" }}>Status</th>
              <th style={{ padding: "0.75rem", textAlign: "right" }}>Physical Stock</th>
              <th style={{ padding: "0.75rem", textAlign: "right" }}>Reserved Stock</th>
              <th style={{ padding: "0.75rem", textAlign: "right" }}>Available Stock</th>
              <th style={{ padding: "0.75rem", textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => {
              const isLowStock = b.availableStock <= 5;
              return (
                <tr key={b.id} style={{ borderBottom: "1px solid #EDF2F7" }}>
                  <td style={{ padding: "0.75rem" }}>
                    <div style={{ fontWeight: 600, color: "#1B2A4A" }}>{b.title}</div>
                    <div style={{ fontSize: "0.75rem", color: "#A0AEC0" }}>SKU: {b.sku}</div>
                  </td>
                  <td style={{ padding: "0.75rem" }}>
                    <span
                      style={{
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        background: b.status === "ACTIVE" ? "#E6FFFA" : "#EDF2F7",
                        color: b.status === "ACTIVE" ? "#234E52" : "#4A5568",
                      }}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem", textAlign: "right", fontWeight: 600, color: "#2D3748" }}>
                    {b.stock}
                  </td>
                  <td style={{ padding: "0.75rem", textAlign: "right", color: "#DD6B20", fontWeight: 600 }}>
                    {b.reservedStock}
                  </td>
                  <td style={{ padding: "0.75rem", textAlign: "right", fontWeight: 700, color: isLowStock ? "#E53E3E" : "#2B6CB0" }}>
                    {b.availableStock} {isLowStock && <span style={{ fontSize: "0.7rem", color: "#E53E3E" }}>(Low)</span>}
                  </td>
                  <td style={{ padding: "0.75rem", textAlign: "right" }}>
                    <button
                      onClick={() => {
                        setSelectedBook(b);
                        setQuantityDelta(0);
                        setReason("");
                        setError(null);
                      }}
                      style={{
                        background: "#1B2A4A",
                        color: "#FFFFFF",
                        padding: "0.35rem 0.75rem",
                        borderRadius: "6px",
                        border: "none",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        cursor: "pointer",
                      }}
                    >
                      Adjust Physical Stock
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Stock Movement Modal / Adjustment Form */}
      {selectedBook && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "1rem" }}>
          <div style={{ background: "#FFFFFF", width: "100%", maxWidth: "500px", borderRadius: "8px", padding: "1.5rem", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1B2A4A", margin: "0 0 0.5rem 0" }}>
              Adjust Physical Stock: {selectedBook.title}
            </h3>
            <div style={{ fontSize: "0.85rem", color: "#4A5568", marginBottom: "1rem" }}>
              Current Physical Stock: <strong>{selectedBook.stock}</strong> | Reserved: <strong>{selectedBook.reservedStock}</strong> | Available: <strong>{selectedBook.availableStock}</strong>
            </div>

            <form onSubmit={handleAdjustSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1B2A4A" }}>Movement Type *</label>
                <select
                  value={movementType}
                  onChange={(e) => setMovementType(e.target.value)}
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #CBD5E0" }}
                >
                  <option value="RESTOCK">RESTOCK (Add stock)</option>
                  <option value="CORRECTION">CORRECTION (Inventory audit fix)</option>
                  <option value="RETURN">RETURN (Customer return restock)</option>
                  <option value="INITIAL">INITIAL (Initial stock intake)</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1B2A4A" }}>
                  Quantity Delta (+ to increase, - to decrease) *
                </label>
                <input
                  type="number"
                  required
                  value={quantityDelta}
                  onChange={(e) => setQuantityDelta(parseInt(e.target.value) || 0)}
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #CBD5E0" }}
                />
                <div style={{ fontSize: "0.75rem", color: "#718096", marginTop: "0.25rem" }}>
                  New physical stock will be: <strong>{selectedBook.stock + quantityDelta}</strong> (Must be ≥ {selectedBook.reservedStock})
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1B2A4A" }}>Reason / Note *</label>
                <textarea
                  required
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Received shipment batch #2026-09 or corrected miscount during audit"
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #CBD5E0" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setSelectedBook(null)}
                  style={{ background: "#EDF2F7", color: "#4A5568", padding: "0.5rem 1rem", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{ background: "#8B263E", color: "#FFFFFF", padding: "0.5rem 1rem", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: 600 }}
                >
                  {loading ? "Saving..." : "Confirm Stock Adjustment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Movement Log Card */}
      <div style={{ background: "#FFFFFF", borderRadius: "8px", border: "1px solid #E2E8F0", padding: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1B2A4A", margin: "0 0 1rem 0" }}>
          Recent Stock Movement History (Audit Trail)
        </h3>

        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "2px solid #E2E8F0", color: "#1B2A4A" }}>
              <th style={{ padding: "0.6rem" }}>Timestamp</th>
              <th style={{ padding: "0.6rem" }}>Book</th>
              <th style={{ padding: "0.6rem" }}>Type</th>
              <th style={{ padding: "0.6rem", textAlign: "right" }}>Delta</th>
              <th style={{ padding: "0.6rem", textAlign: "right" }}>Stock Change</th>
              <th style={{ padding: "0.6rem" }}>Reason</th>
              <th style={{ padding: "0.6rem" }}>Actor</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((m) => (
              <tr key={m.id} style={{ borderBottom: "1px solid #EDF2F7" }}>
                <td style={{ padding: "0.6rem", color: "#718096" }}>
                  {new Date(m.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                </td>
                <td style={{ padding: "0.6rem", fontWeight: 600, color: "#1B2A4A" }}>
                  {m.book.title}
                </td>
                <td style={{ padding: "0.6rem" }}>
                  <span style={{ fontSize: "0.75rem", background: "#EDF2F7", padding: "0.15rem 0.4rem", borderRadius: "4px" }}>
                    {m.type}
                  </span>
                </td>
                <td style={{ padding: "0.6rem", textAlign: "right", fontWeight: 700, color: m.quantityDelta > 0 ? "#2F855A" : "#C53030" }}>
                  {m.quantityDelta > 0 ? `+${m.quantityDelta}` : m.quantityDelta}
                </td>
                <td style={{ padding: "0.6rem", textAlign: "right", color: "#4A5568" }}>
                  {m.previousStock} → <strong>{m.newStock}</strong>
                </td>
                <td style={{ padding: "0.6rem", color: "#4A5568" }}>
                  {m.reason}
                </td>
                <td style={{ padding: "0.6rem", color: "#718096" }}>
                  {m.actor ? (m.actor.fullName || m.actor.email) : "System"}
                </td>
              </tr>
            ))}
            {movements.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: "1.5rem", textAlign: "center", color: "#A0AEC0" }}>
                  No stock movements recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
