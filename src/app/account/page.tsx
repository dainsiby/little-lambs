import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { PageHero } from '@/components/layout/PageHero';
import { Footer } from '@/components/layout/Footer';
import InnerHeader from '@/components/layout/InnerHeader';
import Link from 'next/link';
import { UserRound, ClipboardList, ShoppingBag, ArrowRight } from 'lucide-react';
import SignOutButton from '@/components/auth/SignOutButton';

export const metadata = {
  title: 'My Account | Little Lambs Store',
  description: 'Manage your Little Lambs profile, addresses, and order history.',
};

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/account');
  }

  return (
    <main id="main-content" className="site-canvas inner-canvas">
      <div className="landing-hero inner-hero-container">
        <PageHero
          title="Customer Profile"
          subtitle={`Welcome back, ${session.user.name || session.user.email}!`}
          badge="My Account"
        />

        <article className="account-container max-w-4xl mx-auto space-y-6 pb-12">
          {/* Customer Profile Summary Card */}
          <div className="editorial-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#f3edd9] flex items-center justify-center text-[#74291e] font-bold text-xl">
                <UserRound size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#092e4c] m-0">
                  {session.user.name || 'Little Lambs Customer'}
                </h2>
                <p className="text-sm text-[#4a626e] m-0">{session.user.email}</p>
                <span className="inline-block mt-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#e8ede3] text-[#455939]">
                  Customer Account
                </span>
              </div>
            </div>

            <SignOutButton />
          </div>

          {/* Quick Action Navigation Grid */}
          <div className="account-placeholders-grid">
            <Link href="/account/orders" className="account-placeholder-card group block hover:border-[#74291e] transition-colors">
              <span className="placeholder-icon text-[#74291e]">
                <ClipboardList size={28} />
              </span>
              <h3>Order History</h3>
              <p>View past book orders, receipt summaries, and delivery tracking status.</p>
              <span className="primary-cta mt-4 text-xs font-bold py-2 px-4 inline-flex items-center gap-1">
                View Orders &rarr;
              </span>
            </Link>

            <Link href="/checkout" className="account-placeholder-card group block hover:border-[#74291e] transition-colors">
              <span className="placeholder-icon text-[#74291e]">
                <ShoppingBag size={28} />
              </span>
              <h3>Saved Addresses</h3>
              <p>Manage shipping addresses for fast checkout during your next order.</p>
              <span className="secondary-cta mt-4 text-xs font-bold py-2 px-4 inline-flex items-center gap-1">
                Manage Addresses &rarr;
              </span>
            </Link>

            <Link href="/books" className="account-placeholder-card group block hover:border-[#74291e] transition-colors">
              <span className="placeholder-icon text-[#74291e]">
                <ArrowRight size={28} />
              </span>
              <h3>Explore Bookshop</h3>
              <p>Discover Little Lambs Christian activity books, stories, and prayers.</p>
              <span className="secondary-cta mt-4 text-xs font-bold py-2 px-4 inline-flex items-center gap-1">
                Browse Books &rarr;
              </span>
            </Link>
          </div>
        </article>

        <Footer inner />
      </div>
    </main>
  );
}
