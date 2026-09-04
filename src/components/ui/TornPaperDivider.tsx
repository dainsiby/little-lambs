import React from 'react';

interface TornPaperDividerProps {
  position?: 'top' | 'bottom';
  className?: string;
  bgClass?: string;
}

export default function TornPaperDivider({
  position = 'bottom',
  className = '',
  bgClass = 'bg-brand-cream',
}: TornPaperDividerProps) {
  const clipClass = position === 'top' ? 'torn-paper-top' : 'torn-paper-bottom';

  return (
    <div className={`w-full overflow-hidden leading-none ${className}`}>
      <div className={`h-6 w-full ${bgClass} ${clipClass}`} />
    </div>
  );
}
