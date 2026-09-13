import { z } from 'zod';

export const adminVerifyPaymentSchema = z.object({
  action: z.literal('VERIFY'),
  adminNote: z.string().trim().optional(),
});

export const adminRejectPaymentSchema = z.object({
  action: z.literal('REJECT'),
  rejectionReason: z.string().trim().min(5, 'Rejection reason is required (min 5 characters)'),
  adminNote: z.string().trim().optional(),
});

export const adminFulfilmentTransitionSchema = z.object({
  status: z.enum(['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  shippingCarrier: z.string().trim().optional(),
  trackingNumber: z.string().trim().optional(),
});

export type AdminVerifyPaymentInput = z.infer<typeof adminVerifyPaymentSchema>;
export type AdminRejectPaymentInput = z.infer<typeof adminRejectPaymentSchema>;
export type AdminFulfilmentTransitionInput = z.infer<typeof adminFulfilmentTransitionSchema>;
