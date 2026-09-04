'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/';

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
        router.push(redirectTo);
        router.refresh();
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-xs font-semibold text-brand-slate uppercase">
          Email Address
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

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-xs font-semibold text-brand-slate uppercase">
            Password
          </label>
          <a href="/forgot-password" className="text-xs font-semibold text-brand-maroon hover:underline">
            Forgot Password?
          </a>
        </div>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="focus-ring mt-1 block w-full rounded-xl border border-brand-maroon/20 bg-brand-paper px-3.5 py-2.5 text-sm text-brand-maroon"
          placeholder="••••••••"
        />
      </div>

      <div className="pt-2">
        <Button type="submit" variant="primary" size="md" className="w-full" disabled={loading}>
          {loading ? 'Logging in...' : 'Sign In'}
        </Button>
      </div>
    </form>
  );
}
