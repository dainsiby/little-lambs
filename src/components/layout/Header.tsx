'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, BookOpen, User, LogOut, Shield, Search } from 'lucide-react';

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
    <header className="sticky top-0 z-40 w-full border-b border-brand-maroon/10 bg-[#FAF6EE]/95 backdrop-blur-md transition-all">
      {/* Top Storefront Announcement Strip */}
      <div className="bg-brand-maroon px-4 py-1.5 text-center text-xs font-semibold tracking-wide text-brand-paper shadow-xs">
        <span>Official Storefront — Direct from Publisher &amp; SMYM Elanji Unit</span>
      </div>

      <div className="mx-auto flex max-w-[1360px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Official Little Lambs Logo Emblem & Typography */}
        <Link href="/" className="focus-ring group flex items-center gap-3 rounded-xl p-1" aria-label="Little Lambs Home">
          <div className="relative h-12 sm:h-14 w-12 sm:w-14 shrink-0 transition-transform group-hover:scale-105">
            <Image
              src="/brand/logo-clean.png"
              alt="Little Lambs Logo Emblem"
              fill
              sizes="56px"
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-xl sm:text-2xl font-extrabold tracking-tight text-brand-maroon leading-none">
              Little Lambs
            </span>
            <span className="text-[9px] sm:text-[10px] font-extrabold tracking-wider text-brand-maroon/80 uppercase mt-0.5">
              Christian Children&apos;s Books
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="focus-ring rounded-lg px-2.5 py-1 text-sm font-bold text-brand-maroon/90 transition-all hover:bg-brand-maroon/10 hover:text-brand-maroon"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Header Actions & Search Placeholder */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="relative w-44 xl:w-52">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-brand-slate/60" />
            <input
              type="text"
              placeholder="Search books..."
              disabled
              className="w-full rounded-full border border-brand-maroon/15 bg-brand-paper/80 py-1.5 pl-8 pr-3 text-xs text-brand-slate cursor-not-allowed opacity-75 placeholder:text-brand-slate/50"
              aria-label="Search books (disabled)"
            />
          </div>
        </div>

        {/* User Session Menu & Catalog Link */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/books"
            className="focus-ring inline-flex items-center gap-2 rounded-full bg-brand-maroon px-4 py-2 text-xs font-extrabold text-brand-paper shadow-xs hover:bg-brand-maroon-dark transition-all hover:shadow-sm"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Browse</span>
          </Link>

          {session ? (
            <div className="flex items-center gap-3 border-l border-brand-maroon/15 pl-3">
              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-brand-maroon/20 bg-brand-paper px-3 py-1.5 text-xs font-bold text-brand-maroon hover:bg-brand-maroon hover:text-brand-paper transition-all"
                >
                  <Shield className="h-3.5 w-3.5" />
                  <span>Admin</span>
                </Link>
              )}
              <span className="text-xs font-bold text-brand-maroon max-w-[110px] truncate">
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
              className="focus-ring inline-flex items-center gap-1.5 text-xs font-bold text-brand-maroon hover:underline border-l border-brand-maroon/15 pl-3"
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
          className="focus-ring md:hidden p-2 rounded-xl text-brand-maroon hover:bg-brand-maroon/10 transition-colors"
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
        <div className="md:hidden border-t border-brand-maroon/10 bg-brand-paper px-4 pt-3 pb-6 shadow-md">
          <nav className="flex flex-col gap-2" aria-label="Mobile Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="focus-ring rounded-lg px-3 py-2.5 text-base font-bold text-brand-maroon hover:bg-brand-cream/80"
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
                      className="focus-ring flex items-center justify-center gap-2 rounded-full bg-brand-maroon px-4 py-2.5 text-sm font-bold text-brand-paper"
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
                  className="focus-ring flex items-center justify-center gap-2 rounded-full border-2 border-brand-maroon px-4 py-2.5 text-sm font-bold text-brand-maroon hover:bg-brand-maroon hover:text-brand-paper transition-all"
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
