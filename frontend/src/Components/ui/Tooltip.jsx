// src/Components/ui/Tooltip.jsx
import React, { useState } from "react";

const Tooltip = ({ children, content, delay = 300 }) => {
  let timeout;
  const [active, setActive] = useState(false);

  const showTip = () => {
    timeout = setTimeout(() => {
      setActive(true);
    }, delay);
  };

  const hideTip = () => {
    clearInterval(timeout);
    setActive(false);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
    >
      {children}
      {active && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow-sm">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
};

const TooltipProvider = ({ children }) => <>{children}</>;
const TooltipTrigger = ({ children, asChild }) => <>{children}</>;
const TooltipContent = ({ children }) => <>{children}</>;

export { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent };