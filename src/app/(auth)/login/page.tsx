import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Log in to your Little Lambs Store account.',
};

export default function LoginPage() {
  return (
    <main className="flex min-h-[75vh] flex-col items-center justify-center p-6 bg-brand-cream">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-brand-maroon/15 bg-brand-paper p-8 shadow-sm">
        <div className="text-center space-y-2">
          <h1 className="font-heading text-3xl font-extrabold text-brand-maroon">
            Sign In
          </h1>
          <p className="text-xs text-brand-slate">
            Welcome back to Little Lambs Bookstore
          </p>
        </div>

        <Suspense fallback={<div className="text-center text-xs">Loading...</div>}>
          <LoginForm />
        </Suspense>

        <div className="text-center border-t border-brand-maroon/10 pt-4 text-xs text-brand-slate">
          <span>Don&apos;t have an account yet? </span>
          <Link href="/register" className="font-bold text-brand-maroon hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </main>
  );
}
