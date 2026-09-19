'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Footer } from '@/components/layout/Footer';
import InnerHeader from '@/components/layout/InnerHeader';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message || 'If an account exists, reset instructions have been sent.');
    } catch {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main-content" className="site-canvas inner-canvas">
      <div className="landing-hero inner-hero-container">
        <PageHero
          title="Reset Password"
          subtitle="Enter your email address to receive password reset instructions."
          badge="Account Recovery"
        />

        <article className="auth-container">
          <div className="auth-card">
            <h2>Forgot Your Password?</h2>
            <p className="auth-subtitle">We will send a reset link to your email</p>

            {message ? (
              <div className="cart-notice-box" style={{ background: '#f0fdf4', color: '#166534', borderColor: '#bbf7d0' }}>
                <p>{message}</p>
                <div style={{ marginTop: '12px' }}>
                  <Link href="/login" className="auth-link">
                    Return to Sign In
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>

                <button type="submit" disabled={loading} className="primary-cta auth-submit-btn">
                  {loading ? 'Sending Instructions...' : 'Send Reset Link'}
                </button>

                <p className="auth-footer-text">
                  Remembered your password?{' '}
                  <Link href="/login" className="auth-link">
                    Sign In
                  </Link>
                </p>
              </form>
            )}
          </div>
        </article>

        <Footer />
      </div>
    </main>
  );
}
