import React from "react";
import { cn } from "../ui/cn"; 

/**
 * EmptyState
 * - Props:
 *   title: string
 *   subtitle: string
 *   action: ReactNode
 *   icon: ReactNode (optional)
 *   variant: 'neutral' | 'info' | 'error'
 */
const EmptyState = ({
  title = "Nothing here yet",
  subtitle = "Try generating or adding content.",
  action,
  icon,
  variant = "neutral",
  className,
}) => {
  const variants = {
    neutral: "bg-white border-gray-200",
    info: "bg-blue-50 border-blue-200",
    error: "bg-rose-50 border-rose-200",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center text-center border-2 border-dashed rounded-xl2 p-8 shadow-soft",
        variants[variant],
        className
      )}
    >
      {icon && <div className="mb-4 text-4xl text-brand-primary">{icon}</div>}
      <h3 className="text-lg font-semibold text-brand-ink">{title}</h3>
      <p className="text-sm text-brand-sub mt-1 max-w-md">{subtitle}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
};

export default EmptyState;
