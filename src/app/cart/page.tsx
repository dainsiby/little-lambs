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
            <div className="empty-cart-icon">🛒</div>
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

          {/* Reusable Cart Summary Shell (Disabled until backend integration) */}
          <div className="cart-shell-preview">
            <div className="cart-notice-box">
              <span className="notice-icon">⚙️</span>
              <div className="notice-content">
                <strong>Storefront Cart Integration</strong>
                <p>Cart state management and persistent checkout will be enabled in the upcoming release phase.</p>
              </div>
            </div>
          </div>
        </article>

        <Footer />
      </div>
    </main>
  );
}
