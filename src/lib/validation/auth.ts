import { z } from 'zod';

export const authLoginSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  })
  .strict();

export const authRegisterSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    phone: z.string().optional(),
    // Reject explicit role payload overrides
    role: z
      .enum(['CUSTOMER', 'ADMIN'])
      .optional()
      .refine((val) => val === undefined || val === 'CUSTOMER', {
        message: 'Admin privilege cannot be assigned via public registration',
      }),
  })
  .strict();

export const forgotPasswordSchema = z
  .object({
    email: z.string().email('Invalid email address'),
  })
  .strict();

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
  })
  .strict();
