"use client";

import React, { useState } from "react";
import { Plus, Check, MapPin } from "lucide-react";

export interface AddressItem {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  district?: string | null;
  state: string;
  postalCode: string;
  landmark?: string | null;
  isDefault: boolean;
}

interface AddressSelectorProps {
  addresses: AddressItem[];
  selectedAddressId: string;
  onSelectAddress: (id: string) => void;
  onAddressAdded: () => void;
}

export function AddressSelector({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddressAdded,
}: AddressSelectorProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isFormVisible = showAddForm || addresses.length === 0;

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    district: "",
    state: "Kerala",
    postalCode: "",
    landmark: "",
    isDefault: true,
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save address.");
      } else {
        const newId = data.address?.id || data.id;
        if (newId) {
          onSelectAddress(newId);
        }
        await onAddressAdded();
        setShowAddForm(false);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="address-selector-wrapper space-y-4">
      {!isFormVisible && (
        <div className="space-y-3">
          {addresses.map((addr) => {
            const isSelected = addr.id === selectedAddressId;
            return (
              <div
                key={addr.id}
                onClick={() => onSelectAddress(addr.id)}
                className={`address-card cursor-pointer p-4 rounded-2xl border transition-all flex items-start justify-between ${
                  isSelected
                    ? "border-brand-maroon bg-amber-50/50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 grid place-items-center w-5 h-5 rounded-full border ${
                      isSelected ? "border-brand-maroon bg-brand-maroon text-white" : "border-slate-300"
                    }`}
                  >
                    {isSelected && <Check size={12} />}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-sm text-brand-navy">{addr.fullName}</strong>
                      <span className="text-xs text-slate-500">({addr.phone})</span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {addr.addressLine1}
                      {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                      <br />
                      {addr.city}, {addr.state} &ndash; {addr.postalCode}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="secondary-cta text-xs py-2 px-4 font-bold flex items-center gap-2"
          >
            <Plus size={16} /> Add New Delivery Address
          </button>
        </div>
      )}

      {isFormVisible && (
        <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="font-bold text-sm text-brand-navy flex items-center gap-2">
              <MapPin size={16} className="text-brand-maroon" /> New Delivery Address
            </h4>
            {addresses.length > 0 && (
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-xs text-slate-500 hover:underline"
              >
                Cancel
              </button>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="address-fullname" className="text-xs font-semibold text-slate-600 block mb-1">
                Recipient Full Name *
              </label>
              <input
                id="address-fullname"
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-maroon/20"
                placeholder="e.g. Mary Joseph"
              />
            </div>

            <div>
              <label htmlFor="address-phone" className="text-xs font-semibold text-slate-600 block mb-1">
                10-Digit Mobile Phone *
              </label>
              <input
                id="address-phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-maroon/20"
                placeholder="e.g. 9876543210"
              />
            </div>
          </div>

          <div>
            <label htmlFor="address-line1" className="text-xs font-semibold text-slate-600 block mb-1">
              Flat / House / Street Address Line 1 *
            </label>
            <input
              id="address-line1"
              type="text"
              required
              value={formData.addressLine1}
              onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-maroon/20"
              placeholder="e.g. 123 St Thomas Church Road"
            />
          </div>

          <div>
            <label htmlFor="address-line2" className="text-xs font-semibold text-slate-600 block mb-1">
              Address Line 2 (Optional)
            </label>
            <input
              id="address-line2"
              type="text"
              value={formData.addressLine2}
              onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-maroon/20"
              placeholder="e.g. Near Parish Hall"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="address-city" className="text-xs font-semibold text-slate-600 block mb-1">
                City / Town *
              </label>
              <input
                id="address-city"
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-maroon/20"
                placeholder="e.g. Elanji"
              />
            </div>

            <div>
              <label htmlFor="address-state" className="text-xs font-semibold text-slate-600 block mb-1">
                State *
              </label>
              <input
                id="address-state"
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-maroon/20"
                placeholder="Kerala"
              />
            </div>

            <div>
              <label htmlFor="address-pincode" className="text-xs font-semibold text-slate-600 block mb-1">
                Pincode *
              </label>
              <input
                id="address-pincode"
                type="text"
                required
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-maroon/20"
                placeholder="686665"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleAddSubmit}
              disabled={submitting}
              className="primary-cta text-xs py-2 px-4 font-bold"
            >
              {submitting ? "Saving..." : "Save Address"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
