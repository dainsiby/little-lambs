import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/Icons";

export function OurStoryTeaser() {
  return (
    <section className="our-story-teaser" aria-label="Our Story Teaser">
      <div className="story-teaser-container">
        <div className="story-teaser-card">
          {/* LEFT MASCOT ILLUSTRATION COL */}
          <div className="story-card-illustration-col">
            <div className="mascot-img-wrap">
              <Image
                src="/illustrations/our-story-left-panel.png"
                alt="Little Lambs - Made with love. Shared with little hearts."
                width={353}
                height={461}
                className="story-mascot-img"
              />
            </div>
          </div>

          {/* RIGHT STORY CONTENT COL */}
          <div className="story-card-content-col">
            <span className="section-eyebrow story-eyebrow">OUR LITTLE STORY</span>
            <h2 className="story-teaser-title">
              A first book. <br />
              A whole lot of heart.
            </h2>
            <p className="story-teaser-copy">
              We believe learning about faith can feel as natural as playing together. That simple idea is where Little Lambs began.
            </p>
            <p className="story-teaser-subcopy">
              Created by SMYM Elanji Unit, this is the first book in our series. More books are planned. For now, this is where our story begins.
            </p>

            <div className="story-publisher-credits">
              <p className="credit-org">SMYM Elanji Unit</p>
              <p className="credit-pub">Published by Atma Books, Kozhikode</p>
            </div>

            <div className="story-teaser-actions">
              <Link href="/our-story" className="story-secondary-cta">
                Read Our Full Story <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



