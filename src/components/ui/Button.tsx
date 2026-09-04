import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export default function Button({
  href,
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold transition-all duration-200 focus-ring cursor-pointer select-none';

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs rounded-xl',
    md: 'px-5 py-2.5 text-sm rounded-2xl',
    lg: 'px-7 py-3.5 text-base rounded-2xl',
  };

  const variantStyles = {
    primary:
      'bg-brand-maroon text-brand-paper hover:bg-brand-maroon-dark shadow-sm hover:shadow active:scale-[0.99]',
    secondary:
      'bg-brand-sky text-brand-maroon-dark hover:bg-brand-sky-dark/90 shadow-sm active:scale-[0.99]',
    outline:
      'border-2 border-brand-maroon/30 text-brand-maroon hover:border-brand-maroon hover:bg-brand-maroon/5',
    ghost: 'text-brand-maroon hover:bg-brand-maroon/10',
  };

  const disabledStyles = 'opacity-60 cursor-not-allowed pointer-events-none shadow-none';

  const classes = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
    disabled ? disabledStyles : ''
  } ${className}`;

  if (href && !disabled) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
