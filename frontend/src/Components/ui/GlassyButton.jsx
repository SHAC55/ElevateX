// src/Components/ui/GlassyButton.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiLoader } from 'react-icons/fi';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

const variants = {
  primary:
    'text-white bg-gradient-to-r from-indigo-600 to-fuchsia-600 shadow-lg hover:brightness-110 focus:ring-indigo-500',
  secondary:
    'text-slate-800 bg-white/70 border border-white/40 backdrop-blur hover:bg-white/80 focus:ring-indigo-500',
  danger:
    'text-white bg-gradient-to-r from-rose-600 to-pink-600 shadow-lg hover:brightness-110 focus:ring-rose-500',
  ghost:
    'text-slate-700 bg-transparent border border-slate-300 hover:bg-slate-50 focus:ring-slate-400',
};

export default function GlassyButton({
  children,
  icon: Icon,
  variant = 'secondary',
  loading = false,
  className = '',
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: loading ? 1 : 1.03 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
      className={`${base} ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <FiLoader className="animate-spin" /> : Icon ? <Icon /> : null}
      <span>{children}</span>
    </motion.button>
  );
}
