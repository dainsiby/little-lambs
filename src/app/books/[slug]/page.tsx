import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, BookOpen, Heart, Sparkles } from 'lucide-react';
import { getBookBySlug } from '@/lib/books';
import BookGallery from '@/components/books/BookGallery';
import StockBadge from '@/components/books/StockBadge';
import Badge from '@/components/ui/Badge';

interface BookDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: BookDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBookBySlug(slug);

  if (!book) {
    return {
      title: 'Book Not Found',
    };
  }

  return {
    title: book.title,
    description: book.shortDescription || book.description,
    openGraph: {
      title: book.title,
      description: book.shortDescription || book.description,
      type: 'article',
    },
  };
}

export const revalidate = 60;

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);

  if (!book) {
    notFound();
  }

  const formattedPrice =
    typeof book.price === 'number'
      ? `₹${book.price.toFixed(2)}`
      : `₹${book.price}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    isbn: book.isbn,
    sku: book.sku,
    description: book.description,
    inLanguage: book.language,
    publisher: {
      '@type': 'Organization',
      name: book.publisher,
    },
    offers: {
      '@type': 'Offer',
      price: book.price,
      priceCurrency: 'INR',
      availability:
        book.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <main className="min-h-screen bg-brand-cream py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav
          className="flex items-center gap-2 text-xs font-semibold text-brand-slate mb-8"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-brand-maroon focus-ring rounded">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-brand-slate/60" />
          <Link href="/books" className="hover:text-brand-maroon focus-ring rounded">
            Books
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-brand-slate/60" />
          <span className="text-brand-maroon font-bold truncate max-w-xs sm:max-w-md">
            {book.title}
          </span>
        </nav>

        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          {/* Left Column: Product Gallery */}
          <div className="md:col-span-5">
            <BookGallery
              coverImage={
                book.coverImage ||
                '/books/little-lambs-activity-book/cover-front.jpg'
              }
              title={book.title}
            />
          </div>

          {/* Right Column: Book Details & Availability */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="accent">Ages {book.ageMin}–{book.ageMax}</Badge>
                <StockBadge stock={book.stock} />
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-maroon">
                {book.title}
              </h1>
              {book.subtitle && (
                <p className="mt-1.5 text-base font-semibold text-brand-maroon/80">
                  {book.subtitle}
                </p>
              )}
            </div>

            {/* Price Display */}
            <div className="rounded-2xl border border-brand-maroon/15 bg-brand-paper p-5 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-brand-slate uppercase font-semibold">
                  Retail Price
                </span>
                <p className="font-heading text-3xl font-extrabold text-brand-maroon">
                  {formattedPrice}
                </p>
              </div>
              <div className="text-right text-xs text-brand-slate">
                <span>Direct Publisher Release</span>
              </div>
            </div>

            {/* Non-Interactive Stock Notice (Stock = 0) */}
            <div className="rounded-2xl border border-red-200 bg-red-50/90 p-5 space-y-2">
              <div className="flex items-center gap-2 text-red-800 font-bold text-sm">
                <span>⚠️ Currently Out of Stock</span>
              </div>
              <p className="text-xs text-red-700 leading-relaxed">
                Physical inventory is currently set to 0 pending initial stock allocation. Online ordering and purchase controls are unavailable at this time.
              </p>
            </div>

            {/* Factual Specification Card */}
            <div className="rounded-2xl border border-brand-maroon/10 bg-brand-paper p-6 space-y-3">
              <h2 className="font-heading text-lg font-bold text-brand-maroon">
                Key Details
              </h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div>
                  <dt className="font-semibold text-brand-slate">ISBN</dt>
                  <dd className="font-mono text-brand-maroon font-bold">{book.isbn}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-brand-slate">SKU</dt>
                  <dd className="font-mono text-brand-maroon font-bold">{book.sku}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-brand-slate">Target Age</dt>
                  <dd className="text-brand-maroon font-bold">{book.ageMin} to {book.ageMax} Years</dd>
                </div>
                <div>
                  <dt className="font-semibold text-brand-slate">Language</dt>
                  <dd className="text-brand-maroon font-bold">{book.language}</dd>
                </div>
                <div className="sm:col-span-2 pt-2 border-t border-brand-maroon/10">
                  <dt className="font-semibold text-brand-slate">Publisher</dt>
                  <dd className="text-brand-maroon font-bold">{book.publisher}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Detailed Story & Content Section */}
        <div className="mt-16 border-t border-brand-maroon/10 pt-12 space-y-12">
          {/* Overview */}
          <div className="max-w-4xl space-y-4">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-brand-maroon">
              About the Activity Book
            </h2>
            <p className="text-sm sm:text-base text-brand-slate leading-relaxed">
              {book.description}
            </p>
          </div>

          {/* Activity Breakdown Pillars */}
          <div className="space-y-6">
            <h2 className="font-heading text-2xl font-bold text-brand-maroon">
              What Children Will Discover Inside
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="rounded-2xl border border-brand-maroon/10 bg-brand-paper p-5">
                <Sparkles className="h-6 w-6 text-brand-gold mb-2" />
                <h3 className="font-heading font-bold text-brand-maroon">Bible Stories</h3>
                <p className="mt-1 text-xs text-brand-slate">
                  Nurturing stories that teach foundational Christian faith and values.
                </p>
              </div>

              <div className="rounded-2xl border border-brand-maroon/10 bg-brand-paper p-5">
                <BookOpen className="h-6 w-6 text-brand-maroon mb-2" />
                <h3 className="font-heading font-bold text-brand-maroon">Guided Prayers</h3>
                <p className="mt-1 text-xs text-brand-slate">
                  Short, meaningful prayers tailored for children aged 4 to 10.
                </p>
              </div>

              <div className="rounded-2xl border border-brand-maroon/10 bg-brand-paper p-5">
                <Sparkles className="h-6 w-6 text-brand-gold mb-2" />
                <h3 className="font-heading font-bold text-brand-maroon">Colouring Pages</h3>
                <p className="mt-1 text-xs text-brand-slate">
                  Fun illustrations for colouring and creative expression.
                </p>
              </div>

              <div className="rounded-2xl border border-brand-maroon/10 bg-brand-paper p-5">
                <Heart className="h-6 w-6 text-brand-maroon mb-2" />
                <h3 className="font-heading font-bold text-brand-maroon">Puzzles &amp; Games</h3>
                <p className="mt-1 text-xs text-brand-slate">
                  Crosswords, word searches, and fun activities for learning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
