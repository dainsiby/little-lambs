export type BookStatus = 'DRAFT' | 'COMING_SOON' | 'ACTIVE' | 'OUT_OF_STOCK' | 'ARCHIVED';

export type ImageType = 'COVER_FRONT' | 'COVER_BACK' | 'PREVIEW' | 'PROMOTIONAL';

export interface BookImage {
  id: string;
  url: string;
  altText: string;
  type: ImageType;
  sortOrder?: number;
}

export interface BookProduct {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  sku: string;
  isbn: string;
  shortDescription: string;
  description: string;
  price: number;
  currency: string;
  ageMin: number;
  ageMax: number;
  language: string;
  publisher: string;
  creator: string;
  edition?: string;
  status: BookStatus;
  featured: boolean;
  stock?: number;
  images: BookImage[];
  highlights: string[];
  activities: string[];
}

export const BOOKS_CATALOG: BookProduct[] = [
  {
    id: "ll-book-01",
    slug: "little-lambs-christian-activity-book",
    title: "Little Lambs",
    subtitle: "English Christian Activity Book",
    sku: "LL-ACT-001",
    isbn: "978-93-88909-19-8",
    shortDescription: "A delightful Christian activity book filled with prayers, Bible stories, coloring, puzzles, games, and faith-building fun for growing hearts & minds.",
    description: "Little Lambs is a thoughtfully crafted Christian activity book designed for children aged 4 to 10. Created by SMYM Elanji Unit and published by Atma Books, this engaging volume introduces young readers to core Christian values, daily prayers, and inspiring Bible lessons through interactive storytelling, creative coloring pages, word puzzles, and playful activities.",
    price: 100,
    currency: "₹",
    ageMin: 4,
    ageMax: 10,
    language: "English",
    publisher: "Atma Books",
    creator: "SMYM Elanji Unit",
    edition: "First Edition",
    status: "ACTIVE",
    featured: true,
    stock: 50,
    images: [
      {
        id: "img-01",
        url: "/books/cover-front.png",
        altText: "Little Lambs English Christian Activity Book Official Cover Artwork",
        type: "COVER_FRONT",
        sortOrder: 1,
      },
      {
        id: "img-02",
        url: "/images/reading-scene.webp",
        altText: "Children reading Little Lambs activity book illustration scene",
        type: "PREVIEW",
        sortOrder: 2,
      }
    ],
    highlights: [
      "Guided Christian Daily Prayers",
      "Engaging Bible Story Summaries",
      "Creative Coloring & Drawing Pages",
      "Interactive Puzzles, Games & Mazes",
      "Faith-centered Learning Activities"
    ],
    activities: [
      "Prayers & Verse Reflection",
      "Bible Stories & Q&A",
      "Coloring & Artwork",
      "Puzzles & Word Searches",
      "Games & Memory Verses"
    ]
  }
];

export function getAllBooks(): BookProduct[] {
  return BOOKS_CATALOG;
}

export function getBookBySlug(slug: string): BookProduct | undefined {
  return BOOKS_CATALOG.find((b) => b.slug === slug);
}
