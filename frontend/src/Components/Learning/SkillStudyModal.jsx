

import React, { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * SkillStudyModal
 * - open: boolean
 * - onClose: () => void
 * - title: string
 * - content: string | { content?: string; text?: string }
 * - loading: boolean
 */
export default function SkillStudyModal({ open, onClose, title, content, loading }) {
  const [copied, setCopied] = useState(false);
  const panelRef = useRef(null);
  const firstFocusRef = useRef(null);
  const lastFocusRef = useRef(null);

  const body =
    (typeof content === "object" ? content?.content || content?.text : content) || "";

  // Close on Esc
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "Tab") trapFocus(e);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Scroll lock
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  // Focus on open
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        firstFocusRef.current?.focus();
      }, 0);
    }
  }, [open]);

  const trapFocus = (e) => {
    const focusables = panelRef.current?.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables || focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const copyContent = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // if clipboard fails we shrug politely
    }
  }, [body]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        aria-modal="true"
        role="dialog"
        aria-labelledby="study-modal-title"
      >
        {/* Backdrop */}
        <motion.button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute inset-0 bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Panel */}
        <motion.div
          ref={panelRef}
          className="relative w-full sm:max-w-2xl bg-white rounded-t-2xl sm:rounded-2xl shadow-soft"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 pt-5">
            <h3
              id="study-modal-title"
              className="text-lg font-semibold text-brand-ink"
            >
              {title || "Study Material"}
            </h3>
            <div className="flex items-center gap-2">
              <button
                ref={firstFocusRef}
                onClick={copyContent}
                disabled={!body || loading}
                className="rounded-md px-2 py-1 text-sm border border-gray-200 text-brand-ink hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand disabled:opacity-50"
              >
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                onClick={onClose}
                className="rounded-md px-2 py-1 text-sm text-brand-sub hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand"
                aria-label="Close"
              >
                Close
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-5 sm:px-6 pb-5 sm:pb-6 mt-3 max-h-[65vh] overflow-auto">
            {loading ? (
              <div className="space-y-3">
                <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-4/5 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-3/5 bg-gray-100 rounded animate-pulse" />
                <div className="h-32 w-full bg-gray-100 rounded animate-pulse" />
              </div>
            ) : body ? (
              <article className="prose prose-sm max-w-none text-brand-ink">
                <pre className="whitespace-pre-wrap text-sm leading-6 text-brand-ink">
                  {body}
                </pre>
              </article>
            ) : (
              <p className="text-sm text-brand-sub">
                No content yet. Try generating again in a moment.
              </p>
            )}
          </div>

          {/* Invisible focus trap end */}
          <button ref={lastFocusRef} className="sr-only" onFocus={() => firstFocusRef.current?.focus()}>
            .
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
