"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function BookEditForm({ book }: { book: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: book.title || "",
    subtitle: book.subtitle || "",
    slug: book.slug || "",
    sku: book.sku || "",
    isbn: book.isbn || "",
    shortDescription: book.shortDescription || "",
    description: book.description || "",
    priceRupees: (book.pricePaise / 100) || 100,
    ageMin: book.ageMin || 4,
    ageMax: book.ageMax || 10,
    language: book.language || "English",
    publisher: book.publisher || "",
    edition: book.edition || "",
    status: book.status || "DRAFT",
    featured: book.featured || false,
    releaseDate: book.releaseDate ? new Date(book.releaseDate).toISOString().split('T')[0] : "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const payload = {
        ...form,
        pricePaise: Math.round(Number(form.priceRupees) * 100),
        ageMin: Number(form.ageMin),
        ageMax: Number(form.ageMax),
      };

      const res = await fetch(`/api/admin/books/${book.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update book.");
      }

      setMessage("Book details updated successfully!");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to update book.");
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async () => {
    if (!confirm(`Are you sure you want to archive "${book.title}"? Hard deletion is disabled to preserve historical order references.`)) {
      return;
    }

    setArchiving(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/books/${book.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to archive book.");
      }

      router.push("/admin/books");
    } catch (err: any) {
      setError(err.message || "Failed to archive book.");
      setArchiving(false);
    }
  };

  return (
    <div style={{ background: "#FFFFFF", padding: "1.75rem", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <h1 style={{ fontSize: "1.5rem", color: "#1B2A4A", margin: 0 }}>Edit Book: {book.title}</h1>
        <button
          type="button"
          onClick={handleArchive}
          disabled={archiving || book.status === "ARCHIVED"}
          style={{
            background: "#E53E3E",
            color: "#FFFFFF",
            padding: "0.4rem 0.85rem",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "0.85rem",
            opacity: archiving || book.status === "ARCHIVED" ? 0.5 : 1,
          }}
        >
          {archiving ? "Archiving..." : book.status === "ARCHIVED" ? "Archived" : "Archive Book"}
        </button>
      </div>

      {message && (
        <div style={{ background: "#F0FFF4", color: "#22543D", padding: "0.75rem", borderRadius: "6px", marginBottom: "1rem" }}>
          {message}
        </div>
      )}

      {error && (
        <div style={{ background: "#FFF5F5", color: "#C53030", padding: "0.75rem", borderRadius: "6px", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1B2A4A" }}>Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #CBD5E0" }}
            />
          </div>
          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1B2A4A" }}>Subtitle</label>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #CBD5E0" }}
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1B2A4A" }}>Slug *</label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #CBD5E0" }}
            />
          </div>
          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1B2A4A" }}>SKU *</label>
            <input
              type="text"
              required
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #CBD5E0" }}
            />
          </div>
          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1B2A4A" }}>ISBN *</label>
            <input
              type="text"
              required
              value={form.isbn}
              onChange={(e) => setForm({ ...form, isbn: e.target.value })}
              style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #CBD5E0" }}
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1B2A4A" }}>Price (₹ Rupees) *</label>
            <input
              type="number"
              required
              min={1}
              value={form.priceRupees}
              onChange={(e) => setForm({ ...form, priceRupees: Number(e.target.value) })}
              style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #CBD5E0" }}
            />
          </div>
          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1B2A4A" }}>Min Age *</label>
            <input
              type="number"
              required
              min={0}
              value={form.ageMin}
              onChange={(e) => setForm({ ...form, ageMin: Number(e.target.value) })}
              style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #CBD5E0" }}
            />
          </div>
          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1B2A4A" }}>Max Age *</label>
            <input
              type="number"
              required
              min={0}
              value={form.ageMax}
              onChange={(e) => setForm({ ...form, ageMax: Number(e.target.value) })}
              style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #CBD5E0" }}
            />
          </div>
          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1B2A4A" }}>Status *</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #CBD5E0" }}
            >
              <option value="DRAFT">DRAFT</option>
              <option value="COMING_SOON">COMING_SOON</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1B2A4A" }}>Language *</label>
            <input
              type="text"
              required
              value={form.language}
              onChange={(e) => setForm({ ...form, language: e.target.value })}
              style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #CBD5E0" }}
            />
          </div>
          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1B2A4A" }}>Publisher *</label>
            <input
              type="text"
              required
              value={form.publisher}
              onChange={(e) => setForm({ ...form, publisher: e.target.value })}
              style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #CBD5E0" }}
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1B2A4A" }}>Short Description</label>
          <input
            type="text"
            value={form.shortDescription}
            onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
            style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #CBD5E0" }}
          />
        </div>

        <div>
          <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1B2A4A" }}>Full Description *</label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #CBD5E0" }}
          />
        </div>

        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#8B263E",
              color: "#FFFFFF",
              padding: "0.6rem 1.5rem",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {loading ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
