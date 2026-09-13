import React from 'react';
import Image from 'next/image';

interface StorybookHeroSceneProps {
  className?: string;
}

/**
 * StorybookHeroScene renders the restored reference left hero artwork:
 * Large rectangular portrait card of Jesus + lamb artwork with torn paper edges,
 * slightly tilted counter-clockwise (-2.5deg), subtle drop shadow, top-left watercolor cloud cluster,
 * and a small simple green decorative base with daisies at the bottom.
 */
export default function StorybookHeroScene({ className = '' }: StorybookHeroSceneProps) {
  return (
    <div
      aria-hidden="true"
      className={`relative flex items-center justify-center select-none ${className}`}
    >
      {/* Top Left Watercolor Cloud Cluster Accent */}
      <div className="absolute -top-12 -left-12 w-[340px] sm:w-[380px] h-[220px] pointer-events-none select-none z-0 opacity-80">
        <Image
          src="/decorative/watercolor-cloud-cluster.png"
          alt=""
          fill
          sizes="380px"
          className="object-contain"
        />
      </div>

      {/* Tilted Rectangular Portrait Book Container */}
      <div className="relative z-10 -rotate-[2.5deg] transition-transform hover:rotate-0 duration-300">
        <div className="relative w-[300px] sm:w-[330px] lg:w-[350px] aspect-[1.10] rounded-2xl overflow-hidden bg-white shadow-[-10px_16px_30px_-6px_rgba(40,60,80,0.18)] border border-brand-maroon/10">
          <Image
            src="/books/little-lambs-activity-book/cover-front-portrait-clean.jpg"
            alt="Little Lambs Illustrated Cover Artwork"
            fill
            priority
            sizes="(max-width: 768px) 300px, (max-width: 1280px) 330px, 350px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Small Simple Green Decorative Base with Flowers & Leaves matching reference */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[340px] sm:w-[380px] h-[48px] z-20 pointer-events-none flex items-center justify-center">
        <svg viewBox="0 0 380 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Simple Soft Green Hill Mound */}
          <path d="M10 44 C90 20 290 20 370 44 L370 48 L10 48 Z" fill="#88AB8E" opacity="0.85" />
          {/* Small White Daisy Flowers with Yellow Center */}
          <circle cx="95" cy="34" r="4.5" fill="#FFFDF9" />
          <circle cx="95" cy="34" r="2" fill="#D4AF37" />
          <circle cx="215" cy="36" r="4.5" fill="#FFFDF9" />
          <circle cx="215" cy="36" r="2" fill="#D4AF37" />
          <circle cx="285" cy="38" r="4" fill="#FFFDF9" />
          <circle cx="285" cy="38" r="1.8" fill="#D4AF37" />
          {/* Tiny Green Leaves */}
          <path d="M140 38 Q144 32 148 38 Q144 42 140 38 Z" fill="#4E7C59" />
          <path d="M250 40 Q254 34 258 40 Q254 44 250 40 Z" fill="#4E7C59" />
        </svg>
      </div>
    </div>
  );
}







