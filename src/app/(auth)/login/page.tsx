import React, { Suspense } from 'react';
import { PageHero } from '@/components/layout/PageHero';
import { Footer } from '@/components/layout/Footer';
import LoginForm from '@/components/auth/LoginForm';
import InnerHeader from '@/components/layout/InnerHeader';

export default function LoginPage() {
  return (
    <main id="main-content" className="site-canvas inner-canvas">
      <div className="landing-hero inner-hero-container">
        <PageHero
          title="Sign In"
          subtitle="Access your Little Lambs account to track orders and manage your saved details."
          badge="Account Sign In"
        />

        <article className="auth-container">
          <div className="auth-card">
            <h2>Welcome Back</h2>
            <p className="auth-subtitle">Sign in to your Little Lambs account</p>

            <Suspense fallback={<p>Loading sign in form...</p>}>
              <LoginForm />
            </Suspense>
          </div>
        </article>

        <Footer />
      </div>
    </main>
  );
}
