import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TornPaperDivider from '@/components/ui/TornPaperDivider';

export default function Footer() {
  return (
    <footer className="mt-auto bg-brand-maroon text-brand-paper">
      {/* Torn-Paper Top Divider */}
      <TornPaperDivider position="top" bgClass="bg-brand-cream" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Column 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-brand-paper/30 bg-brand-paper">
                <Image
                  src="/brand/logo.jpg"
                  alt="Little Lambs Logo"
                  fill
                  sizes="40px"
                  className="object-contain p-1"
                />
              </div>
              <span className="font-heading text-2xl font-bold tracking-tight text-brand-paper">
                Little Lambs
              </span>
            </div>
            <p className="text-sm text-brand-paper/80 max-w-md">
              A dedicated Christian children&apos;s book series creating wholesome activity books, Bible stories, prayers, colouring, and puzzles for little ones.
            </p>
            <p className="text-xs text-brand-paper/60">
              An initiative by <strong className="text-brand-paper/90">SMYM Elanji Unit</strong>, published by <strong className="text-brand-paper/90">Pavanatma Publishers Pvt. Ltd. / Atma Books</strong>.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3 className="font-heading text-lg font-bold text-brand-paper">Quick Links</h3>
            <ul className="mt-3 space-y-2 text-sm text-brand-paper/80">
              <li>
                <Link href="/" className="focus-ring rounded hover:underline hover:text-brand-paper">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/books" className="focus-ring rounded hover:underline hover:text-brand-paper">
                  Books Catalogue
                </Link>
              </li>
              <li>
                <Link href="/#our-story" className="focus-ring rounded hover:underline hover:text-brand-paper">
                  Our Story — SMYM Elanji
                </Link>
              </li>
              <li>
                <Link href="/#about" className="focus-ring rounded hover:underline hover:text-brand-paper">
                  About the Series
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="focus-ring rounded hover:underline hover:text-brand-paper">
                  Contact & Publisher Info
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Publisher & Factual Details */}
          <div>
            <h3 className="font-heading text-lg font-bold text-brand-paper">Publisher Info</h3>
            <div className="mt-3 space-y-2 text-xs text-brand-paper/80">
              <p className="font-semibold text-brand-paper">Pavanatma Publishers Pvt. Ltd. / Atma Books</p>
              <p>English Christian Activity Book Series</p>
              <p>Target Age Group: 4–10 Years</p>
              <div className="pt-2 border-t border-brand-paper/15 text-[11px] text-brand-paper/60">
                Official Bookstore Platform
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-brand-paper/15 pt-6 text-center text-xs text-brand-paper/60">
          <p>© {new Date().getFullYear()} Little Lambs. All rights reserved. Published by Pavanatma Publishers Pvt. Ltd.</p>
        </div>
      </div>
    </footer>
  );
}
