'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawUrl = searchParams.get('callbackUrl') || searchParams.get('redirectTo');

  // Safe redirect check: allow internal relative paths starting with / (excluding // and \)
  const isSafe = rawUrl && rawUrl.startsWith('/') && !rawUrl.startsWith('//') && !rawUrl.includes('\\');
  const targetRedirect = isSafe ? (rawUrl as string) : '/account';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Invalid email address or password.');
      } else {
        try {
          const sessionRes = await fetch('/api/auth/session');
          const sessionData = await sessionRes.json();
          if (sessionData?.user?.role === 'ADMIN' && !rawUrl) {
            router.push('/admin');
          } else {
            router.push(targetRedirect);
          }
        } catch {
          router.push(targetRedirect);
        }
        router.refresh();
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {error && (
        <div className="cart-notice-box" style={{ background: '#fee2e2', color: '#991b1b', borderColor: '#fca5a5' }}>
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="login-email">Email Address</label>
        <input
          id="login-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
        />
      </div>

      <div className="form-group">
        <div className="label-with-link">
          <label htmlFor="login-password">Password</label>
          <Link href="/forgot-password" className="forgot-password-link">
            Forgot Password?
          </Link>
        </div>
        <input
          id="login-password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>

      <button type="submit" disabled={loading} className="primary-cta auth-submit-btn">
        {loading ? 'Signing In...' : 'Sign In'}
      </button>

      <p className="auth-footer-text">
        Don&apos;t have an account yet?{' '}
        <Link href="/register" className="auth-link">
          Create an account
        </Link>
      </p>
    </form>
  );
}
