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
  { href: '/contact', label: 'Contact' },
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
    { href: '/contact', label: 'Contact' },
  ],
  ressources: [
    { href: '/ressources', label: 'Articles' },
    { href: '/formations', label: 'Catalogue formations' },
  ],
  // La colonne « Conformité » (confidentialité, mentions légales, conditions,
  // cookies) a été retirée : aucune de ces quatre pages n'existe, les liens
  // renvoyaient une 404 depuis toutes les pages du site. À rétablir en même
  // temps que les pages.
} as const;
