import React from 'react';
import Image from 'next/image';

/**
 * StorybookClouds renders authentic watercolor sky cloud clusters and gold stars.
 * Tagged with aria-hidden="true".
 */
export default function StorybookClouds() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Top Left Real Watercolor Cloud Cluster Asset */}
      <div className="absolute -top-6 -left-10 w-[340px] sm:w-[420px] lg:w-[480px] h-[260px] opacity-85 animate-float-subtle">
        <Image
          src="/decorative/watercolor-cloud-cluster.png"
          alt="Watercolor Cloud Cluster"
          fill
          sizes="(max-width: 768px) 340px, 480px"
          className="object-contain"
        />
      </div>

      {/* Top Center-Right Real Watercolor Cloud Mass Asset */}
      <div className="absolute -top-28 right-24 w-[280px] sm:w-[340px] lg:w-[380px] h-[160px] opacity-65 pointer-events-none select-none">
        <Image
          src="/decorative/watercolor-cloud-cluster.png"
          alt="Watercolor Cloud Cluster Right"
          fill
          sizes="(max-width: 768px) 280px, 380px"
          className="object-contain scale-x-[-1]"
        />
      </div>

      {/* Multi-point Gold Stars Scattered across Sky */}
      <div className="absolute top-12 left-12 text-brand-gold opacity-90">
        <svg className="w-7 h-7 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
        </svg>
      </div>

      <div className="absolute top-32 left-28 text-[#E6B830]/80">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
        </svg>
      </div>

      <div className="absolute top-20 right-72 text-brand-gold opacity-95">
        <svg className="w-6 h-6 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
        </svg>
      </div>
    </div>
  );
}

