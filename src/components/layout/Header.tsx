'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, BookOpen, User, LogOut, Shield } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Books', href: '/books' },
    { name: 'Our Story', href: '/#our-story' },
    { name: 'About', href: '/#about' },
    { name: 'Contact', href: '/#contact' },
  ];

  const userRole = (session?.user as { role?: string })?.role;
  const isAdmin = userRole === 'ADMIN';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-brand-maroon/10 bg-brand-cream/95 backdrop-blur-md">
      {/* Top Storefront Announcement Strip */}
      <div className="bg-brand-maroon px-4 py-1.5 text-center text-xs font-medium text-brand-paper">
        <span>Official Storefront — Direct from Publisher & SMYM Elanji Unit</span>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-lg">
          <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-brand-maroon/20 bg-brand-paper shadow-sm">
            <Image
              src="/brand/logo.jpg"
              alt="Little Lambs Official Logo"
              fill
              sizes="48px"
              className="object-contain p-1"
              priority
            />
          </div>
          <div>
            <span className="font-heading text-2xl font-bold tracking-tight text-brand-maroon">
              Little Lambs
            </span>
            <span className="block text-[10px] font-semibold tracking-wider text-brand-slate uppercase">
              Christian Children&apos;s Books
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="focus-ring rounded-md text-sm font-semibold text-brand-maroon transition-colors hover:text-brand-maroon-dark"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons & User Session Menu */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/books"
            className="focus-ring inline-flex items-center gap-2 rounded-2xl bg-brand-maroon px-4 py-2 text-xs font-semibold text-brand-paper shadow-sm hover:bg-brand-maroon-dark transition-all"
          >
            <BookOpen className="h-4 w-4" />
            <span>Browse Catalogue</span>
          </Link>

          {session ? (
            <div className="flex items-center gap-3 border-l border-brand-maroon/15 pl-4">
              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  className="focus-ring inline-flex items-center gap-1.5 rounded-xl border border-brand-maroon/20 bg-brand-paper px-3 py-1.5 text-xs font-bold text-brand-maroon hover:bg-brand-maroon hover:text-brand-paper transition-all"
                >
                  <Shield className="h-3.5 w-3.5" />
                  <span>Admin</span>
                </Link>
              )}
              <span className="text-xs font-semibold text-brand-maroon max-w-[120px] truncate">
                {session.user?.name || session.user?.email}
              </span>
              <button
                type="button"
                onClick={() => signOut()}
                className="focus-ring p-1.5 text-brand-slate hover:text-brand-maroon rounded-lg"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="focus-ring inline-flex items-center gap-1.5 text-xs font-bold text-brand-maroon hover:underline border-l border-brand-maroon/15 pl-4"
            >
              <User className="h-4 w-4" />
              <span>Sign In</span>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="focus-ring md:hidden p-2 rounded-lg text-brand-maroon hover:bg-brand-maroon/10"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Slide-out Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-brand-maroon/10 bg-brand-paper px-4 pt-3 pb-6 shadow-lg">
          <nav className="flex flex-col gap-3" aria-label="Mobile Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="focus-ring rounded-lg px-3 py-2 text-base font-semibold text-brand-maroon hover:bg-brand-cream"
              >
                {link.name}
              </Link>
            ))}

            <div className="mt-4 pt-3 border-t border-brand-maroon/10 space-y-2">
              {session ? (
                <div className="space-y-2">
                  {isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="focus-ring flex items-center justify-center gap-2 rounded-2xl bg-brand-maroon px-4 py-2.5 text-sm font-semibold text-brand-paper"
                    >
                      <Shield className="h-4 w-4" />
                      <span>Admin Control Panel</span>
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut();
                    }}
                    className="w-full text-center text-xs font-bold text-red-700 py-2 hover:underline"
                  >
                    Sign Out ({session.user?.email})
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="focus-ring flex items-center justify-center gap-2 rounded-2xl border border-brand-maroon px-4 py-2.5 text-sm font-semibold text-brand-maroon"
                >
                  <User className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
