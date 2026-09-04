import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outOfStock' | 'outline';
  className?: string;
}

export default function Badge({
  children,
  variant = 'primary',
  className = '',
}: BadgeProps) {
  const baseStyles =
    'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition-colors';

  const variantStyles = {
    primary: 'bg-brand-maroon text-brand-paper',
    secondary: 'bg-brand-sky text-brand-maroon-dark',
    accent: 'bg-brand-gold/20 text-brand-maroon border border-brand-gold/40',
    outOfStock: 'bg-red-50 text-red-800 border border-red-200/80',
    outline: 'border border-brand-maroon/20 text-brand-maroon bg-transparent',
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
