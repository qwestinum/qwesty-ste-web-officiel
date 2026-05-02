import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Palette Qwestinum — Ivoire papier & or
        lin: '#F4F0E8',         // Background principal — ivoire papier (chaleureux)
        perle: '#D8D2C2',       // Surfaces secondaires (légèrement plus foncé)
        pierre: '#807D75',      // Texte secondaire
        sepia: '#2A2724',       // Texte primaire
        'or-pale': '#F4D35E',   // Accents discrets
        or: '#D4A82C',          // CTA, accents primaires
        'or-fonce': '#A8861C',  // Hover, états actifs
      },
      fontFamily: {
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'tighter-2': '-0.03em',
        'tight-1': '-0.015em',
        'wide-1': '0.04em',
        'wide-2': '0.18em',
        'wide-3': '0.28em',
      },
      lineHeight: {
        'tight-extra': '0.95',
      },
      borderRadius: {
        sm: '2px',
        DEFAULT: '4px',
        md: '8px',
        lg: '12px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-up': 'fadeUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;