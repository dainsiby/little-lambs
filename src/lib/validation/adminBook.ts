import { z } from 'zod';

export const adminBookSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters'),
  subtitle: z.string().trim().optional().or(z.literal('')),
  slug: z
    .string()
    .trim()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  sku: z.string().trim().min(2, 'SKU must be at least 2 characters'),
  isbn: z.string().trim().min(10, 'ISBN must be at least 10 characters'),
  shortDescription: z.string().trim().optional().or(z.literal('')),
  description: z.string().trim().min(10, 'Description must be at least 10 characters'),
  pricePaise: z.number().int().min(1, 'Price must be greater than 0'),
  ageMin: z.number().int().min(0, 'Minimum age must be non-negative'),
  ageMax: z.number().int().min(0, 'Maximum age must be non-negative'),
  language: z.string().trim().min(2, 'Language is required'),
  publisher: z.string().trim().min(2, 'Publisher is required'),
  edition: z.string().trim().optional().or(z.literal('')),
  status: z.enum(['DRAFT', 'COMING_SOON', 'ACTIVE', 'OUT_OF_STOCK', 'ARCHIVED']),
  featured: z.boolean().default(false),
  releaseDate: z.string().optional().or(z.literal('')),
});

export type AdminBookInput = z.infer<typeof adminBookSchema>;
