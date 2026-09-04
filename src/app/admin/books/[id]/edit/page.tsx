import React from 'react';
import { notFound } from 'next/navigation';
import { getAdminBookById } from '@/lib/admin/books';
import BookForm from '@/components/admin/BookForm';
import CloudinaryUploader from '@/components/admin/CloudinaryUploader';

interface EditBookPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBookPage({ params }: EditBookPageProps) {
  const { id } = await params;
  const book = await getAdminBookById(id);

  if (!book) {
    notFound();
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="font-heading text-3xl font-extrabold text-brand-maroon">
          Edit Book: {book.title}
        </h1>
        <p className="text-xs text-brand-slate">
          Update catalogue metadata, status, stock inventory, retail price, and images.
        </p>
      </div>

      <BookForm
        isEditing={true}
        initialData={{
          id: book.id,
          title: book.title,
          subtitle: book.subtitle || '',
          slug: book.slug,
          sku: book.sku,
          isbn: book.isbn,
          description: book.description,
          shortDescription: book.shortDescription || '',
          ageMin: book.ageMin,
          ageMax: book.ageMax,
          language: book.language,
          publisher: book.publisher,
          price: Number(book.price),
          stock: book.stock,
          status: book.status,
          featured: book.featured,
        }}
      />

      <CloudinaryUploader
        bookId={book.id}
        existingImages={book.images.map((img) => ({
          id: img.id,
          imageUrl: img.imageUrl,
          altText: img.altText,
          type: img.type,
        }))}
      />
    </div>
  );
}
