import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1200px',
        '2xl': '1200px',
      },
    },
    extend: {
      colors: {
        // ---------------------------------------------------------------
        // Palette Qwestinum — alignée sur la charte ORQA (orqa.company)
        // ---------------------------------------------------------------
        ink: '#0A1F4B',           // Texte principal — bleu marine profond
        'ink-muted': '#4A5670',   // Texte secondaire
        accent: '#2B9FD8',        // Fond de CTA, bordures, icônes, soulignés
        'accent-hover': '#4FB0E0',// Hover du CTA plein
        'accent-deep': '#1A6E99', // Variante Qwestinum : accent lisible EN TEXTE (5.35:1)
        sun: '#FBD171',           // Filets, bordures de cartes chaudes, dégradés
        'sun-light': '#FED57B',   // Fin de dégradé
        halo: '#FAEDBB',          // Halo radial, ring
        cream: '#FBF9F5',         // Fond principal
        ivory: '#FCF8EE',         // Cartes « chaudes »
        footer: '#E9EDEB',        // Fond du pied de page
        hairline: 'rgba(10, 31, 75, 0.08)', // Toutes les bordures
        // États — assombris par rapport aux valeurs ORQA pour rester
        // lisibles EN TEXTE sur blanc et sur crème (>= 4.5:1).
        success: '#15803D',
        warning: '#A36200',
        danger: '#C4282D',
      },
      fontFamily: {
        // Carlito : 400 et 700 uniquement (comme ORQA).
        sans: ['var(--font-carlito)', 'Calibri', 'system-ui', 'sans-serif'],
        // Fraunces : réservée au contenu éditorial (/ressources) — le
        // différenciateur Qwestinum vis-à-vis d'ORQA.
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },
      letterSpacing: {
        'tighter-2': '-0.03em',
        'tight-1': '-0.015em',
        'wide-1': '0.04em',
        eyebrow: '0.16em',
        'wide-2': '0.18em',
        'wide-3': '0.28em',
      },
      lineHeight: {
        'tight-extra': '0.95',
        display: '1.08',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(10,31,75,0.04), 0 8px 24px -12px rgba(10,31,75,0.10)',
        lift: '0 2px 4px rgba(10,31,75,0.04), 0 20px 40px -16px rgba(10,31,75,0.14)',
        float: '0 4px 12px -4px rgba(10,31,75,0.08), 0 32px 64px -24px rgba(10,31,75,0.18)',
      },
      animation: {
        // `both` : l'élément reste invisible pendant [animation-delay:*]
        'fade-in': 'fadeIn 0.6s ease-out both',
        'fade-up': 'fadeUp 0.6s ease-out both',
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
