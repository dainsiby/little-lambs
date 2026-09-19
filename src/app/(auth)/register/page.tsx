import React, { Suspense } from 'react';
import { PageHero } from '@/components/layout/PageHero';
import { Footer } from '@/components/layout/Footer';
import RegisterForm from '@/components/auth/RegisterForm';
import InnerHeader from '@/components/layout/InnerHeader';

export default function RegisterPage() {
  return (
    <main id="main-content" className="site-canvas inner-canvas">
      <div className="landing-hero inner-hero-container">
        <PageHero
          title="Create Account"
          subtitle="Join Little Lambs to order books, manage saved addresses, and track order status."
          badge="New Customer"
        />

        <article className="auth-container">
          <div className="auth-card">
            <h2>Create Your Account</h2>
            <p className="auth-subtitle">Fill in your details below to register</p>

            <Suspense fallback={<p>Loading registration form...</p>}>
              <RegisterForm />
            </Suspense>
          </div>
        </article>

        <Footer />
      </div>
    </main>
  );
}
