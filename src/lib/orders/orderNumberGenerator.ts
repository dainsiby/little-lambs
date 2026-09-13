import crypto from 'crypto';

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const randomDigits = crypto.randomInt(100000, 999999);
  return `LL-${year}-${randomDigits}`;
}
