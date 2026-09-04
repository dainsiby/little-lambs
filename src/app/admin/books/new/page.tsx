import React from 'react';
import BookForm from '@/components/admin/BookForm';

export default function CreateBookPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-heading text-3xl font-extrabold text-brand-maroon">
          Create New Catalogue Book
        </h1>
        <p className="text-xs text-brand-slate">
          Add a new title to the Little Lambs database catalogue.
        </p>
      </div>

      <BookForm isEditing={false} />
    </div>
  );
}
