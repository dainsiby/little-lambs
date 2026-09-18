import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getBookBySlugFromDb } from '@/lib/books/bookService';
import { PageHero } from '@/components/layout/PageHero';
import { Footer } from '@/components/layout/Footer';
import { ProductActions } from '@/components/books/ProductActions';
import { CoverPreview } from '@/components/books/CoverPreview';
import InnerHeader from '@/components/layout/InnerHeader';

interface BookPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 0; // Dynamic server rendering for live inventory

export async function generateMetadata({ params }: BookPageProps) {
  const resolvedParams = await params;
  const book = await getBookBySlugFromDb(resolvedParams.slug);
  if (!book) return { title: 'Book Not Found | Little Lambs' };

  return {
    title: `${book.title} — ${book.subtitle || 'Christian Activity Book'} | Little Lambs`,
    description: book.shortDescription,
  };
}

export default async function BookDetailPage({ params }: BookPageProps) {
  const resolvedParams = await params;
  const book = await getBookBySlugFromDb(resolvedParams.slug);

  if (!book) {
    notFound();
  }

  const primaryImage = book.images[0]?.url || '/books/cover-front.png';
  const availableStock = book.stock ?? 0;

  return (
    <main id="main-content" className="site-canvas inner-canvas">
      <div className="landing-hero inner-hero-container">
        <PageHero
          title={book.title}
          subtitle={book.subtitle || 'English Christian Activity Book'}
          badge={`Ages ${book.ageMin}–${book.ageMax}`}
        />

        <article className="book-detail-container">
          <div className="book-detail-grid">
            {/* Image Gallery Column */}
            <div className="book-detail-media">
              <div className="book-detail-main-image">
                <Image
                  src={primaryImage}
                  alt={book.title + ' Cover'}
                  width={460}
                  height={600}
                  priority
                  className="detail-cover-img"
                />
              </div>
              <CoverPreview src={primaryImage} title={book.title} />
            </div>

            {/* Info & Purchase Column */}
            <div className="book-detail-content space-y-4">
              <div className="book-detail-header">
                <nav className="text-xs text-slate-500 mb-2 font-medium">
                  <Link href="/books" className="hover:underline">
                    Books
                  </Link>{' '}
                  &rarr; <span className="text-slate-800">{book.title}</span>
                </nav>
                <h2 className="detail-title">{book.title}</h2>
                {book.subtitle && <p className="detail-subtitle">{book.subtitle}</p>}
                <div className="detail-price-box">
                  <span className="detail-price">
                    {book.currency}
                    {book.price}
                  </span>
                  <span
                    className={`detail-availability-badge ${
                      availableStock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {availableStock > 0 ? 'IN STOCK' : 'Currently Out of Stock'} &middot; {book.language}
                  </span>
                </div>
              </div>

              <p className="detail-description">{book.description}</p>

              {/* Activity Types & Highlights */}
              <div className="detail-highlights">
                <h3>What&apos;s Inside This Book:</h3>
                <ul>
                  {book.highlights.map((item, idx) => (
                    <li key={idx}>✨ {item}</li>
                  ))}
                </ul>
              </div>

              {/* Interactive Add to Cart / Buy Now Actions */}
              <ProductActions
                bookId={book.id}
                slug={book.slug}
                priceDisplay={book.price}
                availableStock={availableStock}
              />

              {/* Specs Table */}
              <div className="about-specs-card mt-6">
                <h3>Book Details & Specifications</h3>
                <div className="specs-grid">
                  <div className="spec-row">
                    <span className="spec-label">Publisher:</span>
                    <span className="spec-value">{book.publisher}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Creator / Unit:</span>
                    <span className="spec-value">{book.creator}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Language:</span>
                    <span className="spec-value">{book.language}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Age Group:</span>
                    <span className="spec-value">
                      Ages {book.ageMin} to {book.ageMax}
                    </span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">ISBN:</span>
                    <span className="spec-value font-mono">{book.isbn}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">SKU:</span>
                    <span className="spec-value font-mono">{book.sku}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        <Footer inner />
      </div>
    </main>
  );
}
