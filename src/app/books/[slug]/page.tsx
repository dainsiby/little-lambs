import { CoverPreview } from "@/components/books/CoverPreview";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getBookBySlug, getAllBooks } from "@/lib/data/books";
import { PageHero } from "@/components/layout/PageHero";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight } from "@/components/ui/Icons";

interface BookPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const books = getAllBooks();
  return books.map((book) => ({
    slug: book.slug,
  }));
}

export async function generateMetadata({ params }: BookPageProps) {
  const resolvedParams = await params;
  const book = getBookBySlug(resolvedParams.slug);
  if (!book) return { title: "Book Not Found | Little Lambs" };

  return {
    title: `${book.title} — ${book.subtitle || 'Christian Activity Book'} | Little Lambs`,
    description: book.shortDescription,
  };
}

export default async function BookDetailPage({ params }: BookPageProps) {
  const resolvedParams = await params;
  const book = getBookBySlug(resolvedParams.slug);

  if (!book) {
    notFound();
  }

  const primaryImage = book.images[0]?.url || "/images/book-cover.webp";

  return (
    <main id="main-content" className="site-canvas inner-canvas">
      <div className="landing-hero inner-hero-container">
        <PageHero
          title={book.title}
          subtitle={book.subtitle}
          badge={`Ages ${book.ageMin}–${book.ageMax}`}
        />

        <article className="book-detail-container">
          <div className="book-detail-grid">
            {/* Image Gallery Column */}
            <div className="book-detail-media">
              <div className="book-detail-main-image">
                <Image
                  src={primaryImage}
                  alt={book.title + " Cover"}
                  width={460}
                  height={600}
                  priority
                  className="detail-cover-img"
                />
              </div>
              <CoverPreview src={primaryImage} title={book.title} />
            </div>

            {/* Info & Purchase Column */}
            <div className="book-detail-content">
              <div className="book-detail-header">
                <h2 className="detail-title">Made for little moments of discovery.</h2>
                {book.subtitle && <p className="detail-subtitle">{book.subtitle}</p>}
                <div className="detail-price-box">
                  <span className="detail-price">{book.currency}{book.price}</span>
                  <span className="detail-availability-badge">First edition · {book.language}</span>
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

              {/* Book Metadata Sheet */}
              <div className="detail-specs-table">
                <div className="spec-row">
                  <span className="spec-label">ISBN:</span>
                  <span className="spec-value">{book.isbn}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Age Group:</span>
                  <span className="spec-value">Ages {book.ageMin}–{book.ageMax}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Language:</span>
                  <span className="spec-value">{book.language}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Creator:</span>
                  <span className="spec-value">{book.creator}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Publisher:</span>
                  <span className="spec-value">{book.publisher}</span>
                </div>
              </div>

              <div className="detail-actions">
                <Link href="/contact" className="primary-cta">Enquire about this book <ArrowRight /></Link>
                <Link href="/books" className="secondary-cta">Back to books</Link>
              </div>
              <p className="purchase-notice">Online ordering is not available yet. Contact us about individual copies or books for your parish.</p>
            </div>
          </div>
        </article>

        <Footer inner />
      </div>
    </main>
  );
}
