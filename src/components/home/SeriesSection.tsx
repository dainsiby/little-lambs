import Image from "next/image";
import Link from "next/link";
import { getBookBySlug } from "@/lib/data/books";

export function SeriesSection() {
  const currentBook = getBookBySlug("little-lambs-christian-activity-book");

  return (
    <section className="series-section" aria-label="Little Lambs Series">
      <div className="series-container">
        <span className="section-eyebrow">A GROWING SERIES</span>
        <h2 className="series-title">MORE LITTLE LAMBS BOOKS ARE PLANNED</h2>

        <div className="series-grid">
          {/* Active Released Book */}
          {currentBook && (
            <div className="series-card is-active">
              <span className="series-status-badge active">AVAILABLE NOW</span>
              <h3>{currentBook.title}</h3>
              <p>{currentBook.subtitle}</p>
              <div style={{ marginTop: "14px" }}>
                <Link href={`/books/${currentBook.slug}`} className="primary-cta" style={{ fontSize: "12px", padding: "8px 16px" }}>
                  Explore Book Details →
                </Link>
              </div>
            </div>
          )}

          {/* Abstract Placeholder 1 */}
          <div className="series-card is-future">
            <span className="series-status-badge planned">PLANNED</span>
            <h3>Future Activity Book</h3>
            <p>New interactive Christian stories and activities in planning.</p>
          </div>

          {/* Abstract Placeholder 2 */}
          <div className="series-card is-future">
            <span className="series-status-badge planned">PLANNED</span>
            <h3>Series Addition</h3>
            <p>Expanding the Little Lambs series for young hearts and minds.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

