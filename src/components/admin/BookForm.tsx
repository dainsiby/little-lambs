'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

interface BookFormData {
  id?: string;
  title: string;
  subtitle: string;
  slug: string;
  sku: string;
  isbn: string;
  description: string;
  shortDescription: string;
  ageMin: number;
  ageMax: number;
  language: string;
  publisher: string;
  price: number | string;
  stock: number;
  status: string;
  featured: boolean;
}

interface BookFormProps {
  initialData?: Partial<BookFormData>;
  isEditing?: boolean;
}

export default function BookForm({ initialData = {}, isEditing = false }: BookFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<BookFormData>({
    title: initialData.title || '',
    subtitle: initialData.subtitle || '',
    slug: initialData.slug || '',
    sku: initialData.sku || '',
    isbn: initialData.isbn || '',
    description: initialData.description || '',
    shortDescription: initialData.shortDescription || '',
    ageMin: initialData.ageMin ?? 4,
    ageMax: initialData.ageMax ?? 10,
    language: initialData.language || 'English',
    publisher: initialData.publisher || 'Pavanatma Publishers Pvt. Ltd. / Atma Books',
    price: initialData.price ?? 100.00,
    stock: initialData.stock ?? 0,
    status: initialData.status || 'DRAFT',
    featured: initialData.featured ?? false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = isEditing && initialData.id ? `/api/admin/books/${initialData.id}` : '/api/admin/books';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save book');
      } else {
        router.push('/admin/books');
        router.refresh();
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-brand-paper p-8 rounded-3xl border border-brand-maroon/15 shadow-xs">
      {error && (
        <div className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold text-brand-slate uppercase">Book Title *</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="focus-ring mt-1 block w-full rounded-xl border border-brand-maroon/20 bg-brand-paper px-3.5 py-2.5 text-sm text-brand-maroon"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-slate uppercase">Subtitle</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            className="focus-ring mt-1 block w-full rounded-xl border border-brand-maroon/20 bg-brand-paper px-3.5 py-2.5 text-sm text-brand-maroon"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-slate uppercase">URL Slug *</label>
          <input
            type="text"
            name="slug"
            required
            value={formData.slug}
            onChange={handleChange}
            className="focus-ring mt-1 block w-full rounded-xl border border-brand-maroon/20 bg-brand-paper px-3.5 py-2.5 text-sm text-brand-maroon"
            placeholder="little-lambs-activity-book"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-slate uppercase">SKU Code *</label>
          <input
            type="text"
            name="sku"
            required
            value={formData.sku}
            onChange={handleChange}
            className="focus-ring mt-1 block w-full rounded-xl border border-brand-maroon/20 bg-brand-paper px-3.5 py-2.5 text-sm text-brand-maroon"
            placeholder="LL-BK-001"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-slate uppercase">ISBN-13 *</label>
          <input
            type="text"
            name="isbn"
            required
            value={formData.isbn}
            onChange={handleChange}
            className="focus-ring mt-1 block w-full rounded-xl border border-brand-maroon/20 bg-brand-paper px-3.5 py-2.5 text-sm text-brand-maroon"
            placeholder="978-93-88909-19-8"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-slate uppercase">Publisher *</label>
          <input
            type="text"
            name="publisher"
            required
            value={formData.publisher}
            onChange={handleChange}
            className="focus-ring mt-1 block w-full rounded-xl border border-brand-maroon/20 bg-brand-paper px-3.5 py-2.5 text-sm text-brand-maroon"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-slate uppercase">Retail Price (₹) *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="price"
            required
            value={formData.price}
            onChange={handleChange}
            className="focus-ring mt-1 block w-full rounded-xl border border-brand-maroon/20 bg-brand-paper px-3.5 py-2.5 text-sm text-brand-maroon font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-slate uppercase">Physical Inventory Stock *</label>
          <input
            type="number"
            min="0"
            name="stock"
            required
            value={formData.stock}
            onChange={handleChange}
            className="focus-ring mt-1 block w-full rounded-xl border border-brand-maroon/20 bg-brand-paper px-3.5 py-2.5 text-sm text-brand-maroon font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-slate uppercase">Min Age *</label>
          <input
            type="number"
            min="0"
            max="18"
            name="ageMin"
            required
            value={formData.ageMin}
            onChange={handleChange}
            className="focus-ring mt-1 block w-full rounded-xl border border-brand-maroon/20 bg-brand-paper px-3.5 py-2.5 text-sm text-brand-maroon"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-slate uppercase">Max Age *</label>
          <input
            type="number"
            min="0"
            max="18"
            name="ageMax"
            required
            value={formData.ageMax}
            onChange={handleChange}
            className="focus-ring mt-1 block w-full rounded-xl border border-brand-maroon/20 bg-brand-paper px-3.5 py-2.5 text-sm text-brand-maroon"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-slate uppercase">Catalogue Status *</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="focus-ring mt-1 block w-full rounded-xl border border-brand-maroon/20 bg-brand-paper px-3.5 py-2.5 text-sm text-brand-maroon"
          >
            <option value="DRAFT">Draft</option>
            <option value="COMING_SOON">Coming Soon</option>
            <option value="ACTIVE">Active (Storefront Visible)</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
            <option value="ARCHIVED">Archived (Hidden from Storefront)</option>
          </select>
        </div>

        <div className="flex items-center gap-2 pt-6">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="h-4 w-4 rounded border-brand-maroon/20 text-brand-maroon"
          />
          <label htmlFor="featured" className="text-xs font-semibold text-brand-maroon">
            Feature this book on Homepage Spotlight
          </label>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-brand-slate uppercase">Full Description *</label>
        <textarea
          name="description"
          rows={4}
          required
          value={formData.description}
          onChange={handleChange}
          className="focus-ring mt-1 block w-full rounded-xl border border-brand-maroon/20 bg-brand-paper px-3.5 py-2.5 text-sm text-brand-maroon"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-brand-maroon/10">
        <Button type="button" variant="outline" size="md" onClick={() => router.push('/admin/books')}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="md" disabled={loading}>
          {loading ? 'Saving...' : isEditing ? 'Update Book' : 'Create Book'}
        </Button>
      </div>
    </form>
  );
}
