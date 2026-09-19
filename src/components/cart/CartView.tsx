"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { CartSummaryView } from "@/lib/cart/cartService";
import { CartItemRow } from "./CartItemRow";

interface CartViewProps {
  initialCart: CartSummaryView;
}

export function CartView({ initialCart }: CartViewProps) {
  const router = useRouter();
  const [cart, setCart] = useState<CartSummaryView>(initialCart);
  const [loading, setLoading] = useState(false);

  const refreshCart = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setCart(data);
        window.dispatchEvent(new Event("cart-updated"));
      }
    } catch {
      // Keep existing state
    } finally {
      setLoading(false);
    }
  };

  const isEmpty = cart.items.length === 0;

  if (isEmpty) {
    return (
      <div className="empty-cart-card">
        <div className="empty-cart-icon text-brand-maroon flex justify-center mb-4">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your bag is waiting for a little adventure</h2>
        <p className="text-slate-600 mb-6 max-w-md mx-auto">
          Browse our Christian activity books for children ages 4 to 10 and add them to your cart.
        </p>
        <div className="empty-cart-actions flex justify-center">
          <Link href="/books" className="primary-cta font-bold">
            Browse Books <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-grid grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Cart Items List */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h2 className="text-xl font-extrabold text-brand-navy">
            Your Shopping Bag ({cart.totalQuantity} {cart.totalQuantity === 1 ? "item" : "items"})
          </h2>
          <button
            type="button"
            onClick={async () => {
              if (confirm("Are you sure you want to clear your shopping bag?")) {
                await fetch("/api/cart", { method: "DELETE" });
                refreshCart();
              }
            }}
            className="text-xs text-red-600 hover:underline font-semibold"
          >
            Clear Bag
          </button>
        </div>

        <div className="cart-items-wrapper">
          {cart.items.map((item) => (
            <CartItemRow key={item.id} item={item} onCartChange={refreshCart} />
          ))}
        </div>

        <div className="flex justify-between items-center pt-4">
          <Link href="/books" className="secondary-cta text-xs font-bold">
            &larr; Continue Shopping
          </Link>
        </div>
      </div>

      {/* Order Summary Sidebar */}
      <div className="checkout-summary-column">
        <div className="checkout-summary-card p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
          <h3 className="text-lg font-bold text-brand-navy border-b border-slate-100 pb-3">Order Summary</h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal ({cart.totalQuantity} items)</span>
              <span className="font-semibold text-slate-900">₹{cart.subtotalDisplay}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Estimated Shipping</span>
              <span className="text-xs font-medium text-slate-500">Calculated at checkout</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-lg font-extrabold text-brand-maroon">
            <span>Bag Total</span>
            <span>₹{cart.subtotalDisplay}</span>
          </div>

          <button
            type="button"
            onClick={() => router.push("/checkout")}
            disabled={loading}
            className="primary-cta w-full py-3 font-bold text-center justify-center"
          >
            Proceed to Checkout <ArrowRight size={18} />
          </button>

          <div className="space-y-2 pt-2 text-xs text-slate-500 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-700 flex-shrink-0" />
              <span>Server-verified stock &amp; checkout total</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-brand-maroon flex-shrink-0" />
              <span>Flat delivery rate calculated dynamically</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
