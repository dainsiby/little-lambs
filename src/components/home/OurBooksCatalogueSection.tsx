import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/Icons";

export function OurBooksCatalogueSection() {
  return (
    <section id="books" className="our-books-section" aria-labelledby="our-books-title">
      <div className="our-books-container">
        {/* LEFT EDITORIAL COL */}
        <div className="our-books-left-col">
          <span className="section-eyebrow">OUR BOOKS</span>
          <h2 id="our-books-title" className="our-books-headline">
            Ready to explore <br />
            our catalogue?
          </h2>
          <p className="our-books-desc">
            Discover our first book and more titles coming soon — stories, prayers and activities for growing hearts.
          </p>
          <div className="our-books-cta-wrap">
            <Link href="/books" className="explore-books-cta">
              View All Books <ArrowRight />
            </Link>
          </div>
        </div>

        {/* RIGHT CARDS GRID */}
        <div className="our-books-cards-grid">
          {/* Real Released Book 01 Card */}
          <Link href="/books/little-lambs-christian-activity-book" className="catalogue-card card-released">
            <div className="catalogue-img-box">
              <Image
                src="/books/cover-front.png"
                alt="Little Lambs English Christian Activity Book Official Cover"
                width={200}
                height={260}
                className="catalogue-cover-img"
              />
            </div>
            <p className="catalogue-book-label">Little Lambs – Book 01</p>
          </Link>

          {/* Abstract Placeholder 1 */}
          <div className="catalogue-card card-sage-placeholder">
            <div className="placeholder-book-icon" aria-hidden="true">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                <line x1="8" y1="7" x2="16" y2="7" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </div>
            <p className="placeholder-card-title">More Books <br />Coming Soon</p>
          </div>

          {/* Abstract Placeholder 2 */}
          <div className="catalogue-card card-powder-placeholder">
            <div className="placeholder-book-icon" aria-hidden="true">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                <line x1="8" y1="7" x2="16" y2="7" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </div>
            <p className="placeholder-card-title">More Books <br />Coming Soon</p>
          </div>
        </div>
      </div>
    </section>
  );
}
