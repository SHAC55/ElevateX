/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',

  // JIT-friendly content globs (Tailwind 3+)
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  // Mild forward-compat nicety; prevents hover styles on touch-only devices
  future: {
    hoverOnlyWhenSupported: true,
  },

  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1rem',
        md: '2rem',
        lg: '2rem',
        xl: '2.5rem',
        '2xl': '3rem',
      },
    },

    extend: {
      /* ------------ Breakpoints ------------ */
      screens: {
        txl: '1613px',
        hlg: '1469px',
        hmd: '800px',
      },

      /* ------------ Brand Tokens ------------ */
      colors: {
        brand: {
          primary: '#5A7FF1',
          surface: '#f8f9fb',
          ink: '#0F172A',
          sub: '#475569',
          ring: '#C7D2FE',
        },
      },

      /* ------------ Typography ------------ */
      fontFamily: {
        // system-safe first; swap in your display serif if/when you add it
        sans: [
          'Inter var',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
        ],
        serif: [
          'ui-serif',
          'Georgia',
          'Cambria',
          'Times New Roman',
          'Times',
          'serif',
        ],
      },

      /* ------------ Radii & Shadows ------------ */
      boxShadow: {
        soft: '0 10px 24px rgba(16,24,40,0.06)',
        hover: '0 12px 28px rgba(16,24,40,0.10)',
        inset: 'inset 0 1px 0 rgba(255,255,255,0.6)',
      },
      borderRadius: {
        xl2: '1rem',
        '2xl': '1.25rem', // intentionally punchier than Tailwind default
      },

      /* ------------ Motion Primitives ------------ */
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.4s ease-out both',
        float: 'float 4s ease-in-out infinite',
      },

      /* ------------ Transitions & Rings ------------ */
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
        in: 'cubic-bezier(0.12, 0, 0.39, 0)',
      },
      ringColor: {
        brand: '#C7D2FE',
      },

      /* ------------ Optional: named backgrounds so you can avoid arbitrary if needed ------------ */
      backgroundImage: {
       aurora:
    'radial-gradient(60% 60% at 20% 10%, rgba(99,102,241,0.18), transparent 60%), ' +
    'radial-gradient(45% 45% at 80% 0%, rgba(168,85,247,0.16), transparent 60%), ' +
    'radial-gradient(50% 50% at 50% 100%, rgba(59,130,246,0.12), transparent 60%), ' +
    'linear-gradient(to bottom right, #f8fafc, #eef2ff)',
  'soft-surface':
    'linear-gradient(to bottom right, #f8fafc, #eef2ff)',
      },
    },
  },

  /* ------------ Safelist to protect glass/aurora classes from purge ------------ */
  // Only necessary if you lean on lots of arbitrary values.
  safelist: [
  

    // common gradient utility combos we used
    { pattern: /(from|via|to)-(indigo|fuchsia|emerald|amber|slate|purple|violet)-(50|100|200|300)\/(10|20|30|40|50|60)/ },

    // backdrop filters for glassmorphism
    { pattern: /backdrop-(blur|brightness|saturate)(-|$).*/ },

    // translucent borders/rings frequently used in glass UI
    { pattern: /(border|ring)-(white|slate)-(10|20|30|40|50)\/(10|20|30|40|50)/ },
  ],

  /* ------------ Plugins ------------ */
  // Keep empty if you’re squeamish. If you want nicer keyframe helpers later:
  // plugins: [require('tailwindcss-animate')],
  plugins: [],
};
