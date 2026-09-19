import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { PageHero } from '@/components/layout/PageHero';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { UserRound, ClipboardList, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import SignOutButton from '@/components/auth/SignOutButton';
import { prisma } from '@/lib/db/prisma';

export const metadata = {
  title: 'My Account | Little Lambs Store',
  description: 'Manage your Little Lambs profile, addresses, and order history.',
};

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/account');
  }

  // Fetch live role from PostgreSQL
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  const isAdmin = dbUser?.role === 'ADMIN';

  return (
    <main id="main-content" className="site-canvas inner-canvas">
      <div className="landing-hero inner-hero-container">
        <PageHero
          title="Customer Profile"
          subtitle={`Welcome back, ${session.user.name || session.user.email}!`}
          badge="My Account"
        />

        <article className="account-container max-w-4xl mx-auto space-y-6 pb-12">
          {/* Profile Summary Card */}
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
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-block text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isAdmin ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-[#e8ede3] text-[#455939]'
                  }`}>
                    {isAdmin ? 'ADMINISTRATOR' : 'CUSTOMER ACCOUNT'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  className="bg-[#74291e] hover:bg-[#5a2017] text-white font-bold text-xs py-2 px-4 rounded-xl transition-colors inline-flex items-center gap-1.5 shadow-xs"
                >
                  <ShieldCheck size={16} />
                  <span>Admin Portal</span>
                </Link>
              )}
              <SignOutButton />
            </div>
          </div>

          {/* Quick Action Navigation Grid */}
          <div className="account-placeholders-grid">
            {isAdmin && (
              <Link href="/admin/dashboard" className="account-placeholder-card group block hover:border-[#74291e] transition-colors border-amber-300 bg-amber-50/40">
                <span className="placeholder-icon text-[#74291e]">
                  <ShieldCheck size={28} />
                </span>
                <h3>Admin Control Panel</h3>
                <p>Manage order fulfillment, verify UTR payments, track inventory, and edit catalogue books.</p>
                <span className="primary-cta mt-4 text-xs font-bold py-2 px-4 inline-flex items-center gap-1">
                  Access Admin Portal &rarr;
                </span>
              </Link>
            )}
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
