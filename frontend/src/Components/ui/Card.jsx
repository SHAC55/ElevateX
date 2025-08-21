// import React from 'react';
// import { cn } from './cn';

// /**
//  * Card primitive with subcomponents
//  * <Card>
//  *   <CardHeader>...</CardHeader>
//  *   <CardContent>...</CardContent>
//  *   <CardFooter>...</CardFooter>
//  * </Card>
//  */
// export function Card({ className, hover = true, as: Comp = 'div', ...props }) {
//   return (
//     <Comp
//       className={cn(
//         'bg-white rounded-xl2 shadow-soft',
//         hover && 'transition-shadow hover:shadow-hover',
//         className
//       )}
//       {...props}
//     />
//   );
// }

// export function CardHeader({ className, ...props }) {
//   return (
//     <div className={cn('px-5 pt-5 pb-3', className)} {...props} />
//   );
// }

// export function CardTitle({ className, ...props }) {
//   return (
//     <h3 className={cn('text-lg font-semibold text-brand-ink', className)} {...props} />
//   );
// }

// export function CardDescription({ className, ...props }) {
//   return (
//     <p className={cn('text-sm text-brand-sub', className)} {...props} />
//   );
// }

// export function CardContent({ className, ...props }) {
//   return (
//     <div className={cn('px-5 pb-5', className)} {...props} />
//   );
// }

// export function CardFooter({ className, ...props }) {
//   return (
//     <div className={cn('px-5 pb-5 pt-3 border-t border-gray-100', className)} {...props} />
//   );
// }


import React from 'react';
import { cn } from './cn';

/**
 * Premium Card Component System
 * <Card>
 *   <CardHeader>...</CardHeader>
 *   <CardContent>...</CardContent>
 *   <CardFooter>...</CardFooter>
 * </Card>
 * 
 * Features:
 * - Multiple variants: elevated, outlined, filled, gradient
 * - Enhanced hover effects with smooth transitions
 * - Focus states for accessibility
 * - Ripple effect for interactive feedback
 * - Customizable padding and border radius
 */

// Ripple effect hook
const useRipple = () => {
  const [ripples, setRipples] = React.useState([]);

  const addRipple = (event) => {
    const rippleContainer = event.currentTarget;
    const rect = rippleContainer.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const newRipple = {
      key: Date.now(),
      style: {
        width: size,
        height: size,
        top: y,
        left: x,
      },
    };

    setRipples([...ripples, newRipple]);
    
    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.key !== newRipple.key));
    }, 600);
  };

  return { ripples, addRipple };
};

export function Card({ 
  className, 
  hover = true, 
  clickable = false,
  variant = 'elevated',
  as: Comp = 'div',
  padding = 'normal',
  borderRadius = 'xl',
  children,
  onClick,
  ...props 
}) {
  const { ripples, addRipple } = useRipple();
  
  const handleClick = (e) => {
    if (clickable && onClick) {
      addRipple(e);
      onClick(e);
    }
  };

  const baseStyles = 'relative overflow-hidden transition-all duration-300';
  
  const paddingStyles = {
    none: '',
    tight: 'p-4',
    normal: 'p-6',
    relaxed: 'p-8',
  };
  
  const borderRadiusStyles = {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    xl: 'rounded-2xl',
    '2xl': 'rounded-3xl',
  };
  
  const variantStyles = {
    elevated: cn(
      'bg-white shadow-lg shadow-gray-200/60',
      hover && 'hover:shadow-xl hover:shadow-gray-300/40',
      clickable && 'cursor-pointer'
    ),
    outlined: cn(
      'bg-white border border-gray-200/80',
      hover && 'hover:border-gray-300/90 hover:shadow-md',
      clickable && 'cursor-pointer'
    ),
    filled: cn(
      'bg-gray-50/50',
      hover && 'hover:bg-gray-100/70',
      clickable && 'cursor-pointer'
    ),
    gradient: cn(
      'bg-gradient-to-br from-white to-gray-50 border border-gray-100/50',
      hover && 'hover:from-white hover:to-gray-100 hover:shadow-md',
      clickable && 'cursor-pointer'
    ),
  };

  return (
    <Comp
      className={cn(
        baseStyles,
        variantStyles[variant],
        paddingStyles[padding],
        borderRadiusStyles[borderRadius],
        className
      )}
      onClick={handleClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (clickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick(e);
        }
      }}
      {...props}
    >
      {children}
      
      {/* Ripple effect */}
      {clickable && (
        <div className="absolute inset-0 overflow-hidden">
          {ripples.map((ripple) => (
            <span
              key={ripple.key}
              className="absolute bg-gray-200/40 rounded-full animate-ripple"
              style={ripple.style}
            />
          ))}
        </div>
      )}
    </Comp>
  );
}

export function CardHeader({ className, ...props }) {
  return (
    <div 
      className={cn(
        'px-6 pt-6 pb-4 border-b border-gray-100/60', 
        className
      )} 
      {...props} 
    />
  );
}

export function CardTitle({ 
  className, 
  as: Comp = 'h3', 
  size = 'lg',
  ...props 
}) {
  const sizeStyles = {
    sm: 'text-base font-semibold',
    md: 'text-lg font-semibold',
    lg: 'text-xl font-semibold',
    xl: 'text-2xl font-bold',
  };
  
  return (
    <Comp 
      className={cn(
        'text-brand-ink tracking-tight',
        sizeStyles[size],
        className
      )} 
      {...props} 
    />
  );
}

export function CardDescription({ 
  className, 
  variant = 'default',
  ...props 
}) {
  const variantStyles = {
    default: 'text-brand-sub',
    muted: 'text-gray-500',
    strong: 'text-brand-ink font-medium',
  };
  
  return (
    <p 
      className={cn(
        'text-sm leading-relaxed',
        variantStyles[variant],
        className
      )} 
      {...props} 
    />
  );
}

export function CardContent({ 
  className, 
  padding = 'normal',
  ...props 
}) {
  const paddingStyles = {
    none: '',
    tight: 'p-4',
    normal: 'p-6',
    relaxed: 'p-8',
  };
  
  return (
    <div 
      className={cn(
        paddingStyles[padding],
        className
      )} 
      {...props} 
    />
  );
}

export function CardFooter({ 
  className, 
  alignment = 'right',
  ...props 
}) {
  const alignmentStyles = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  };
  
  return (
    <div 
      className={cn(
        'px-6 pb-6 pt-4 border-t border-gray-100/60 flex items-center gap-3',
        alignmentStyles[alignment],
        className
      )} 
      {...props} 
    />
  );
}

// Additional premium components
export function CardMedia({ className, ...props }) {
  return (
    <div 
      className={cn(
        'overflow-hidden',
        className
      )} 
      {...props} 
    />
  );
}

export function CardActions({ className, ...props }) {
  return (
    <div 
      className={cn(
        'flex items-center gap-2 mt-4',
        className
      )} 
      {...props} 
    />
  );
}