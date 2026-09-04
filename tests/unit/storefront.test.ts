import { describe, it, expect } from 'vitest';
import { isBookInStock } from '../../src/lib/books';

describe('Storefront Phase 2 Logic Verification', () => {
  it('correctly identifies stock = 0 as out of stock', () => {
    expect(isBookInStock(0)).toBe(false);
  });

  it('correctly identifies stock > 0 as in stock', () => {
    expect(isBookInStock(5)).toBe(true);
    expect(isBookInStock(100)).toBe(true);
  });
});
