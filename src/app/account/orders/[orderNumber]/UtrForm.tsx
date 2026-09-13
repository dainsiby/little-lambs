"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function UtrForm({ orderNumber }: { orderNumber: string }) {
  const router = useRouter();
  const [utrReference, setUtrReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/orders/${orderNumber}/utr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ utrReference }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit UTR reference.");
      }

      setSuccess(true);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to submit UTR reference.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ background: "#F0FFF4", border: "1px solid #9AE6B4", padding: "1rem", borderRadius: "8px", color: "#22543D" }}>
        <strong>✓ Payment Reference Submitted!</strong>
        <p style={{ margin: "0.25rem 0 0", fontSize: "0.9rem" }}>
          Your UTR reference has been received. Our team will verify your payment shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
      {error && (
        <div className="auth-error-banner" role="alert">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="utr-input" style={{ fontSize: "0.9rem", fontWeight: 600, color: "#1B2A4A", display: "block", marginBottom: "0.25rem" }}>
          Enter UPI Transaction ID / UTR Reference *
        </label>
        <input
          id="utr-input"
          type="text"
          required
          placeholder="e.g. 426819502841"
          value={utrReference}
          onChange={(e) => setUtrReference(e.target.value)}
          style={{ width: "100%", padding: "0.6rem", borderRadius: "6px", border: "1px solid #CBD5E0" }}
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        className="primary-cta"
        disabled={loading || !utrReference.trim()}
        style={{
          padding: "0.6rem 1.25rem",
          borderRadius: "6px",
          fontWeight: 600,
          opacity: loading || !utrReference.trim() ? 0.6 : 1,
          alignSelf: "flex-start",
        }}
      >
        {loading ? "Submitting..." : "Submit Payment Reference"}
      </button>
    </form>
  );
}
