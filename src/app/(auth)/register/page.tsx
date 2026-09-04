import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import RegisterForm from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Register for a Little Lambs Store customer account.',
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center p-6 bg-brand-cream">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-brand-maroon/15 bg-brand-paper p-8 shadow-sm">
        <div className="text-center space-y-2">
          <h1 className="font-heading text-3xl font-extrabold text-brand-maroon">
            Create Account
          </h1>
          <p className="text-xs text-brand-slate">
            Join the Little Lambs Christian reader community
          </p>
        </div>

        <RegisterForm />

        <div className="text-center border-t border-brand-maroon/10 pt-4 text-xs text-brand-slate">
          <span>Already registered? </span>
          <Link href="/login" className="font-bold text-brand-maroon hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </main>
  );
}
