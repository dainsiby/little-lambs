import { Info } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/Icons";

export const metadata = {
  title: "Checkout | Little Lambs Store",
  description: "Complete your book order with shipping details and manual UPI payment.",
};

export default function CheckoutPage() {
  return (
    <main id="main-content" className="site-canvas inner-canvas">
      <div className="landing-hero inner-hero-container">
        <PageHero
          title="Checkout"
          subtitle="Complete your delivery address and payment details."
          badge="Ordering information"
        />

        <article className="checkout-container">
          <div className="checkout-grid">
            {/* Inactive Form Steps */}
            <div className="checkout-steps-column">
              {/* Step 1: Customer Info */}
              <div className="checkout-step-card disabled-step">
                <div className="step-header">
                  <span className="step-number">1</span>
                  <h3>Contact &amp; Account Information</h3>
                </div>
                <div className="step-body">
                  <p className="step-placeholder-text">
                    Email address and phone number for order updates.
                  </p>
                </div>
              </div>

              {/* Step 2: Shipping Address */}
              <div className="checkout-step-card disabled-step">
                <div className="step-header">
                  <span className="step-number">2</span>
                  <h3>Shipping Address</h3>
                </div>
                <div className="step-body">
                  <p className="step-placeholder-text">
                    Recipient name, house/street address, city, state, pincode, and phone number.
                  </p>
                </div>
              </div>

              {/* Step 3: Payment Method */}
              <div className="checkout-step-card disabled-step">
                <div className="step-header">
                  <span className="step-number">3</span>
                  <h3>Payment Method (Manual UPI)</h3>
                </div>
                <div className="step-body">
                  <p className="step-placeholder-text">
                    Manual UPI transfer with UTR transaction reference verification.
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary Column */}
            <div className="checkout-summary-column">
              <div className="checkout-summary-card">
                <h3>Order Summary</h3>
                <div className="summary-empty-notice">
                  <p>Your shopping cart is currently empty.</p>
                </div>
                <div className="summary-actions">
                  <Link href="/books" className="primary-cta summary-btn">
                    Browse Books <ArrowRight />
                  </Link>
                </div>
              </div>

              <div className="checkout-integration-notice">
                <span className="notice-icon"><Info size={24} aria-hidden="true" /></span>
                <div className="notice-content">
                  <strong>Online ordering is not available yet</strong>
                  <p>Please contact the publisher about availability and ordering. No payment is collected on this page.</p>
                </div>
              </div>
            </div>
          </div>
        </article>

        <Footer inner />
      </div>
    </main>
  );
}
