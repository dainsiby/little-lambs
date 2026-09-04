'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

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
    <main className="flex min-h-[75vh] flex-col items-center justify-center p-6 bg-brand-cream">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-brand-maroon/15 bg-brand-paper p-8 shadow-sm">
        <div className="text-center space-y-2">
          <h1 className="font-heading text-3xl font-extrabold text-brand-maroon">
            Reset Password
          </h1>
          <p className="text-xs text-brand-slate">
            Enter your email address to receive password reset instructions
          </p>
        </div>

        {message ? (
          <div className="rounded-2xl bg-emerald-50 p-4 text-center text-xs font-semibold text-emerald-800 border border-emerald-200 space-y-3">
            <p>{message}</p>
            <Link href="/login" className="inline-block font-bold text-brand-maroon hover:underline">
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-brand-slate uppercase">
                Registered Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus-ring mt-1 block w-full rounded-xl border border-brand-maroon/20 bg-brand-paper px-3.5 py-2.5 text-sm text-brand-maroon"
                placeholder="your.email@example.com"
              />
            </div>

            <Button type="submit" variant="primary" size="md" className="w-full" disabled={loading}>
              {loading ? 'Processing...' : 'Send Reset Instructions'}
            </Button>

            <div className="text-center pt-2 text-xs text-brand-slate">
              <Link href="/login" className="font-bold text-brand-maroon hover:underline">
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
