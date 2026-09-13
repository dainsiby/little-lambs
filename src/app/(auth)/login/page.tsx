"use client";

import { PageHero } from "@/components/layout/PageHero";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main id="main-content" className="site-canvas inner-canvas">
      <div className="landing-hero inner-hero-container">
        <PageHero
          title="Customer Sign In"
          subtitle="Access your Little Lambs account to track orders and save details."
          badge="Account Sign In"
        />

        <article className="auth-container">
          <div className="auth-card">
            <h2>Welcome Back</h2>
            <p className="auth-subtitle">Sign in to your Little Lambs account</p>

            <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="login-email">Email Address</label>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  placeholder="yourname@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <div className="label-with-link">
                  <label htmlFor="login-password">Password</label>
                  <span className="forgot-password-link">
                    Forgot password? (Coming soon)
                  </span>
                </div>
                <input
                  type="password"
                  id="login-password"
                  name="password"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button type="submit" className="primary-cta auth-submit-btn">
                Sign In
              </button>

              <p className="auth-footer-text">
                Don&apos;t have an account yet?{" "}
                <Link href="/register" className="auth-link">
                  Create an account
                </Link>
              </p>
            </form>

            <div className="auth-dev-notice">
              <p>⚙️ <strong>Authentication Integration Notice:</strong> Auth.js customer authentication and session persistence will be activated in the upcoming backend phase.</p>
            </div>
          </div>
        </article>

        <Footer />
      </div>
    </main>
  );
}
