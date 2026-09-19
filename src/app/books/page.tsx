import React from 'react';
import { getActiveBooksFromDb } from '@/lib/books/bookService';
import { PageHero } from '@/components/layout/PageHero';
import { Footer } from '@/components/layout/Footer';
import { BookCard } from '@/components/books/BookCard';

export const metadata = {
  title: 'Book Catalogue | Little Lambs Christian Activity Books',
  description:
    'Browse the official Little Lambs Christian activity book series for children ages 4–10. Discover prayers, Bible stories, puzzles, and faith-building fun.',
};

export const revalidate = 0; // Dynamic server rendering for live inventory

export default async function BooksPage() {
  const books = await getActiveBooksFromDb();

  return (
    <main id="main-content" className="site-canvas inner-canvas">
      <div className="landing-hero inner-hero-container">
        <PageHero
          badge="THE LITTLE LAMBS BOOKSHOP"
          title="Explore Books"
          subtitle="Faith-filled stories for growing hearts and minds."
          rightImage="/illustrations/reading-lamb-mascot.png"
        />

        <section className="catalog-section" aria-label="Book Catalogue">
          <div className="catalog-main-wrapper space-y-8">
            {/* Real Database Featured Book Card */}
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}

            {/* Restrained Secondary Coming Soon Banner */}
            <section className="coming-soon-secondary-banner" aria-label="Future Releases">
              <div className="coming-soon-content">
                <span className="coming-soon-badge-small">Series Expansion</span>
                <h3 className="coming-soon-title">More Little Lambs books are coming.</h3>
                <p className="coming-soon-text">
                  The Little Lambs series is just beginning. Stay tuned for more faith-filled stories and activities!
                </p>
              </div>
            </section>
          </div>
        </section>

        <Footer inner />
      </div>
    </main>
  );
}
