import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center bg-brand-cream">
      <div className="max-w-md space-y-6 rounded-3xl border border-brand-maroon/15 bg-brand-paper p-8 shadow-sm">
        <div className="font-heading text-6xl font-extrabold text-brand-maroon">
          404
        </div>
        <h1 className="font-heading text-2xl font-bold text-brand-maroon">
          Page Not Found
        </h1>
        <p className="text-sm text-brand-slate leading-relaxed">
          Oops! The story page you are looking for does not exist or may have been moved.
        </p>
        <div>
          <Button href="/" variant="primary" size="md">
            Return to Homepage
          </Button>
        </div>
      </div>
    </main>
  );
}
