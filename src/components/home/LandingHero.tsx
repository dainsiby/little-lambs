import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { HeroHeadlineUnderline } from "./HeroHeadlineUnderline";

export function LandingHero() {
  return (
    <section id="home" className="split-landing-hero" aria-labelledby="hero-title">
      <div className="split-hero-grid">
        {/* LEFT EDITORIAL CONTENT PANEL */}
        <div className="hero-editorial-panel">
          <div className="hero-editorial-content">
            <span className="hero-eyebrow">STORIES · PRAYERS · PLAY</span>

            <h1 id="hero-title" className="split-hero-headline">
              <span>A little book</span>
              <span>for growing</span>
              <span className="headline-underline-wrap">
                hearts &amp; minds.
                <HeroHeadlineUnderline />
              </span>
            </h1>

            <p className="split-hero-description">
              Stories, prayers and playful activities for ages 4–10.
            </p>

            <div className="hero-purchase-row">
              <span className="hero-price-badge">Little Lambs • ₹100</span>
              <Link href="/books" className="explore-books-cta">
                GET YOUR COPY <span>→</span>
              </Link>
            </div>

            <div className="hero-feature-badges">
              <div className="feature-badge-item">
                <span className="feature-badge-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </span>
                <span>Faith-Filled Stories</span>
              </div>
              <div className="feature-badge-item">
                <span className="feature-badge-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </span>
                <span>Prayers for Everyday Life</span>
              </div>
              <div className="feature-badge-item">
                <span className="feature-badge-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22a10 10 0 0 1-10-10c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10z" />
                    <path d="M12 6v12" />
                    <path d="M6 12h12" />
                  </svg>
                </span>
                <span>Fun Activities for Growing Minds</span>
              </div>
            </div>

            <div className="hero-signature-wrap">
              <span className="hero-signature-text">Small steps. A brighter tomorrow. 💛</span>
            </div>
          </div>
        </div>

        {/* ORGANIC CURVED DIVIDER WITH GOLD ACCENT */}
        <div className="hero-organic-divider-wrap" aria-hidden="true">
          <svg
            className="hero-wavy-edge-svg"
            viewBox="0 0 100 900"
            preserveAspectRatio="none"
          >
            <path
              d="M98 0C38 150 88 320 28 480C-32 620 68 780 8 900"
              stroke="#eca90b"
              strokeWidth="4"
              fill="none"
              opacity="0.95"
            />
          </svg>
        </div>

        {/* RIGHT ILLUSTRATED STORY SCENE PANEL */}
        <div className="hero-illustration-panel">
          <div
            className="hero-scene-wrap"
            role="img"
            aria-label="Jesus reading Little Lambs book with children beneath a leafy tree with a lamb and distant church"
          >
            <Image
              src="/illustrations/storybook-hero-scene.png"
              alt="Jesus reading Little Lambs book with children beneath a leafy tree with a lamb and distant church"
              fill
              priority
              unoptimized
              sizes="(max-width: 900px) 100vw, 56vw"
              className="hero-story-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

