'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, BookOpen } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Books', href: '/books' },
    { name: 'Our Story', href: '/#our-story' },
    { name: 'About', href: '/#about' },
    { name: 'Contact', href: '/#contact' },
  ];

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

        {/* CTA Button / Catalogue Shortcut */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/books"
            className="focus-ring inline-flex items-center gap-2 rounded-2xl bg-brand-maroon px-4 py-2 text-xs font-semibold text-brand-paper shadow-sm hover:bg-brand-maroon-dark transition-all"
          >
            <BookOpen className="h-4 w-4" />
            <span>Browse Catalogue</span>
          </Link>
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
            <div className="mt-4 pt-3 border-t border-brand-maroon/10">
              <Link
                href="/books"
                onClick={() => setMobileMenuOpen(false)}
                className="focus-ring flex items-center justify-center gap-2 rounded-2xl bg-brand-maroon px-4 py-3 text-sm font-semibold text-brand-paper shadow-sm"
              >
                <BookOpen className="h-4 w-4" />
                <span>Browse Catalogue</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
