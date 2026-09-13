import Link from "next/link";
import { ArrowRight } from "@/components/ui/Icons";

export function HeroPurchaseBlock() {
  return (
    <div className="hero-purchase-block">
      <div className="hero-purchase-content">
        <div className="hero-purchase-meta">
          <span className="hero-product-title">Little Lambs</span>
          <span className="hero-product-sub">English Christian Activity Book</span>
        </div>
        <span className="hero-price-tag">₹100</span>
      </div>
      <Link
        href="/books/little-lambs-christian-activity-book"
        className="primary-cta hero-purchase-cta"
      >
        <span>GET YOUR COPY</span>
        <ArrowRight />
      </Link>
    </div>
  );
}
