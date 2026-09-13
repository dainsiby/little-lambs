import { z } from 'zod';

export const addressSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters.'),
  phone: z
    .string()
    .trim()
    .min(10, 'Phone number must be at least 10 digits.')
    .max(15, 'Phone number must be at most 15 digits.')
    .regex(/^[0-9+\s-]+$/, 'Invalid phone number format.'),
  addressLine1: z.string().trim().min(5, 'Address line 1 must be at least 5 characters.'),
  addressLine2: z.string().trim().optional().or(z.literal('')),
  city: z.string().trim().min(2, 'City is required.'),
  district: z.string().trim().optional().or(z.literal('')),
  state: z.string().trim().min(2, 'State is required.'),
  postalCode: z
    .string()
    .trim()
    .min(3, 'Postal code must be at least 3 characters.')
    .max(10, 'Postal code is too long.'),
  landmark: z.string().trim().optional().or(z.literal('')),
  country: z.string().trim().default('India'),
  isDefault: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;
