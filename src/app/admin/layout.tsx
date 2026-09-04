import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { requireAdmin } from '@/lib/auth/guard';
import AdminSidebar from '@/components/admin/AdminSidebar';

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
    <div className="flex min-h-screen bg-brand-cream font-body">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
