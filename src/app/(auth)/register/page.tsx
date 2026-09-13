"use client";

import { PageHero } from "@/components/layout/PageHero";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <main id="main-content" className="site-canvas inner-canvas">
      <div className="landing-hero inner-hero-container">
        <PageHero
          title="Create Account"
          subtitle="Join Little Lambs to order books, manage addresses, and view order status."
          badge="New Customer"
        />

        <article className="auth-container">
          <div className="auth-card">
            <h2>Create Your Account</h2>
            <p className="auth-subtitle">Fill in your details below to register</p>

            <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="reg-name">Full Name</label>
                <input
                  type="text"
                  id="reg-name"
                  name="fullName"
                  placeholder="e.g. Sarah Joseph"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-email">Email Address</label>
                <input
                  type="email"
                  id="reg-email"
                  name="email"
                  placeholder="sarah@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-password">Password</label>
                <input
                  type="password"
                  id="reg-password"
                  name="password"
                  placeholder="Minimum 8 characters"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-confirm-password">Confirm Password</label>
                <input
                  type="password"
                  id="reg-confirm-password"
                  name="confirmPassword"
                  placeholder="Repeat your password"
                  required
                />
              </div>

              <button type="submit" className="primary-cta auth-submit-btn">
                Create Account
              </button>

              <p className="auth-footer-text">
                Already have an account?{" "}
                <Link href="/login" className="auth-link">
                  Sign in
                </Link>
              </p>
            </form>

            <div className="auth-dev-notice">
              <p>⚙️ <strong>Account Registration Notice:</strong> Customer account creation and password security will be enabled in the upcoming backend integration phase.</p>
            </div>
          </div>
        </article>

        <Footer />
      </div>
    </main>
  );
}
