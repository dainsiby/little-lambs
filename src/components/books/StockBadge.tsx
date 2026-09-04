import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import Badge from '@/components/ui/Badge';

interface StockBadgeProps {
  stock: number;
  className?: string;
}

export default function StockBadge({ stock, className = '' }: StockBadgeProps) {
  if (stock > 0) {
    return (
      <Badge variant="secondary" className={className}>
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
        <span>In Stock</span>
      </Badge>
    );
  }

  return (
    <Badge variant="outOfStock" className={className}>
      <AlertCircle className="h-3.5 w-3.5 text-red-600" />
      <span>Currently Out of Stock</span>
    </Badge>
  );
}
