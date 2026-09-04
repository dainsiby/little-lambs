import React from 'react';
import type { Metadata } from 'next';
import { getAllActiveBooks } from '@/lib/books';
import BookCard from '@/components/books/BookCard';
import Badge from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Books Catalogue',
  description:
    'Browse the official Little Lambs Christian children\'s book catalogue. Discover activity books, Bible stories, prayers, and puzzles.',
};

export const revalidate = 60;

export default async function BooksPage() {
  const books = await getAllActiveBooks();

  return (
    <main className="min-h-screen bg-brand-cream py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <Badge variant="secondary">Official Catalogue</Badge>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-brand-maroon">
            Little Lambs Book Series
          </h1>
          <p className="text-base text-brand-slate">
            Explore our collection of wholesome Christian activity books designed to nurture faith, fun, and learning in young hearts.
          </p>
        </div>

        {/* Book Grid */}
        {books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-brand-paper rounded-2xl border border-brand-maroon/10 p-8 max-w-md mx-auto">
            <p className="text-brand-slate text-sm">No books currently listed in the catalogue.</p>
          </div>
        )}
      </div>
    </main>
  );
}
