"use client";

import Image from "next/image";
import Link from "next/link";
import { BookProduct } from "@/lib/data/books";
import { ArrowRight } from "@/components/ui/Icons";

interface BookCardProps {
  book: BookProduct;
}

export function BookCard({ book }: BookCardProps) {
  const primaryImage = book.images[0]?.url || "/books/cover-front.png";
  const isAvailable = (book.stock ?? 0) > 0;

  return (
    <article className="book-card product-card-featured">
      <Link
        href={`/books/${book.slug}`}
        className="book-card-image-wrap"
        aria-label={`View details for ${book.title}`}
      >
        <Image
          src={primaryImage}
          alt={`${book.title} cover`}
          width={360}
          height={480}
          className="book-card-image"
          priority
        />
        <span
          className={`book-card-badge ${
            isAvailable ? "badge-in-stock" : "badge-out-of-stock"
          }`}
        >
          {isAvailable ? "IN STOCK" : "OUT OF STOCK"}
        </span>
      </Link>

      <div className="book-card-body">
        <div className="book-card-meta">
          <span className="age-pill">Ages {book.ageMin}–{book.ageMax}</span>
          <span className="price-tag">{book.currency}{book.price}</span>
        </div>

        <h2 className="book-card-title">
          <Link href={`/books/${book.slug}`}>
            {book.title}
          </Link>
        </h2>
        {book.subtitle && <p className="book-card-subtitle">{book.subtitle}</p>}
        <p className="book-card-desc">{book.shortDescription}</p>

        <div className="book-card-actions">
          <Link href={`/books/${book.slug}`} className="primary-cta view-book-btn">
            View Book <ArrowRight />
          </Link>

          {!isAvailable && (
            <span className="out-of-stock-notice">
              Currently Out of Stock
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
