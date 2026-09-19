'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, Bell, User, LogOut, ChevronDown, CheckCircle, AlertTriangle, Truck, CreditCard } from 'lucide-react';
import SignOutButton from '@/components/auth/SignOutButton';

interface NotificationCounts {
  pendingPayments: number;
  lowStock: number;
  unassignedDelivery: number;
  missingTracking: number;
  total: number;
}

interface SearchResult {
  orders: Array<{ orderNumber: string; customerName: string; totalAmountPaise: number; status: string }>;
  books: Array<{ id: string; title: string; sku: string; stock: number }>;
  customers: Array<{ id: string; fullName: string; email: string }>;
}

export default function AdminTopHeader({
  adminName,
  adminEmail,
}: {
  adminName: string;
  adminEmail: string;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<NotificationCounts>({
    pendingPayments: 0,
    lowStock: 0,
    unassignedDelivery: 0,
    missingTracking: 0,
    total: 0,
  });

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Fetch notification counts
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/admin/dashboard');
        if (res.ok) {
          const data = await res.json();
          const metrics = data.metrics || {};
          const pendingPayments = metrics.pendingVerificationsCount || 0;
          const lowStock = metrics.lowStockCount || 0;
          const unassignedDelivery = metrics.confirmedOrdersCount || 0;
          const missingTracking = metrics.missingTrackingCount || 0;
          const total = pendingPayments + lowStock + unassignedDelivery + missingTracking;

          setNotifications({
            pendingPayments,
            lowStock,
            unassignedDelivery,
            missingTracking,
            total,
          });
        }
      } catch (err) {
        console.error('Failed to fetch admin notifications:', err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  // Handle global search debounce
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/admin/search?q=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
          setShowSearchDropdown(true);
        }
      } catch (err) {
        console.error('Admin search failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-brand-paper border-b border-brand-maroon/10 px-4 py-3 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-slate/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              const val = e.target.value;
              setSearchQuery(val);
              if (val.trim().length < 2) {
                setSearchResults(null);
                setShowSearchDropdown(false);
              }
            }}
            onFocus={() => searchQuery.length >= 2 && setShowSearchDropdown(true)}
            placeholder="Search Order #, Customer, Book, UTR..."
            className="w-full pl-9 pr-4 py-2 bg-brand-cream/60 border border-brand-maroon/15 rounded-xl text-xs sm:text-sm font-body text-brand-navy placeholder:text-brand-slate/60 focus:outline-hidden focus:ring-2 focus:ring-brand-maroon/30 transition-all"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 border-2 border-brand-maroon border-t-transparent rounded-full h-3.5 w-3.5 animate-spin" />
          )}
        </div>

        {/* Global Search Results Dropdown */}
        {showSearchDropdown && searchResults && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-brand-paper border border-brand-maroon/15 rounded-2xl shadow-xl overflow-hidden z-50 max-h-96 overflow-y-auto">
            {/* Orders */}
            {searchResults.orders.length > 0 && (
              <div className="p-3 border-b border-brand-maroon/10">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-slate block mb-2">
                  Orders
                </span>
                <div className="space-y-1.5">
                  {searchResults.orders.map((ord) => (
                    <Link
                      key={ord.orderNumber}
                      href={`/admin/orders/${ord.orderNumber}`}
                      onClick={() => setShowSearchDropdown(false)}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-brand-cream text-xs transition-colors"
                    >
                      <div>
                        <span className="font-bold text-brand-maroon">{ord.orderNumber}</span>
                        <span className="text-brand-slate text-[11px] block">{ord.customerName}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-brand-navy">₹{(ord.totalAmountPaise / 100).toFixed(2)}</span>
                        <span className="text-[10px] block text-brand-slate uppercase font-semibold">{ord.status}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Books */}
            {searchResults.books.length > 0 && (
              <div className="p-3 border-b border-brand-maroon/10">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-slate block mb-2">
                  Books
                </span>
                <div className="space-y-1.5">
                  {searchResults.books.map((bk) => (
                    <Link
                      key={bk.id}
                      href={`/admin/books/${bk.id}/edit`}
                      onClick={() => setShowSearchDropdown(false)}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-brand-cream text-xs transition-colors"
                    >
                      <div>
                        <span className="font-bold text-brand-maroon block">{bk.title}</span>
                        <span className="text-brand-slate text-[11px]">SKU: {bk.sku}</span>
                      </div>
                      <span className="text-xs font-bold text-brand-navy">Stock: {bk.stock}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Customers */}
            {searchResults.customers.length > 0 && (
              <div className="p-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-slate block mb-2">
                  Customers
                </span>
                <div className="space-y-1.5">
                  {searchResults.customers.map((cust) => (
                    <Link
                      key={cust.id}
                      href={`/admin/customers?search=${encodeURIComponent(cust.email)}`}
                      onClick={() => setShowSearchDropdown(false)}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-brand-cream text-xs transition-colors"
                    >
                      <div>
                        <span className="font-bold text-brand-maroon block">{cust.fullName}</span>
                        <span className="text-brand-slate text-[11px]">{cust.email}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {searchResults.orders.length === 0 &&
              searchResults.books.length === 0 &&
              searchResults.customers.length === 0 && (
                <div className="p-4 text-center text-xs text-brand-slate">
                  No matching orders, books, or customers found.
                </div>
              )}
          </div>
        )}
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="relative p-2 rounded-xl border border-brand-maroon/15 bg-brand-cream/50 text-brand-navy hover:bg-brand-cream transition-colors"
          >
            <Bell className="h-4 w-4" />
            {notifications.total > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-brand-maroon text-white font-extrabold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                {notifications.total}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-brand-paper border border-brand-maroon/15 rounded-2xl shadow-xl p-4 z-50 text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-brand-maroon/10 pb-2">
                <span className="font-heading font-bold text-brand-maroon">Operational Alerts</span>
                <span className="bg-brand-maroon/10 text-brand-maroon text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  {notifications.total} Urgent
                </span>
              </div>

              <div className="space-y-2">
                {notifications.pendingPayments > 0 && (
                  <Link
                    href="/admin/payments"
                    onClick={() => setShowNotifications(false)}
                    className="flex items-center justify-between p-2 rounded-lg bg-amber-50/80 border border-amber-200/60 hover:bg-amber-100/80 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-amber-700" />
                      <span className="font-medium text-amber-900">Pending Payments</span>
                    </div>
                    <span className="font-extrabold text-amber-800">{notifications.pendingPayments}</span>
                  </Link>
                )}

                {notifications.unassignedDelivery > 0 && (
                  <Link
                    href="/admin/orders?fulfilmentStatus=CONFIRMED"
                    onClick={() => setShowNotifications(false)}
                    className="flex items-center justify-between p-2 rounded-lg bg-blue-50/80 border border-blue-200/60 hover:bg-blue-100/80 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-blue-700" />
                      <span className="font-medium text-blue-900">Confirmed Orders (Assign Shipping)</span>
                    </div>
                    <span className="font-extrabold text-blue-800">{notifications.unassignedDelivery}</span>
                  </Link>
                )}

                {notifications.lowStock > 0 && (
                  <Link
                    href="/admin/inventory"
                    onClick={() => setShowNotifications(false)}
                    className="flex items-center justify-between p-2 rounded-lg bg-red-50/80 border border-red-200/60 hover:bg-red-100/80 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-700" />
                      <span className="font-medium text-red-900">Low Stock Titles</span>
                    </div>
                    <span className="font-extrabold text-red-800">{notifications.lowStock}</span>
                  </Link>
                )}

                {notifications.total === 0 && (
                  <div className="py-4 text-center text-brand-slate text-xs flex flex-col items-center gap-1">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span>All operational queues clear!</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-brand-maroon/15 bg-brand-cream/50 text-brand-navy hover:bg-brand-cream transition-colors text-xs font-semibold"
          >
            <div className="h-6 w-6 rounded-full bg-brand-maroon text-white flex items-center justify-center font-bold text-xs">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:inline font-heading font-bold text-brand-maroon">{adminName}</span>
            <ChevronDown className="h-3.5 w-3.5 text-brand-slate" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-brand-paper border border-brand-maroon/15 rounded-2xl shadow-xl p-3 z-50 text-xs space-y-2">
              <div className="border-b border-brand-maroon/10 pb-2 px-1">
                <p className="font-heading font-bold text-brand-maroon truncate">{adminName}</p>
                <p className="text-[11px] text-brand-slate truncate">{adminEmail}</p>
                <span className="inline-block mt-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-maroon/10 text-brand-maroon">
                  Administrator
                </span>
              </div>

              <Link
                href="/admin/settings"
                onClick={() => setShowProfileMenu(false)}
                className="block px-2.5 py-1.5 rounded-lg text-brand-navy hover:bg-brand-cream font-medium transition-colors"
              >
                Store Settings
              </Link>

              <Link
                href="/admin/audit"
                onClick={() => setShowProfileMenu(false)}
                className="block px-2.5 py-1.5 rounded-lg text-brand-navy hover:bg-brand-cream font-medium transition-colors"
              >
                Audit Log
              </Link>

              <div className="pt-1 border-t border-brand-maroon/10">
                <SignOutButton />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
