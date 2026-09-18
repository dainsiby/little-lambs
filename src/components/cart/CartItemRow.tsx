"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { CartItemView } from "@/lib/cart/cartService";

interface CartItemRowProps {
  item: CartItemView;
  onCartChange: () => void;
}

export function CartItemRow({ item, onCartChange }: CartItemRowProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [updating, setUpdating] = useState(false);

  const handleQuantityUpdate = async (newQty: number) => {
    if (updating) return;
    setUpdating(true);

    try {
      if (newQty <= 0) {
        const res = await fetch(`/api/cart/items/${item.id}`, { method: "DELETE" });
        if (res.ok) {
          onCartChange();
        }
      } else {
        const res = await fetch(`/api/cart/items/${item.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: newQty }),
        });
        if (res.ok) {
          setQuantity(newQty);
          onCartChange();
        }
      }
    } catch {
      // Revert quantity on error
      setQuantity(item.quantity);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (updating) return;
    setUpdating(true);

    try {
      const res = await fetch(`/api/cart/items/${item.id}`, { method: "DELETE" });
      if (res.ok) {
        onCartChange();
      }
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="cart-item-row flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 gap-4 mb-3">
      <div className="flex items-center gap-4">
        <div className="cart-item-media flex-shrink-0 w-20 h-24 relative bg-slate-100 rounded-xl overflow-hidden p-2">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-contain"
          />
        </div>
        <div>
          <h3 className="font-bold text-brand-navy text-base mb-1">
            <Link href={`/books/${item.slug}`} className="hover:text-brand-maroon transition-colors">
              {item.title}
            </Link>
          </h3>
          <p className="text-xs text-slate-500 font-medium">Unit Price: ₹{item.unitPriceDisplay}</p>
          <span className="text-xs text-emerald-700 font-semibold">{item.availableStock} in stock</span>
        </div>
      </div>

      <div className="flex items-center justify-between w-full sm:w-auto gap-6 mt-2 sm:mt-0">
        <div className="inline-flex items-center border border-slate-300 rounded-full bg-slate-50 overflow-hidden">
          <button
            type="button"
            onClick={() => handleQuantityUpdate(quantity - 1)}
            disabled={updating || quantity <= 1}
            className="px-3 py-1 text-sm font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            &minus;
          </button>
          <span className="px-3 py-1 text-xs font-extrabold text-slate-800 min-w-[28px] text-center">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => handleQuantityUpdate(quantity + 1)}
            disabled={updating || quantity >= item.availableStock}
            className="px-3 py-1 text-sm font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-40"
            aria-label="Increase quantity"
          >
            &#43;
          </button>
        </div>

        <div className="text-right">
          <span className="font-extrabold text-brand-maroon text-base block">₹{item.unitPriceDisplay * quantity}</span>
        </div>

        <button
          type="button"
          onClick={handleRemove}
          disabled={updating}
          className="text-slate-400 hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-red-50"
          aria-label={`Remove ${item.title} from cart`}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
