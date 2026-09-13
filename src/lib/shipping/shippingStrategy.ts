// Server-side configurable shipping strategy constants (paise)
export const SHIPPING_CONFIG = {
  FLAT_RATE_PAISE: Number(process.env.SHIPPING_FLAT_RATE_PAISE) || 4000, // ₹40
  FREE_SHIPPING_THRESHOLD_PAISE: Number(process.env.FREE_SHIPPING_THRESHOLD_PAISE) || 30000, // ₹300
};

export function calculateShippingPaise(subtotalPaise: number): number {
  if (subtotalPaise <= 0) {
    return 0;
  }
  if (subtotalPaise >= SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD_PAISE) {
    return 0;
  }
  return SHIPPING_CONFIG.FLAT_RATE_PAISE;
}
