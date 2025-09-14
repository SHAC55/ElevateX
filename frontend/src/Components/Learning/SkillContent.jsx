

// SkillContent.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSyncAlt, 
  faExclamationTriangle, 
  faBookOpen,
  faCircleNotch
} from '@fortawesome/free-solid-svg-icons';
import PremiumContentRenderer from "./PremiumContentRenderer";

export default function SkillContent({ loadingAI, aiError, aiMaterial, onRetry }) {
  if (loadingAI) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl bg-gradient-to-br from-indigo-50/80 to-blue-50/80 border border-indigo-100 p-8 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="h-7 w-48 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-full animate-pulse"></div>
          <div className="w-6 h-6 rounded-full border-2 border-indigo-400 border-t-indigo-600 animate-spin"></div>
        </div>
        <div className="space-y-4">
          <div className="h-4 w-full bg-gradient-to-r from-indigo-100 to-blue-100 rounded-full animate-pulse"></div>
          <div className="h-4 w-5/6 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-full animate-pulse"></div>
          <div className="h-4 w-4/5 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-full animate-pulse"></div>
          <div className="h-4 w-full bg-gradient-to-r from-indigo-100 to-blue-100 rounded-full animate-pulse"></div>
          <div className="h-4 w-3/4 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-full animate-pulse"></div>
        </div>
      </motion.div>
    );
  }

  if (aiError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl bg-gradient-to-br from-rose-50/80 to-rose-100/80 border border-rose-200 p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-rose-700">
            <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 mr-2" />
            <span className="font-medium">Content Unavailable</span>
          </div>
          {onRetry && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRetry}
              className="px-3 py-1.5 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-100 text-sm transition-colors flex items-center"
            >
              <FontAwesomeIcon icon={faSyncAlt} className="h-3 w-3 mr-1" />
              Retry
            </motion.button>
          )}
        </div>
        <div className="text-rose-800">
          <p className="text-rose-700/90 text-sm">
            {aiError?.response?.data?.message || aiError.message || "An unexpected error occurred while generating content"}
          </p>
        </div>
      </motion.div>
    );
  }

  if (!aiMaterial) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/80 border border-slate-200 p-8 text-center shadow-sm"
      >
        <FontAwesomeIcon icon={faBookOpen} className="h-12 w-12 mx-auto text-slate-400 mb-4" />
        <p className="text-slate-600">
          Select a skill to view detailed learning content.
        </p>
      </motion.div>
    );
  }

  // Expect the server shape shown above
  const material = aiMaterial.material || aiMaterial; // in case caller passed just {material:...}
  const json = material?.json || null;
  const text = material?.text || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl bg-gradient-to-br from-indigo-50/80 to-blue-50/80 border border-indigo-100 p-8 shadow-sm"
    >
      <PremiumContentRenderer json={json} fallbackText={text} />
    </motion.div>
  );
}