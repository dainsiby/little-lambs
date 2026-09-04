import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { BookItem } from '@/types';
import StockBadge from './StockBadge';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

interface BookCardProps {
  book: BookItem;
  className?: string;
}

export default function BookCard({ book, className = '' }: BookCardProps) {
  const formattedPrice = typeof book.price === 'number' ? `₹${book.price.toFixed(2)}` : `₹${book.price}`;

  return (
    <article
      className={`group flex flex-col justify-between overflow-hidden rounded-2xl border border-brand-maroon/15 bg-brand-paper p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-maroon/30 hover:shadow-lg ${className}`}
    >
      <div>
        {/* Book Cover Image Container */}
        <Link
          href={`/books/${book.slug}`}
          className="focus-ring block relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-brand-cream/60"
          tabIndex={0}
          aria-label={`View details for ${book.title}`}
        >
          {book.coverImage ? (
            <Image
              src={book.coverImage}
              alt={`Cover of ${book.title}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-brand-maroon/40 font-heading text-xl">
              No Cover
            </div>
          )}
        </Link>

        {/* Badges */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <Badge variant="accent">Ages {book.ageMin}–{book.ageMax}</Badge>
          <StockBadge stock={book.stock} />
        </div>

        {/* Book Info */}
        <div className="mt-3">
          <h3 className="font-heading text-xl font-bold tracking-tight text-brand-maroon group-hover:text-brand-maroon-dark">
            <Link href={`/books/${book.slug}`} className="focus-ring rounded">
              {book.title}
            </Link>
          </h3>
          {book.subtitle && (
            <p className="mt-1 text-xs text-brand-slate line-clamp-2">
              {book.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Footer / Price & Details Action */}
      <div className="mt-6 flex items-center justify-between border-t border-brand-maroon/10 pt-4">
        <div>
          <span className="text-xs text-brand-slate uppercase font-semibold">Price</span>
          <p className="font-heading text-2xl font-bold text-brand-maroon">
            {formattedPrice}
          </p>
        </div>
        <Button href={`/books/${book.slug}`} variant="outline" size="sm">
          View Details
        </Button>
      </div>
    </article>
  );
}
