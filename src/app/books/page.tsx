import Metadata from "next";
import { getAllBooks } from "@/lib/data/books";
import { PageHero } from "@/components/layout/PageHero";
import { Footer } from "@/components/layout/Footer";
import { BookCard } from "@/components/books/BookCard";

export const metadata = {
  title: "Book Catalogue | Little Lambs Christian Activity Books",
  description: "Browse the official Little Lambs Christian activity book series for children ages 4–10. Discover prayers, Bible stories, puzzles, and faith-building fun.",
};

export default function BooksPage() {
  const books = getAllBooks();

  return (
    <main id="main-content" className="site-canvas inner-canvas">
      <div className="landing-hero inner-hero-container">
        <PageHero
          title="Our Book Catalogue"
          subtitle="Inspiring faith, prayers, and play for growing hearts & minds."
          badge="Christian Activity Series"
        />

        <section className="catalog-section" aria-label="Book Catalogue">
          <div className="catalog-grid">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}

            {/* Future Architecture Placeholder Card */}
            <article className="book-card coming-soon-card">
              <div className="coming-soon-badge">Series Expansion</div>
              <div className="coming-soon-icon">✨</div>
              <h2 className="book-card-title">More Little Lambs Coming Soon</h2>
              <p className="book-card-desc">
                We are actively creating new Christian story &amp; activity books for young learners. Stay tuned for upcoming releases in the series!
              </p>
              <span className="coming-soon-pill">In Development</span>
            </article>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
