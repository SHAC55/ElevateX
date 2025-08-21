import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Default tabs, but you can pass your own via props
const DEFAULT_TABS = [
  { key: "all", label: "All" },
  { key: "not_started", label: "Not Started" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
];

/**
 * StatusFilter (Premium Segmented Control)
 * - value: string (active key)
 * - onChange: (key) => void
 * - tabs: [{ key, label }] (optional)
 * - counts: Record<key, number> (optional)
 * - size: 'sm' | 'md' (optional)
 */
export default function StatusFilter({
  value = "all",
  onChange,
  tabs = DEFAULT_TABS,
  counts,
  size = "md",
  className = "",
}) {
  const containerRef = useRef(null);
  const btnRefs = useRef({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });

  const activeIndex = useMemo(
    () => Math.max(0, tabs.findIndex(t => t.key === value)),
    [tabs, value]
  );

  const setRef = (key) => (el) => {
    if (el) btnRefs.current[key] = el;
  };

  const measure = useCallback(() => {
    const el = btnRefs.current[tabs[activeIndex]?.key];
    const wrap = containerRef.current;
    if (!el || !wrap) return;
    const wrapRect = wrap.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    setIndicator({
      left: rect.left - wrapRect.left,
      width: rect.width,
      ready: true,
    });
  }, [activeIndex, tabs]);

  useEffect(() => {
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measure, value, tabs]);

  const sizes = {
    sm: {
      wrap: "p-1",
      btn: "px-3 py-1.5 text-sm",
      count: "ml-2 text-[10px]",
    },
    md: {
      wrap: "p-1.5",
      btn: "px-4 py-2.5 text-sm",
      count: "ml-2 text-xs",
    },
  };

  const onKeyDown = (e) => {
    const len = tabs.length;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const next = tabs[(activeIndex + 1) % len].key;
      onChange?.(next);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prev = tabs[(activeIndex - 1 + len) % len].key;
      onChange?.(prev);
    } else if (e.key === "Home") {
      e.preventDefault();
      onChange?.(tabs[0].key);
    } else if (e.key === "End") {
      e.preventDefault();
      onChange?.(tabs[len - 1].key);
    }
  };

  return (
    <div
      ref={containerRef}
      className={[
        "relative inline-flex w-full max-w-full items-center bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl shadow-soft overflow-hidden",
        sizes[size].wrap,
        className,
      ].join(" ")}
      role="tablist"
      aria-label="Filter by status"
      onKeyDown={onKeyDown}
    >
      {/* Animated underline indicator */}
      <AnimatePresence initial={false}>
        {indicator.ready && (
          <motion.span
            layout
            aria-hidden="true"
            className="absolute bottom-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-md"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1, 
              left: indicator.left, 
              width: indicator.width 
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25,
              mass: 0.8
            }}
            style={{ left: indicator.left, width: indicator.width }}
          />
        )}
      </AnimatePresence>

      {/* Buttons */}
      {tabs.map((t, i) => {
        const active = value === t.key;
        const count = counts?.[t.key];

        return (
          <button
            key={t.key}
            ref={setRef(t.key)}
            role="tab"
            aria-selected={active}
            aria-controls={`panel-${t.key}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange?.(t.key)}
            className={[
              "relative z-[1] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70",
              "font-medium whitespace-nowrap",
              sizes[size].btn,
              active 
                ? "text-indigo-700" 
                : "text-gray-600 hover:text-indigo-600",
            ].join(" ")}
          >
            <span className="relative z-10 flex items-center">
              {t.label}
              {typeof count === "number" && (
                <span
                  className={[
                    "inline-flex items-center justify-center rounded-full ml-2",
                    sizes[size].count,
                    "px-1.5 h-5 min-w-5 font-semibold",
                    active 
                      ? "bg-indigo-100 text-indigo-700" 
                      : "bg-gray-100 text-gray-600",
                  ].join(" ")}
                  aria-label={`${count} items`}
                >
                  {count}
                </span>
              )}
            </span>
            
            {/* Subtle hover effect */}
            <span
              aria-hidden="true"
              className={[
                "absolute inset-0 rounded-lg transition-opacity",
                active 
                  ? "bg-indigo-50/50 opacity-100" 
                  : "opacity-0 hover:opacity-100 hover:bg-gray-100/30",
              ].join(" ")}
            />
          </button>
        );
      })}
    </div>
  );
}