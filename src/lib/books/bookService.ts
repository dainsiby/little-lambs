import { prisma } from '@/lib/db/prisma';
import { BOOKS_CATALOG, BookProduct } from '@/lib/data/books';

export async function getActiveBooksFromDb(): Promise<BookProduct[]> {
  try {
    const books = await prisma.book.findMany({
      where: {
        status: 'ACTIVE',
      },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (books.length === 0) {
      if (process.env.NODE_ENV !== 'production') {
        return BOOKS_CATALOG;
      }
      return [];
    }

    return books.map((b) => ({
      id: b.id,
      slug: b.slug,
      title: b.title,
      subtitle: b.subtitle || undefined,
      sku: b.sku,
      isbn: b.isbn,
      shortDescription: b.shortDescription || '',
      description: b.description,
      price: b.pricePaise / 100, // Display price in rupees
      currency: '₹',
      ageMin: b.ageMin,
      ageMax: b.ageMax,
      language: b.language,
      publisher: b.publisher,
      creator: 'SMYM Elanji Unit',
      edition: b.edition || undefined,
      status: b.status,
      featured: b.featured,
      stock: b.stock - b.reservedStock,
      images: b.images.map((img) => ({
        id: img.id,
        url: img.imageUrl,
        altText: img.altText,
        type: img.type,
        sortOrder: img.sortOrder,
      })),
      highlights: [
        'Guided Christian Daily Prayers',
        'Engaging Bible Story Summaries',
        'Creative Coloring & Drawing Pages',
        'Interactive Puzzles, Games & Mazes',
        'Faith-centered Learning Activities',
      ],
      activities: [
        'Prayers & Verse Reflection',
        'Bible Stories & Q&A',
        'Coloring & Artwork',
        'Puzzles & Word Searches',
        'Games & Memory Verses',
      ],
    }));
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[BookService] Database query failed in production:', error);
      throw new Error('Failed to load catalogue from database.');
    }
    // Controlled development fallback
    return BOOKS_CATALOG;
  }
}

export async function getBookBySlugFromDb(slug: string): Promise<BookProduct | undefined> {
  try {
    const book = await prisma.book.findFirst({
      where: { slug },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!book) {
      if (process.env.NODE_ENV !== 'production') {
        return BOOKS_CATALOG.find((b) => b.slug === slug);
      }
      return undefined;
    }

    return {
      id: book.id,
      slug: book.slug,
      title: book.title,
      subtitle: book.subtitle || undefined,
      sku: book.sku,
      isbn: book.isbn,
      shortDescription: book.shortDescription || '',
      description: book.description,
      price: book.pricePaise / 100,
      currency: '₹',
      ageMin: book.ageMin,
      ageMax: book.ageMax,
      language: book.language,
      publisher: book.publisher,
      creator: 'SMYM Elanji Unit',
      edition: book.edition || undefined,
      status: book.status,
      featured: book.featured,
      stock: book.stock - book.reservedStock,
      images: book.images.map((img) => ({
        id: img.id,
        url: img.imageUrl,
        altText: img.altText,
        type: img.type,
        sortOrder: img.sortOrder,
      })),
      highlights: [
        'Guided Christian Daily Prayers',
        'Engaging Bible Story Summaries',
        'Creative Coloring & Drawing Pages',
        'Interactive Puzzles, Games & Mazes',
        'Faith-centered Learning Activities',
      ],
      activities: [
        'Prayers & Verse Reflection',
        'Bible Stories & Q&A',
        'Coloring & Artwork',
        'Puzzles & Word Searches',
        'Games & Memory Verses',
      ],
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[BookService] Database query failed in production:', error);
      throw new Error('Failed to load book from database.');
    }
    return BOOKS_CATALOG.find((b) => b.slug === slug);
  }
}
