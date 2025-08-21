import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle, FaChevronDown, FaChevronUp, FaCode } from "react-icons/fa";

const FallbackNote = ({ note, raw }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!note && !raw) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-amber-300/40 bg-gradient-to-br from-amber-50/80 to-amber-100/40 backdrop-blur-xl p-6 shadow-lg shadow-amber-500/10 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md flex-shrink-0">
          <FaExclamationTriangle className="h-5 w-5" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-amber-800 mb-2">AI Fallback Notice</h3>
          <p className="text-amber-700/90 leading-relaxed">{note}</p>
          
          {raw && (
            <div className="mt-4">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors"
              >
                <span>View raw AI output</span>
                {isExpanded ? (
                  <FaChevronUp className="h-3 w-3" />
                ) : (
                  <FaChevronDown className="h-3 w-3" />
                )}
              </button>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 overflow-hidden"
                  >
                    <div className="rounded-xl border border-amber-200/50 bg-white/80 backdrop-blur-md p-4">
                      <div className="flex items-center gap-2 text-xs font-medium text-amber-600 uppercase tracking-wide mb-2">
                        <FaCode className="h-3 w-3" />
                        Raw AI Output
                      </div>
                      <pre className="text-xs text-slate-700 overflow-auto max-h-60 p-3 bg-slate-50/50 rounded-lg border border-slate-200/50">
                        {JSON.stringify(raw, null, 2)}
                      </pre>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default FallbackNote;