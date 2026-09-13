import Link from "next/link";
import { ArrowRight } from "@/components/ui/Icons";

export function ExploreBooksCTA() {
  return (
    <section className="explore-cta-section" aria-label="Explore Books">
      <div className="explore-cta-container">
        <div className="explore-cta-box">
          <h2 className="explore-cta-title">Ready to Explore Our Catalogue?</h2>
          <p className="explore-cta-desc">
            Discover the first volume in the Little Lambs Christian activity book series today.
          </p>
          <div className="explore-cta-actions">
            <Link href="/books" className="primary-cta explore-cta-btn">
              EXPLORE BOOKS <ArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
