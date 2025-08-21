
import React from 'react';
import { cn } from './cn';

/**
 * Premium Button Component
 * - Variants: primary | outline | ghost | subtle | premium
 * - Sizes: sm | md | lg
 * - Enhanced with premium styling, micro-interactions, and refined visual details
 */
export function Button({
  as: Comp = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  leftIcon,
  rightIcon,
  className,
  children,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 ease-out ' +
    'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand/30 ' +
    'disabled:opacity-50 disabled:cursor-not-allowed ' +
    'transform-gpu hover:-translate-y-0.5 active:translate-y-0 ' +
    'backdrop-blur-sm';

  const variants = {
    primary:
      'bg-gradient-to-br from-brand-primary to-brand-primary/90 text-white ' +
      'shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/30 ' +
      'hover:brightness-105 active:brightness-95 border border-brand-primary/20',
      
    outline:
      'border border-gray-300/80 bg-white/80 text-brand-ink ' +
      'hover:bg-gray-50/90 hover:border-gray-400/60 ' +
      'shadow-sm hover:shadow-md',
      
    ghost:
      'bg-transparent text-brand-ink hover:bg-gray-100/80 ' +
      'backdrop-blur-none',
      
    subtle:
      'bg-brand-surface/80 text-brand-ink border border-gray-200/60 ' +
      'hover:bg-white/90 hover:border-gray-300/60 ' +
      'shadow-sm hover:shadow-md',
      
    premium:
      'bg-gradient-to-br from-amber-500 to-amber-600 text-white ' +
      'shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 ' +
      'hover:brightness-110 active:brightness-95 border border-amber-400/30 ' +
      'relative overflow-hidden',
  };

  const sizes = {
    sm: 'h-9 px-3.5 text-sm gap-2',
    md: 'h-11 px-4.5 text-sm gap-2.5',
    lg: 'h-13 px-5.5 text-base gap-3',
  };

  // Add shimmer effect for premium variant
  const PremiumShimmer = () => (
    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
  );

  return (
    <Comp
      className={cn(
        base, 
        variants[variant], 
        sizes[size], 
        className,
        variant === 'premium' && 'relative overflow-hidden'
      )}
      disabled={disabled || loading}
      aria-busy={loading ? 'true' : undefined}
      {...props}
    >
      {variant === 'premium' && <PremiumShimmer />}
      
      {leftIcon ? (
        <span className={cn(
          'transition-opacity', 
          loading && 'opacity-0'
        )}>
          {leftIcon}
        </span>
      ) : null}
      
      <span className={cn(
        'flex items-center transition-opacity', 
        loading && 'opacity-0'
      )}>
        {children}
      </span>
      
      {rightIcon ? (
        <span className={cn(
          'transition-opacity', 
          loading && 'opacity-0'
        )}>
          {rightIcon}
        </span>
      ) : null}
      
      {loading && (
        <span
          className="absolute inline-flex items-center justify-center"
          aria-hidden="true"
        >
          <svg 
            className="h-4 w-4 animate-spin" 
            viewBox="0 0 20 20"
            fill="none"
          >
            <circle 
              cx="10" 
              cy="10" 
              r="8" 
              stroke="currentColor" 
              strokeOpacity="0.25" 
              strokeWidth="3"
              fill="none"
            />
            <path 
              d="M18 10a8 8 0 01-8 8" 
              stroke="currentColor" 
              strokeWidth="3" 
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </span>
      )}
    </Comp>
  );
}