import Image from "next/image";
import Link from "next/link";
import { HeroHeadlineUnderline } from "./HeroHeadlineUnderline";

export function LandingHero() {
  return (
    <section id="home" className="split-landing-hero" aria-labelledby="hero-title">
      <div className="split-hero-grid">
        <svg className="hero-paper-desktop" viewBox="0 0 600 900" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 0H430C430 140 620 250 580 440S460 620 540 900H0Z" fill="var(--paper)" />
          <path d="M420 0C420 140 610 250 570 440S450 620 530 900" fill="none" stroke="#eca90b" strokeWidth="2" />
        </svg>
        {/* LEFT EDITORIAL CONTENT PANEL */}
        <div className="hero-editorial-panel">
          <div className="hero-editorial-content">


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
              <Link href="#books" className="explore-books-cta">
                Explore Books <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="hero-feature-badges">
              <div className="feature-badge-item">
                <span className="feature-badge-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v16M12 5C8 2 4 2 1 4v16c4-2 7-2 11 1 4-3 7-3 11-1V4c-3-2-7-2-11 1Z" />
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
                    <path d="M12 22V12M12 15C5 16 2 12 2 7c6 0 10 2 10 8ZM12 12C12 5 16 2 22 2c0 6-4 10-10 10Z" />
                  </svg>
                </span>
                <span>Fun Activities for Growing Minds</span>
              </div>
            </div>

            <div className="hero-signature-wrap">
              <span className="hero-signature-text">Small steps.<br />A brighter tomorrow. <span className="hero-signature-heart" aria-hidden="true">♥</span></span>
            </div>
          </div>
        </div>

        {/* RIGHT ILLUSTRATED STORY SCENE PANEL */}
        <div className="hero-illustration-panel">
          <svg className="hero-paper-mobile" viewBox="0 0 400 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 0H400C365 100 65 25 0 100Z" fill="var(--paper)" />
            <path d="M0 91C65 16 365 91 400 0" fill="none" stroke="#eca90b" strokeWidth="1.5" />
          </svg>
          <div className="hero-scene-wrap">
            <Image
              src="/illustrations/storybook-hero-portrait.webp"
              alt="Jesus reading Little Lambs book with children beneath a leafy tree with a lamb and distant church"
              fill
              preload
              unoptimized
              sizes="(max-width: 900px) 100vw, 65vw"
              className="hero-story-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

