import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/Icons";
import { getBookBySlug } from "@/lib/data/books";

export function FeaturedBookSection() {
  const book = getBookBySlug("little-lambs-christian-activity-book");

  if (!book) return null;

  return (
    <section className="featured-book-section" aria-label="Featured Book">
      <div className="featured-book-container">
        <div className="featured-book-badge">Flagship Release</div>
        
        <div className="featured-book-grid">
          {/* Cover Art Box */}
          <div className="featured-cover-box">
            <div className="featured-cover-frame">
              <Image
                src="/books/cover-front.png"
                alt="Little Lambs English Christian Activity Book Official Cover"
                width={360}
                height={480}
                className="featured-cover-img"
              />
            </div>
            <span className="featured-price-pill">{book.currency}{book.price}</span>
          </div>

          {/* Editorial Content */}
          <div className="featured-book-info">
            <div className="featured-meta-row">
              <span className="featured-age-pill">Ages {book.ageMin}–{book.ageMax}</span>
              <span className="featured-lang-pill">{book.language}</span>
            </div>

            <h2 className="featured-book-title">{book.title}</h2>
            <p className="featured-book-subtitle">{book.subtitle}</p>

            <p className="featured-book-desc">{book.description}</p>

            <div className="featured-highlights-list">
              {book.highlights.slice(0, 4).map((highlight, idx) => (
                <div key={idx} className="featured-highlight-item">
                  <span className="highlight-bullet">✦</span>
                  <span>{highlight}</span>
                </div>
              ))}
            </div>

            <div className="featured-action-row">
              <Link href={`/books/${book.slug}`} className="primary-cta featured-btn">
                Explore Book Details <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
