import React from 'react';
import { cn } from './cn';

/**
 * Tag / Badge
 * - Variants: neutral | info | success | warning | danger
 * - Sizes: sm | md
 */
export function Tag({ children, variant = 'neutral', size = 'sm', className, ...props }) {
  const variants = {
    neutral: 'bg-brand-surface text-brand-sub border-gray-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const sizes = {
    sm: 'text-xs h-6 px-2',
    md: 'text-sm h-7 px-3',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border whitespace-nowrap',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
