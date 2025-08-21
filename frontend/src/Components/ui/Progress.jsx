import React from 'react';
import { cn } from './cn';

/**
 * Progress
 * - value: 0..100
 * - showLabel: boolean | string (if string, used as label)
 * - aria-compliant
 */
export function Progress({ value = 0, showLabel = false, className, trackClassName, barClassName }) {
  const clamped = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className={cn('w-full', className)}>
      {showLabel ? (
        <div className="mb-1 flex items-center justify-between text-xs text-brand-sub">
          <span>{typeof showLabel === 'string' ? showLabel : 'Progress'}</span>
          <span>{clamped}%</span>
        </div>
      ) : null}
      <div
        className={cn('h-2 w-full rounded-full bg-gray-100', trackClassName)}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
        aria-label="Progress"
      >
        <div
          className={cn('h-full rounded-full bg-brand-primary transition-all duration-300 ease-out', barClassName)}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
