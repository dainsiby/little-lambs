import React from 'react';

/**
 * HandDrawnElements renders soft hand-drawn embellishments (dashed trails,
 * small hearts, subtle starbursts, sparkles) to enrich titles and cards.
 * Tagged with aria-hidden="true".
 */

export function HandDrawnSparkle({ className = 'w-6 h-6 text-brand-gold' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
    </svg>
  );
}

export function HandDrawnHeart({ className = 'w-5 h-5 text-red-400' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

export function DashedTrail({ className = 'w-24 h-6 text-brand-maroon/40' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 24" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" aria-hidden="true">
      <path d="M5 12 Q 30 2, 50 12 T 95 12" strokeLinecap="round" />
    </svg>
  );
}
