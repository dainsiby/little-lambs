import { PageHero } from "@/components/layout/PageHero";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/Icons";

export const metadata = {
  title: "My Account | Little Lambs Store",
  description: "Manage your Little Lambs profile, addresses, and order history.",
};

export default function AccountPage() {
  return (
    <main id="main-content" className="site-canvas inner-canvas">
      <div className="landing-hero inner-hero-container">
        <PageHero
          title="Customer Account"
          subtitle="Manage your saved details, delivery addresses, and purchase history."
          badge="Customer Portal"
        />

        <article className="account-container">
          {/* Guest State Banner */}
          <div className="account-guest-banner">
            <div className="guest-banner-icon">👤</div>
            <div className="guest-banner-content">
              <h2>Sign in to view your account</h2>
              <p>Please log in or register a new customer account to access saved details and order tracking.</p>
              <div className="guest-banner-actions">
                <Link href="/login" className="primary-cta">
                  Sign In <ArrowRight />
                </Link>
                <Link href="/register" className="secondary-cta">
                  Create Account
                </Link>
              </div>
            </div>
          </div>

          {/* Placeholders for Future Account Sections */}
          <div className="account-placeholders-grid">
            <div className="account-placeholder-card">
              <span className="placeholder-icon">📋</span>
              <h3>Order History</h3>
              <p>View past orders, receipt details, and delivery tracking status.</p>
              <span className="placeholder-tag">Requires Sign In</span>
            </div>

            <div className="account-placeholder-card">
              <span className="placeholder-icon">🏡</span>
              <h3>Delivery Addresses</h3>
              <p>Save shipping addresses for faster future order checkout.</p>
              <span className="placeholder-tag">Requires Sign In</span>
            </div>

            <div className="account-placeholder-card">
              <span className="placeholder-icon">🔒</span>
              <h3>Account Security</h3>
              <p>Update your email address, full name, and login password.</p>
              <span className="placeholder-tag">Requires Sign In</span>
            </div>
          </div>
        </article>

        <Footer />
      </div>
    </main>
  );
}
