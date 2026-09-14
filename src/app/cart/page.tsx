import { ShoppingBag } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/Icons";

export const metadata = {
  title: "Shopping Cart | Little Lambs Store",
  description: "View and manage items in your Little Lambs shopping cart.",
};

export default function CartPage() {
  return (
    <main id="main-content" className="site-canvas inner-canvas">
      <div className="landing-hero inner-hero-container">
        <PageHero
          title="Your Cart"
          subtitle="Review your selected books before checkout."
          badge="Shopping Cart"
        />

        <article className="cart-container">
          {/* Polished Empty Cart Shell State */}
          <div className="empty-cart-card">
            <div className="empty-cart-icon"><ShoppingBag size={24} aria-hidden="true" /></div>
            <h2>Your Shopping Cart is Empty</h2>
            <p>
              Explore our Christian activity books for children ages 4 to 10 and add them to your cart.
            </p>
            <div className="empty-cart-actions">
              <Link href="/books" className="primary-cta">
                Browse Books <ArrowRight />
              </Link>
            </div>
          </div>

          <div className="cart-notice-box"><strong>Looking for a copy?</strong><p>Online ordering is not available yet. <Link href="/contact" className="contact-link-inline">Contact the publisher</Link> to enquire about books.</p></div>
        </article>

        <Footer inner />
      </div>
    </main>
  );
}
