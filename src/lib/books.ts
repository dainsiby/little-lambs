import { prisma } from '@/lib/db/prisma';
import type { BookItem } from '@/types';

/**
 * Maps raw Prisma Book entity to clean BookItem ViewModel
 */
function mapBookToItem(book: {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  sku: string;
  isbn: string;
  description: string;
  shortDescription: string | null;
  ageMin: number;
  ageMax: number;
  language: string;
  publisher: string;
  edition: string | null;
  releaseDate: Date | null;
  price: { toString(): string } | number | string;
  stock: number;
  reservedStock: number;
  status: string;
  featured: boolean;
}): BookItem {
  return {
    ...book,
    price: Number(book.price),
    status: book.status as BookItem['status'],
    coverImage: '/books/little-lambs-activity-book/cover-front.jpg',
  };
}

/**
 * Fetches all active books for the storefront catalogue
 */
export async function getAllActiveBooks(): Promise<BookItem[]> {
  try {
    const books = await prisma.book.findMany({
      where: {
        status: 'ACTIVE',
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    return books.map(mapBookToItem);
  } catch (error) {
    console.error('Error fetching active books:', error);
    return [];
  }
}

/**
 * Fetches the featured book for homepage spotlight
 */
export async function getFeaturedBook(): Promise<BookItem | null> {
  try {
    const book = await prisma.book.findFirst({
      where: {
        featured: true,
        status: 'ACTIVE',
      },
    });
    return book ? mapBookToItem(book) : null;
  } catch (error) {
    console.error('Error fetching featured book:', error);
    return null;
  }
}

/**
 * Fetches a single book by slug
 */
export async function getBookBySlug(slug: string): Promise<BookItem | null> {
  try {
    const book = await prisma.book.findUnique({
      where: {
        slug,
      },
    });
    return book ? mapBookToItem(book) : null;
  } catch (error) {
    console.error('Error fetching book by slug:', error);
    return null;
  }
}

/**
 * Stock helper checking if physical inventory is available for immediate dispatch
 */
export function isBookInStock(stock: number): boolean {
  return stock > 0;
}
