import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { requireAdmin } from '@/lib/auth/guard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopHeader from '@/components/admin/AdminTopHeader';

export const metadata: Metadata = {
  title: 'Admin Control Panel | Little Lambs',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const admin = await requireAdmin(session?.user?.id);

  if (!admin) {
    redirect('/login?redirectTo=/admin/dashboard');
  }

  return (
    <div className="flex min-h-screen bg-brand-cream/40 font-body text-brand-navy">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopHeader adminName={admin.fullName} adminEmail={admin.email} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
