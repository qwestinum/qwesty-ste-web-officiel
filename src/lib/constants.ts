/**
 * Constantes globales du site.
 * Ces données ne changent pas (ou rarement) — pas besoin de DB.
 */

export const SITE_CONFIG = {
  name: 'Qwestinum',
  tagline: 'Process · AI · Transformation',
  description:
    "Conseil, solutions et formations en intelligence artificielle appliquée aux processus et aux opérations.",
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://qwestinum.fr',
  ogImage: '/og-image.png',
  contact: {
    email: 'contact@qwestinum.com',
    phone: '+33 6 36 49 58 98',
  },
  locations: ['Casablanca', 'Paris', 'Vienne'],
} as const;

export const NAV_LINKS = [
  { href: '/cas-usage', label: "Cas d'usage" },
  { href: '/formations', label: 'Formations' },
  { href: '/ressources', label: 'Ressources' },
  { href: '/a-propos', label: 'À propos' },
] as const;

export const FOOTER_LINKS = {
  services: [
    { href: '/#services', label: 'Audit & consulting' },
    { href: '/cas-usage', label: "Cas d'usage" },
    { href: '/formations', label: 'Formations' },
  ],
  entreprise: [
    { href: '/a-propos', label: 'À propos' },
    { href: '/ressources', label: 'Ressources' },
    { href: '/#contact', label: 'Contact' },
  ],
  ressources: [
    { href: '/ressources', label: 'Articles' },
    { href: '/ressources#newsletter', label: 'Newsletter' },
    { href: '/formations', label: 'Catalogue formations' },
  ],
  conformite: [
    { href: '/confidentialite', label: 'Confidentialité' },
    { href: '/mentions-legales', label: 'Mentions légales' },
    { href: '/conditions', label: 'Conditions' },
    { href: '/cookies', label: 'Cookies' },
  ],
} as const;
