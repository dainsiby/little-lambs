'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      setError('Missing or invalid reset token');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Password reset failed');
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login?resetSuccess=true');
        }, 2000);
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <p className="text-sm font-semibold text-red-700">Invalid or missing reset token.</p>
        <Link href="/forgot-password" className="text-xs font-bold text-brand-maroon underline">
          Request a new password reset token
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="rounded-2xl bg-emerald-50 p-4 text-center text-xs font-semibold text-emerald-800 border border-emerald-200 space-y-2">
        <p>Password successfully reset!</p>
        <p className="text-brand-slate text-[11px]">Redirecting to Sign In...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="password" className="block text-xs font-semibold text-brand-slate uppercase">
          New Password (min 8 characters)
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="focus-ring mt-1 block w-full rounded-xl border border-brand-maroon/20 bg-brand-paper px-3.5 py-2.5 text-sm text-brand-maroon"
          placeholder="••••••••"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-xs font-semibold text-brand-slate uppercase">
          Confirm New Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="focus-ring mt-1 block w-full rounded-xl border border-brand-maroon/20 bg-brand-paper px-3.5 py-2.5 text-sm text-brand-maroon"
          placeholder="••••••••"
        />
      </div>

      <Button type="submit" variant="primary" size="md" className="w-full" disabled={loading}>
        {loading ? 'Resetting Password...' : 'Update Password'}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-[75vh] flex-col items-center justify-center p-6 bg-brand-cream">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-brand-maroon/15 bg-brand-paper p-8 shadow-sm">
        <div className="text-center space-y-2">
          <h1 className="font-heading text-3xl font-extrabold text-brand-maroon">
            New Password
          </h1>
          <p className="text-xs text-brand-slate">
            Enter your new account password below
          </p>
        </div>

        <Suspense fallback={<div className="text-center text-xs">Loading...</div>}>
          <ResetPasswordContent />
        </Suspense>
      </div>
    </main>
  );
}
