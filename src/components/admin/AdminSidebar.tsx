'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, PlusCircle, ArrowLeft } from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Catalogue Books', href: '/admin/books', icon: BookOpen },
    { name: 'Create Book', href: '/admin/books/new', icon: PlusCircle },
  ];

  return (
    <aside className="w-64 border-r border-brand-maroon/10 bg-brand-paper min-h-screen p-6 flex flex-col justify-between">
      <div className="space-y-6">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-maroon bg-brand-maroon/10 px-2 py-0.5 rounded">
            Admin Management
          </span>
          <h2 className="font-heading text-xl font-bold text-brand-maroon">
            Little Lambs Control
          </h2>
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-brand-maroon text-brand-paper'
                    : 'text-brand-slate hover:bg-brand-cream hover:text-brand-maroon'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-brand-maroon/10">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-semibold text-brand-slate hover:text-brand-maroon transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Storefront</span>
        </Link>
      </div>
    </aside>
  );
}
