'use client';

import React from 'react';
import Image from 'next/image';

interface BookGalleryProps {
  coverImage: string;
  title: string;
}

export default function BookGallery({ coverImage, title }: BookGalleryProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Main Cover Artwork Showcase */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border-2 border-brand-maroon/15 bg-brand-paper p-4 shadow-md">
        <Image
          src={coverImage}
          alt={`Front cover of ${title}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-2 transition-transform duration-300 hover:scale-[1.02]"
        />
      </div>
      <p className="text-center text-xs text-brand-slate italic">
        Official cover artwork for {title}
      </p>
    </div>
  );
}
