"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, ArrowRight, AlertCircle, ShieldCheck, CheckCircle2 } from "lucide-react";
import { AddressSelector, AddressItem } from "./AddressSelector";
import { CartSummaryView } from "@/lib/cart/cartService";

interface CheckoutFormProps {
  cart: CartSummaryView;
  initialAddresses: AddressItem[];
  shippingPaise: number;
  subtotalPaise: number;
  totalPaise: number;
}

export function CheckoutForm({
  cart,
  initialAddresses,
  shippingPaise,
  subtotalPaise,
  totalPaise,
}: CheckoutFormProps) {
  const router = useRouter();
  const [addresses, setAddresses] = useState<AddressItem[]>(initialAddresses);

  const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
  const [selectedAddressId, setSelectedAddressId] = useState<string>(defaultAddr?.id || "");
  const [customerNotes, setCustomerNotes] = useState("");
  const [placing, setPlacing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const refreshAddresses = async () => {
    try {
      const res = await fetch("/api/addresses");
      if (res.ok) {
        const data = await res.json();
        const list: AddressItem[] = Array.isArray(data) ? data : (data.addresses || []);
        setAddresses(list);
        if (list.length > 0) {
          const def = list.find((a: AddressItem) => a.isDefault) || list[0];
          setSelectedAddressId((prev) => prev || def.id);
        }
      }
    } catch {
      // Keep existing addresses
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddressId) {
      setErrorMsg("Please select or add a delivery address.");
      return;
    }

    setPlacing(true);
    setErrorMsg("");

    try {
      const idempotencyKey = `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: selectedAddressId,
          customerNotes,
          idempotencyKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to place order. Please try again.");
        setPlacing(false);
      } else {
        window.dispatchEvent(new Event("cart-updated"));
        router.push(`/account/orders/${data.orderNumber}`);
      }
    } catch {
      setErrorMsg("Network error during order submission. Please try again.");
      setPlacing(false);
    }
  };

  const subtotalDisplay = (subtotalPaise / 100).toFixed(2);
  const shippingDisplay = shippingPaise === 0 ? "FREE" : `₹${(shippingPaise / 100).toFixed(2)}`;
  const totalDisplay = (totalPaise / 100).toFixed(2);

  return (
    <form onSubmit={handlePlaceOrder} className="checkout-form-grid grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Left Steps Column */}
      <div className="lg:col-span-2 space-y-6">
        {errorMsg && (
          <div className="p-4 bg-red-50 text-red-700 text-sm font-semibold rounded-2xl border border-red-200 flex items-center gap-3">
            <AlertCircle size={20} className="flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Step 1: Delivery Address */}
        <div className="checkout-step-card p-6 bg-white rounded-2xl border border-slate-200">
          <div className="step-header flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="step-number font-bold text-sm bg-brand-maroon text-white w-7 h-7 rounded-full grid place-items-center">
                1
              </span>
              <h3 className="text-base font-bold text-brand-navy">Delivery Address</h3>
            </div>
          </div>

          <AddressSelector
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            onSelectAddress={(id) => setSelectedAddressId(id)}
            onAddressAdded={refreshAddresses}
          />
        </div>

        {/* Step 2: Order Items Review */}
        <div className="checkout-step-card p-6 bg-white rounded-2xl border border-slate-200">
          <div className="step-header flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
            <span className="step-number font-bold text-sm bg-brand-maroon text-white w-7 h-7 rounded-full grid place-items-center">
              2
            </span>
            <h3 className="text-base font-bold text-brand-navy">Review Items in Order</h3>
          </div>

          <div className="space-y-3">
            {cart.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-14 relative bg-white rounded-lg p-1 border border-slate-200 flex-shrink-0">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-contain" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-brand-navy">{item.title}</h4>
                    <p className="text-[11px] text-slate-500">Qty: {item.quantity} &times; ₹{item.unitPriceDisplay}</p>
                  </div>
                </div>
                <span className="font-bold text-xs text-brand-maroon">₹{item.unitPriceDisplay * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <label htmlFor="customer-notes" className="text-xs font-semibold text-slate-600 block mb-1">
              Order Notes / Delivery Instructions (Optional)
            </label>
            <input
              id="customer-notes"
              type="text"
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-maroon/20"
              placeholder="e.g. Please leave with neighbor or call upon delivery"
            />
          </div>
        </div>

        {/* Step 3: Payment Method Explanation */}
        <div className="checkout-step-card p-6 bg-white rounded-2xl border border-slate-200">
          <div className="step-header flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
            <span className="step-number font-bold text-sm bg-brand-maroon text-white w-7 h-7 rounded-full grid place-items-center">
              3
            </span>
            <h3 className="text-base font-bold text-brand-navy">Payment Method (Manual UPI)</h3>
          </div>
          <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <p className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-700 flex-shrink-0 mt-0.5" />
              <span>After clicking <strong>Place Order</strong>, your order will be created and your stock reserved.</span>
            </p>
            <p className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-700 flex-shrink-0 mt-0.5" />
              <span>You will be redirected to the secure order page to complete your payment using GPay, PhonePe, Paytm, or BHIM.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Sticky Order Summary */}
      <div className="checkout-summary-column">
        <div className="checkout-summary-card p-6 bg-white rounded-2xl border border-slate-200 space-y-4 lg:sticky lg:top-24">
          <h3 className="text-lg font-bold text-brand-navy border-b border-slate-100 pb-3">Order Summary</h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Items Subtotal ({cart.totalQuantity})</span>
              <span className="font-semibold text-slate-900">₹{subtotalDisplay}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping Fee</span>
              <span className="font-semibold text-slate-900">{shippingDisplay}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-lg font-extrabold text-brand-maroon">
            <span>Total Amount</span>
            <span>₹{totalDisplay}</span>
          </div>

          <button
            type="submit"
            disabled={placing || !selectedAddressId}
            className="primary-cta w-full py-3.5 font-bold text-center justify-center disabled:opacity-50"
          >
            <Lock size={16} />
            {placing ? "Reserving Stock & Placing Order..." : `Place Order (₹${totalDisplay})`}
          </button>

          <p className="text-[11px] text-slate-500 text-center">
            By placing this order, your items will be locked in reservation for 24 hours pending UPI payment verification.
          </p>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1.5">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-700 flex-shrink-0" />
              <span>Server-verified stock &amp; pricing</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock size={14} className="text-brand-maroon flex-shrink-0" />
              <span>Manual UPI verification before dispatch</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
