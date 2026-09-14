import Image from "next/image";
import Link from "next/link";
import { BookProduct } from "@/lib/data/books";
import { ArrowRight } from "@/components/ui/Icons";

interface BookCardProps {
  book: BookProduct;
}

export function BookCard({ book }: BookCardProps) {
  const primaryImage = book.images[0]?.url || "/images/book-cover.webp";

  return (
    <article className="book-card">
      <div className="book-card-image-wrap">
        <Image
          src={primaryImage}
          alt={book.title + " cover"}
          width={360}
          height={480}
          className="book-card-image"
        />
        <span className="book-card-badge">{book.status === 'ACTIVE' ? 'Book 01' : book.status}</span>
      </div>
      <div className="book-card-body">
        <div className="book-card-meta">
          <span className="age-pill">Ages {book.ageMin}–{book.ageMax}</span>
          <span className="price-tag">{book.currency}{book.price}</span>
        </div>
        <h2 className="book-card-title">{book.title}</h2>
        {book.subtitle && <p className="book-card-subtitle">{book.subtitle}</p>}
        <p className="book-card-desc">{book.shortDescription}</p>
        <Link href={`/books/${book.slug}`} className="book-card-link">
          Explore Book Details <ArrowRight />
        </Link>
      </div>
    </article>
  );
}
