import { z } from 'zod';
import { BookStatus, ImageType } from '@prisma/client';

const bookBaseSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  subtitle: z.string().nullable().optional(),
  slug: z.string().min(2, 'Slug is required'),
  sku: z.string().min(2, 'SKU is required'),
  isbn: z.string().min(10, 'Valid ISBN is required'),
  description: z.string().min(10, 'Description is required'),
  shortDescription: z.string().nullable().optional(),
  ageMin: z.number().int().min(0).max(18),
  ageMax: z.number().int().min(0).max(18),
  language: z.string().min(2),
  publisher: z.string().min(2),
  edition: z.string().nullable().optional(),
  price: z
    .union([z.number(), z.string()])
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'Price must be a non-negative number',
    }),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  status: z.nativeEnum(BookStatus).default(BookStatus.DRAFT),
  featured: z.boolean().default(false),
});

export const bookCreateSchema = bookBaseSchema.refine(
  (data) => data.ageMin <= data.ageMax,
  {
    message: 'ageMin cannot be greater than ageMax',
    path: ['ageMin'],
  }
);

export const bookUpdateSchema = bookBaseSchema.partial();

export const bookImageUploadSchema = z.object({
  bookId: z.string().uuid(),
  type: z.nativeEnum(ImageType).default(ImageType.COVER_FRONT),
  altText: z.string().min(2, 'Alt text is required'),
  sortOrder: z.number().int().min(0).default(0),
});
