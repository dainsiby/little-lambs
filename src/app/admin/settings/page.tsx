import React from 'react';
import { Settings, Shield, Truck, Mail, Phone, MapPin, DollarSign, Info } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto font-body text-brand-navy">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-maroon">
          Store & Delivery Settings
        </h1>
        <p className="text-xs sm:text-sm text-brand-slate">
          Operational configurations for Little Lambs Store. Configurable parameters are displayed safely without exposing environment credentials.
        </p>
      </div>

      {/* Store Identity */}
      <div className="rounded-3xl border border-brand-maroon/15 bg-brand-paper p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 border-b border-brand-maroon/10 pb-3">
          <Settings className="h-5 w-5 text-brand-maroon" />
          <h2 className="font-heading text-lg font-bold text-brand-maroon">Store Identity & Support Info</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl border border-brand-maroon/10 bg-brand-cream/40 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-brand-slate tracking-wider block">Store Name</span>
            <span className="font-heading font-bold text-sm text-brand-maroon block">Little Lambs Christian Store</span>
            <span className="text-[11px] text-brand-slate">Publisher: Pavanatma Publishers Pvt. Ltd.</span>
          </div>

          <div className="p-3.5 rounded-2xl border border-brand-maroon/10 bg-brand-cream/40 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-brand-slate tracking-wider block">Customer Support Email</span>
            <div className="flex items-center gap-1.5 font-bold text-sm text-brand-navy">
              <Mail className="h-4 w-4 text-brand-maroon shrink-0" />
              <span>contact@pavanatmapublishers.com</span>
            </div>
            <span className="text-[11px] text-brand-slate">Used for customer order confirmations</span>
          </div>

          <div className="p-3.5 rounded-2xl border border-brand-maroon/10 bg-brand-cream/40 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-brand-slate tracking-wider block">Support Phone / WhatsApp</span>
            <div className="flex items-center gap-1.5 font-bold text-sm text-brand-navy">
              <Phone className="h-4 w-4 text-brand-maroon shrink-0" />
              <span>+91 98765 43210</span>
            </div>
            <span className="text-[11px] text-brand-slate">Available Mon–Sat (9 AM – 6 PM)</span>
          </div>

          <div className="p-3.5 rounded-2xl border border-brand-maroon/10 bg-brand-cream/40 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-brand-slate tracking-wider block">UPI Payment Receiver</span>
            <span className="font-heading font-bold text-sm text-emerald-800 block font-mono">littlelambs@upi</span>
            <span className="text-[11px] text-brand-slate">Manual UPI QR & UTR Verification Receiver</span>
          </div>
        </div>
      </div>

      {/* Shipping & Delivery Operational Policy */}
      <div className="rounded-3xl border border-brand-maroon/15 bg-brand-paper p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 border-b border-brand-maroon/10 pb-3">
          <Truck className="h-5 w-5 text-brand-maroon" />
          <h2 className="font-heading text-lg font-bold text-brand-maroon">Shipping & Fulfilment Rules</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Local Delivery Rule */}
          <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-sm text-purple-950">Local Direct Delivery</span>
              <MapPin className="h-4 w-4 text-purple-700" />
            </div>
            <p className="text-[11px] text-purple-900 leading-relaxed">
              <strong>Radius Reference:</strong> Approximately ≤ 15 km from store location.
            </p>
            <div className="p-2.5 rounded-xl bg-white border border-purple-200/80 space-y-1">
              <div className="flex justify-between font-semibold text-[11px]">
                <span>Delivery Charge:</span>
                <span className="text-purple-900 font-bold">₹0.00 (Free Local Delivery)</span>
              </div>
              <div className="flex justify-between font-semibold text-[11px]">
                <span>AWB Tracking:</span>
                <span className="text-purple-900 font-bold">Not Required</span>
              </div>
              <div className="flex justify-between font-semibold text-[11px]">
                <span>Customer UI Label:</span>
                <span className="text-blue-900 font-bold">&quot;Out for Local Delivery&quot;</span>
              </div>
            </div>
          </div>

          {/* DTDC Courier Rule */}
          <div className="p-4 rounded-2xl border border-indigo-200 bg-indigo-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-sm text-indigo-950">DTDC National Courier</span>
              <Truck className="h-4 w-4 text-indigo-700" />
            </div>
            <p className="text-[11px] text-indigo-900 leading-relaxed">
              <strong>Distance Coverage:</strong> All orders requiring courier shipment across India.
            </p>
            <div className="p-2.5 rounded-xl bg-white border border-indigo-200/80 space-y-1">
              <div className="flex justify-between font-semibold text-[11px]">
                <span>Shipping Charge:</span>
                <span className="text-indigo-900 font-bold">₹0.00 (Standard Promo Rate)</span>
              </div>
              <div className="flex justify-between font-semibold text-[11px]">
                <span>AWB Tracking:</span>
                <span className="text-indigo-900 font-bold">Required to mark SHIPPED</span>
              </div>
              <div className="flex justify-between font-semibold text-[11px]">
                <span>Carrier Partner:</span>
                <span className="text-indigo-900 font-bold">DTDC Express Limited</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Secrets Note */}
      <div className="rounded-3xl border border-brand-maroon/15 bg-brand-paper p-6 space-y-3 shadow-xs">
        <div className="flex items-center gap-2 border-b border-brand-maroon/10 pb-3">
          <Shield className="h-5 w-5 text-emerald-700" />
          <h2 className="font-heading text-lg font-bold text-brand-maroon">Security Policy</h2>
        </div>

        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 text-xs text-emerald-950">
          <Info className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Zero Secret Leakage Compliance</p>
            <p className="text-[11px] text-emerald-900 leading-relaxed">
              In compliance with security regulations, sensitive environment credentials (`DATABASE_URL`, `AUTH_SECRET`, cloud access tokens, SMTP passwords) are strictly managed via server environment variables and never rendered on administrative web client interfaces.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
