import React, { useState, useRef, useEffect } from "react";
import { cn } from "../ui/cn";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Premium ModulePicker with custom dropdown
 * - modules: array of { _id, title }
 * - value: string (selected id)
 * - onChange: function (id)
 */
const ModulePicker = ({ modules = [], value, onChange, label = "Learning Module", className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef(null);
  const hasModules = modules && modules.length > 0;
  const selectedModule = modules.find(m => m._id === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (moduleId) => {
    onChange?.(moduleId);
    setIsOpen(false);
  };

  return (
    <div className={cn("flex flex-col space-y-2", className)} ref={dropdownRef}>
      <label
        htmlFor="module-picker"
        className="text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>

      <div className="relative">
        <motion.div
          className={cn(
            "relative w-full rounded-xl border bg-white/80 backdrop-blur-sm transition-all duration-300 overflow-hidden",
            isFocused || isOpen
              ? "ring-2 ring-indigo-500/50 shadow-md border-indigo-400" 
              : "border-gray-300/70 shadow-sm hover:shadow-md hover:border-gray-400",
            !hasModules && "opacity-70"
          )}
          whileHover={{ y: -1 }}
          transition={{ duration: 0.2 }}
          onClick={() => hasModules && setIsOpen(!isOpen)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          tabIndex={0}
        >
          <div className={cn(
            "w-full px-4 py-3 text-sm outline-none cursor-pointer flex items-center justify-between",
            !hasModules && "text-gray-500 cursor-not-allowed",
            !selectedModule && "text-gray-500"
          )}>
            <span className="truncate">
              {selectedModule ? selectedModule.title : "Select a learning module"}
            </span>
            
            {/* Premium chevron indicator */}
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0 ml-2"
            >
              <svg
                className={cn(
                  "h-4 w-4 transition-colors duration-300",
                  isOpen || isFocused ? "text-indigo-600" : "text-gray-500"
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </div>
        </motion.div>

        {/* Custom dropdown options */}
        <AnimatePresence>
          {isOpen && hasModules && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white/95 backdrop-blur-md shadow-xl overflow-hidden"
            >
              <div className="py-2 max-h-60 overflow-y-auto">
                {modules.map((module) => (
                  <motion.div
                    key={module._id}
                    className={cn(
                      "px-4 py-3 text-sm cursor-pointer transition-all duration-200 flex items-center",
                      value === module._id
                        ? "bg-indigo-50 text-indigo-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100/70"
                    )}
                    onClick={() => handleSelect(module._id)}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.1 }}
                  >
                    <span className="truncate">{module.title}</span>
                    {value === module._id && (
                      <svg
                        className="ml-2 h-4 w-4 text-indigo-600 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!hasModules && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-gray-500 mt-1"
        >
          No modules available. Create one to get started.
        </motion.p>
      )}
    </div>
  );
};

export default ModulePicker;