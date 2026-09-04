import React from 'react';
import Link from 'next/link';
import { BookOpen, AlertTriangle, ShieldCheck, PlusCircle } from 'lucide-react';
import { getAllAdminBooks } from '@/lib/admin/books';
import Button from '@/components/ui/Button';

export default async function AdminDashboardPage() {
  const books = await getAllAdminBooks();
  const totalBooks = books.length;
  const activeBooks = books.filter((b) => b.status === 'ACTIVE').length;
  const outOfStockBooks = books.filter((b) => b.stock === 0).length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-brand-maroon">
            Catalogue Dashboard
          </h1>
          <p className="text-xs text-brand-slate">
            Manage Little Lambs published works, inventory status, and pricing.
          </p>
        </div>

        <Button href="/admin/books/new" variant="primary" size="md">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Book
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-brand-maroon/15 bg-brand-paper p-6 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-slate">
              Total Titles
            </span>
            <BookOpen className="h-5 w-5 text-brand-maroon" />
          </div>
          <p className="font-heading text-3xl font-extrabold text-brand-maroon">
            {totalBooks}
          </p>
          <p className="text-[11px] text-brand-slate">Registered in database</p>
        </div>

        <div className="rounded-2xl border border-brand-maroon/15 bg-brand-paper p-6 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-slate">
              Active Storefront
            </span>
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="font-heading text-3xl font-extrabold text-brand-maroon">
            {activeBooks}
          </p>
          <p className="text-[11px] text-brand-slate">Visible to public</p>
        </div>

        <div className="rounded-2xl border border-brand-maroon/15 bg-brand-paper p-6 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-slate">
              Out of Stock (Stock = 0)
            </span>
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <p className="font-heading text-3xl font-extrabold text-brand-maroon">
            {outOfStockBooks}
          </p>
          <p className="text-[11px] text-brand-slate">Restock pending</p>
        </div>
      </div>

      {/* Quick Catalogue Overview */}
      <div className="rounded-3xl border border-brand-maroon/15 bg-brand-paper p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-brand-maroon">
            Catalogue Titles Overview
          </h2>
          <Link href="/admin/books" className="text-xs font-bold text-brand-maroon hover:underline">
            View All →
          </Link>
        </div>

        <div className="divide-y divide-brand-maroon/10 text-sm">
          {books.map((book) => (
            <div key={book.id} className="py-3 flex items-center justify-between">
              <div>
                <Link href={`/admin/books/${book.id}/edit`} className="font-bold text-brand-maroon hover:underline">
                  {book.title}
                </Link>
                <p className="text-xs text-brand-slate font-mono">
                  ISBN: {book.isbn} | SKU: {book.sku}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-heading font-bold text-brand-maroon">
                  ₹{Number(book.price).toFixed(2)}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  book.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-800' : 'bg-gray-100 text-gray-700'
                }`}>
                  {book.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
