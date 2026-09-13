import { z } from 'zod';

export const adminInventoryAdjustmentSchema = z.object({
  bookId: z.string().uuid('Invalid book ID'),
  type: z.enum(['INITIAL', 'RESTOCK', 'CORRECTION', 'ORDER_CONFIRMED', 'RETURN', 'OTHER']),
  quantityDelta: z.number().int().refine((val) => val !== 0, {
    message: 'Quantity delta must be non-zero (positive for restock/returns, negative for reductions)',
  }),
  reason: z.string().trim().min(5, 'Reason for stock adjustment must be at least 5 characters'),
});

export type AdminInventoryAdjustmentInput = z.infer<typeof adminInventoryAdjustmentSchema>;
