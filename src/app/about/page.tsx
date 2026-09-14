import { PageHero } from "@/components/layout/PageHero";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/Icons";

export const metadata = {
  title: "About Us | Little Lambs Christian Activity Series",
  description: "Learn about the mission, creator (SMYM Elanji Unit), and publisher (Atma Books) behind Little Lambs Christian activity books.",
};

export default function AboutPage() {
  return (
    <main id="main-content" className="site-canvas inner-canvas">
      <div className="landing-hero inner-hero-container">
        <PageHero
          title="About Little Lambs"
          subtitle="Educational, faith-inspired activity books crafted for young learners."
          badge="Faith &amp; Learning"
        />

        <article className="about-content-wrap">
          <section className="about-grid">
            <div className="about-card">
              <h2>What is Little Lambs?</h2>
              <p>
                Little Lambs is a Christian activity book series designed to introduce young children to prayer, Bible teachings, and moral values through fun, interactive learning experiences.
              </p>
            </div>

            <div className="about-card">
              <h2>Target Audience</h2>
              <p>
                Tailored specifically for children approximately <strong>ages 4 to 10</strong>. Content is structured to be accessible for early readers, family prayer times, and Sunday school learning.
              </p>
            </div>
          </section>

          <section className="about-specs-card">
            <h2>Official Publication Details</h2>
            <div className="specs-grid">
              <div className="spec-item">
                <span className="spec-item-label">Series Name</span>
                <span className="spec-item-val">Little Lambs</span>
              </div>
              <div className="spec-item">
                <span className="spec-item-label">Current Release</span>
                <span className="spec-item-val">English Christian Activity Book</span>
              </div>
              <div className="spec-item">
                <span className="spec-item-label">ISBN</span>
                <span className="spec-item-val">978-93-88909-19-8</span>
              </div>
              <div className="spec-item">
                <span className="spec-item-label">Current Price</span>
                <span className="spec-item-val">₹100</span>
              </div>
              <div className="spec-item">
                <span className="spec-item-label">Creator</span>
                <span className="spec-item-val">SMYM Elanji Unit</span>
              </div>
              <div className="spec-item">
                <span className="spec-item-label">Publisher</span>
                <span className="spec-item-val">Atma Books</span>
              </div>
            </div>
          </section>

          <section className="about-cta-section">
            <h2>Discover Our Activity Book</h2>
            <p>Explore the full breakdown of prayers, stories, coloring, and games inside the first volume.</p>
            <Link href="/books/little-lambs-christian-activity-book" className="primary-cta">
              View Book Details <ArrowRight />
            </Link>
          </section>
        </article>

        <Footer inner />
      </div>
    </main>
  );
}
