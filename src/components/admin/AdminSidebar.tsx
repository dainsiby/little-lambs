'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  BookOpen,
  Boxes,
  Users,
  ShieldCheck,
  Settings,
  ArrowLeft,
  Menu,
  X,
  LogOut,
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Payments', href: '/admin/payments', icon: CreditCard },
    { name: 'Books', href: '/admin/books', icon: BookOpen },
    { name: 'Inventory', href: '/admin/inventory', icon: Boxes },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Audit Log', href: '/admin/audit', icon: ShieldCheck },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-6">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="space-y-3 border-b border-brand-maroon/10 pb-4">
          <Link href="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-brand-maroon/15 shadow-xs bg-white">
              <Image
                src="/brand/logo.png"
                alt="Little Lambs Logo"
                fill
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-maroon bg-brand-maroon/10 px-2 py-0.5 rounded">
                Admin Control
              </span>
              <h2 className="font-heading text-lg font-bold text-brand-maroon group-hover:text-brand-navy transition-colors">
                Little Lambs
              </h2>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href || (link.href !== '/admin/dashboard' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-maroon text-white shadow-xs'
                    : 'text-brand-slate hover:bg-brand-cream hover:text-brand-maroon'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="pt-6 border-t border-brand-maroon/10 space-y-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-semibold text-brand-slate hover:text-brand-maroon transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Storefront</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-3 left-4 z-40">
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle admin menu"
          className="p-2 rounded-xl bg-brand-paper border border-brand-maroon/15 shadow-md text-brand-maroon hover:bg-brand-cream"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 border-r border-brand-maroon/10 bg-brand-paper min-h-screen shrink-0 sticky top-0 h-screen overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-64 max-w-[80vw] bg-brand-paper h-full shadow-2xl z-50 overflow-y-auto">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
