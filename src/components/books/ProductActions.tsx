"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingBag, Zap, Check, AlertCircle } from "lucide-react";

interface ProductActionsProps {
  bookId: string;
  slug: string;
  priceDisplay: number;
  availableStock: number;
}

export function ProductActions({
  bookId,
  slug,
  priceDisplay,
  availableStock,
}: ProductActionsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isOutOfStock = availableStock <= 0;

  const handleAddToCart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOutOfStock || adding) return;

    setAdding(true);
    setErrorMsg("");
    setAddedSuccess(false);

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, quantity }),
      });

      if (res.status === 401) {
        // Redirect guest user to login with callback URL to return to this book page
        router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to add item to cart.");
      } else {
        setAddedSuccess(true);
        window.dispatchEvent(new Event("cart-updated"));
        setTimeout(() => setAddedSuccess(false), 4000);
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (isOutOfStock || buyingNow) return;

    setBuyingNow(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, quantity }),
      });

      if (res.status === 401) {
        // Redirect guest user to login with callback URL to checkout
        router.push(`/login?callbackUrl=${encodeURIComponent("/checkout")}`);
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to proceed to checkout.");
        setBuyingNow(false);
      } else {
        window.dispatchEvent(new Event("cart-updated"));
        router.push("/checkout");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setBuyingNow(false);
    }
  };

  return (
    <div className="product-actions-wrapper space-y-4">
      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200 flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {addedSuccess && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Check size={16} /> Added {quantity} {quantity === 1 ? "copy" : "copies"} to your bag!
          </span>
          <button
            type="button"
            onClick={() => router.push("/cart")}
            className="underline font-bold text-emerald-900"
          >
            View Bag &rarr;
          </button>
        </div>
      )}

      {isOutOfStock ? (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 font-semibold text-sm">
          Currently Out of Stock &mdash; Check back soon as new inventory is allocated.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label htmlFor="product-qty-input" className="text-xs font-bold text-brand-slate uppercase">
              Quantity:
            </label>
            <div className="inline-flex items-center border border-slate-300 rounded-full bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="px-3 py-1.5 text-sm font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
                aria-label="Decrease quantity"
              >
                &minus;
              </button>
              <span id="product-qty-input" className="px-3 py-1.5 text-sm font-extrabold min-w-[36px] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(availableStock, q + 1))}
                disabled={quantity >= availableStock}
                className="px-3 py-1.5 text-sm font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
                aria-label="Increase quantity"
              >
                &#43;
              </button>
            </div>
            <span className="text-xs text-slate-500 font-medium">({availableStock} available)</span>
          </div>

          <div className="detail-actions">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={adding || buyingNow}
              className="primary-cta font-bold"
            >
              <ShoppingBag size={18} />
              {adding ? "Adding to bag..." : "Add to Cart"}
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={adding || buyingNow}
              className="secondary-cta font-bold"
            >
              <Zap size={18} />
              {buyingNow ? "Proceeding..." : `Buy Now (₹${priceDisplay * quantity})`}
            </button>
          </div>
        </div>
      )}

      {/* Mobile Sticky Action Bar */}
      {!isOutOfStock && (
        <div className="mobile-sticky-action-bar md:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 z-50 flex items-center justify-between gap-3 shadow-lg">
          <div>
            <span className="text-xs text-slate-500 font-medium block">Total Price</span>
            <span className="text-lg font-extrabold text-brand-maroon">₹{priceDisplay * quantity}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={adding || buyingNow}
              className="primary-cta py-2.5 px-4 text-xs font-bold"
            >
              Add to Cart
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={adding || buyingNow}
              className="secondary-cta py-2.5 px-4 text-xs font-bold"
            >
              Buy Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
