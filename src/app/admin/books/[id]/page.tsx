import React from 'react';
import { notFound } from 'next/navigation';
import { getAdminBookById } from '@/lib/admin/adminBookService';
import { BookEditForm } from './BookEditForm';

interface BookPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminBookDetailPage({ params }: BookPageProps) {
  const { id } = await params;
  const book = await getAdminBookById(id);

  if (!book) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-4">
      <BookEditForm book={book} />
    </div>
  );
}
