import React from "react";
import { cn } from "./cn";

const Badge = ({ 
  children, 
  variant = "default", 
  size = "md", 
  className, 
  ...props 
}) => {
  const baseClasses = "inline-flex items-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    default: "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500",
    success: "bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-500",
    danger: "bg-red-100 text-red-800 hover:bg-red-200 focus:ring-red-500",
    warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 focus:ring-yellow-500",
    info: "bg-blue-100 text-blue-800 hover:bg-blue-200 focus:ring-blue-500",
    premium: "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 focus:ring-purple-500",
    outline: "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1 text-md",
  };

  return (
    <span
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export { Badge };