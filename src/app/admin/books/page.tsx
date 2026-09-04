import React from 'react';
import Link from 'next/link';
import { PlusCircle, Edit3 } from 'lucide-react';
import { getAllAdminBooks } from '@/lib/admin/books';
import Button from '@/components/ui/Button';

export default async function AdminBooksListPage() {
  const books = await getAllAdminBooks();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-brand-maroon">
            Catalogue Management
          </h1>
          <p className="text-xs text-brand-slate">
            View, edit, archive, and manage all books in the database.
          </p>
        </div>

        <Button href="/admin/books/new" variant="primary" size="md">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Book
        </Button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-brand-maroon/15 bg-brand-paper shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-cream/60 border-b border-brand-maroon/10 text-xs uppercase text-brand-slate">
            <tr>
              <th className="p-4">Title / Identifiers</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-maroon/10">
            {books.map((book) => (
              <tr key={book.id} className="hover:bg-brand-cream/20">
                <td className="p-4">
                  <p className="font-bold text-brand-maroon">{book.title}</p>
                  <p className="text-xs text-brand-slate font-mono">
                    ISBN: {book.isbn} | SKU: {book.sku}
                  </p>
                </td>
                <td className="p-4 font-mono font-bold text-brand-maroon">
                  ₹{Number(book.price).toFixed(2)}
                </td>
                <td className="p-4 font-mono">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    book.stock > 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                  }`}>
                    {book.stock} units
                  </span>
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-cream text-brand-maroon border border-brand-maroon/20">
                    {book.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Link
                    href={`/admin/books/${book.id}/edit`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-brand-maroon/20 px-3 py-1.5 text-xs font-semibold text-brand-maroon hover:bg-brand-maroon hover:text-brand-paper transition-colors"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
