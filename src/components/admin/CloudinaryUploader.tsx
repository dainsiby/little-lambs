'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Upload, Trash2, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';

interface CloudinaryUploaderProps {
  bookId: string;
  existingImages?: Array<{
    id: string;
    imageUrl: string;
    altText: string;
    type: string;
  }>;
  onUploadSuccess?: () => void;
}

export default function CloudinaryUploader({
  bookId,
  existingImages = [],
  onUploadSuccess,
}: CloudinaryUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState('');
  const [type, setType] = useState('COVER_FRONT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bookId', bookId);
      formData.append('altText', altText || 'Book Image');
      formData.append('type', type);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Image upload failed');
      } else {
        setSuccess('Image successfully uploaded to Cloudinary!');
        setFile(null);
        setAltText('');
        if (onUploadSuccess) onUploadSuccess();
      }
    } catch {
      setError('An unexpected error occurred during upload.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 rounded-2xl border border-brand-maroon/10 bg-brand-paper p-6">
      <div>
        <h3 className="font-heading text-lg font-bold text-brand-maroon">
          Cloudinary Managed Image Storage
        </h3>
        <p className="text-xs text-brand-slate">
          Upload JPEG, PNG, or WebP cover artwork (max 5 MB). Managed via Cloudinary CDN.
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleUpload} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-brand-slate uppercase">
              Select Image File
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mt-1 text-xs text-brand-slate"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-slate uppercase">
              Image Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="focus-ring mt-1 block w-full rounded-xl border border-brand-maroon/20 bg-brand-paper px-3 py-2 text-xs text-brand-maroon"
            >
              <option value="COVER_FRONT">Front Cover</option>
              <option value="COVER_BACK">Back Cover</option>
              <option value="PREVIEW">Inside Preview</option>
              <option value="PROMOTIONAL">Promotional Artwork</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-slate uppercase">
            Alt Text / Image Description
          </label>
          <input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            className="focus-ring mt-1 block w-full rounded-xl border border-brand-maroon/20 bg-brand-paper px-3.5 py-2 text-xs text-brand-maroon"
            placeholder="Front cover artwork of Little Lambs Activity Book"
          />
        </div>

        <Button type="submit" variant="primary" size="sm" disabled={!file || loading}>
          <Upload className="mr-2 h-4 w-4" />
          {loading ? 'Uploading...' : 'Upload Image'}
        </Button>
      </form>

      {/* Existing Images Gallery List */}
      {existingImages.length > 0 && (
        <div className="pt-4 border-t border-brand-maroon/10">
          <h4 className="font-heading text-sm font-bold text-brand-maroon mb-3">
            Uploaded Book Images ({existingImages.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {existingImages.map((img) => (
              <div key={img.id} className="relative aspect-[3/4] overflow-hidden rounded-xl border border-brand-maroon/10 bg-brand-cream/30 p-2">
                <Image
                  src={img.imageUrl}
                  alt={img.altText}
                  fill
                  sizes="150px"
                  className="object-contain p-1"
                />
                <span className="absolute top-1 left-1 bg-brand-maroon text-brand-paper text-[9px] px-1.5 py-0.5 rounded font-bold">
                  {img.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
