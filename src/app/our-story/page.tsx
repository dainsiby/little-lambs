import { PageHero } from "@/components/layout/PageHero";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/Icons";

export const metadata = {
  title: "Our Story | Little Lambs Christian Activity Series",
  description: "Learn about Little Lambs — a Christian activity book series for children ages 4–10 created by SMYM Elanji Unit and published by Atma Books.",
};

export default function OurStoryPage() {
  return (
    <main id="main-content" className="site-canvas inner-canvas">
      <div className="landing-hero inner-hero-container">
        <PageHero
          title="Our Story"
          subtitle="Nurturing faith, joy, and learning in young hearts & minds."
          badge="Made with Love"
        />

        <article className="story-content-wrap">
          <section className="editorial-card">
            <h2>A Little Book for Growing Hearts</h2>
            <p>
              <strong>Little Lambs</strong> began with a simple yet profound goal: to create a warm, engaging, and faith-filled learning companion for children as they grow in their early Christian journey.
            </p>
            <p>
              Designed thoughtfully for young learners aged <strong>4 to 10</strong>, the Little Lambs series combines timeless Christian prayers and biblical teachings with delightful illustrations, hands-on activities, puzzles, and creative coloring pages.
            </p>
          </section>

          <section className="editorial-grid">
            <div className="story-box">
              <span className="story-icon">✝️</span>
              <h3>Faith-Centered Content</h3>
              <p>Every page introduces children to fundamental daily prayers, scripture stories, and moral reflection tailored to young minds.</p>
            </div>
            <div className="story-box">
              <span className="story-icon">🎨</span>
              <h3>Playful Activities</h3>
              <p>From word searches and mazes to coloring and drawing, learning about faith becomes a joyful and interactive adventure.</p>
            </div>
            <div className="story-box">
              <span className="story-icon">📖</span>
              <h3>Growing Book Series</h3>
              <p>Starting with our flagship English Christian Activity Book, Little Lambs is expanding into a full series of activity and storybooks.</p>
            </div>
          </section>

          <section className="editorial-card callout-card">
            <h2>Created with Care</h2>
            <p>
              Created by the <strong>SMYM Elanji Unit</strong> and published by <strong>Atma Books</strong>, Little Lambs represents a shared dedication to nurturing children&apos;s spiritual growth and creative expression.
            </p>
            <div className="story-cta-box">
              <Link href="/books" className="primary-cta">
                Explore Our Book <ArrowRight />
              </Link>
            </div>
          </section>
        </article>

        <Footer />
      </div>
    </main>
  );
}
