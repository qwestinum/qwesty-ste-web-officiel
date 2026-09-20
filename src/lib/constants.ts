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
    email: 'contact@qwestinum.fr',
    phone: '+33 6 36 49 58 98',
  },
  locations: ['Casablanca', 'Paris', 'Vienne'],
} as const;

/**
 * Informations légales.
 *
 * Les champs laissés vides ne sont PAS affichés sur les pages : il suffit
 * de les renseigner ici pour qu'ils apparaissent, sans toucher au JSX.
 *
 * Toutes les mentions obligatoires de l'article 6 III de la LCEN sont
 * renseignées. Seul `vatNumber` reste optionnel.
 */
export const LEGAL_CONFIG = {
  companyName: 'Qwestinum',
  legalForm: 'Société par actions simplifiée unipersonnelle (SASU)',
  /** Forme abrégée, pour les mentions en ligne de texte. */
  legalFormShort: 'SASU',
  capital: '3 333 €',
  siren: '992 506 188',
  rcs: 'Versailles 992 506 188',
  vatNumber: '',
  address: '45 rue Daniel Bricon, 78680 Épône',
  publicationDirector: 'Imad Belfaqir',
  host: {
    name: 'Vercel Inc.',
    url: 'https://vercel.com',
    address: '',
  },
  /** Sous-traitants auxquels des données peuvent être transmises. */
  processors: [
    { name: 'Vercel', role: 'Hébergement du site', url: 'https://vercel.com/legal/privacy-policy' },
    { name: 'Supabase', role: 'Base de données des demandes de contact', url: 'https://supabase.com/privacy' },
    { name: 'Resend', role: 'Envoi de la notification email interne', url: 'https://resend.com/legal/privacy-policy' },
    { name: 'Cal.com', role: 'Prise de rendez-vous, si vous réservez un créneau', url: 'https://cal.com/privacy' },
  ],
  /** Durée de conservation des demandes de contact. */
  retention: '3 ans à compter du dernier contact',
  /** Date de dernière mise à jour des pages légales. */
  lastUpdated: '20 septembre 2026',
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
  // N'ajouter ici que des pages qui existent réellement : ces liens sont
  // rendus sur TOUTES les pages du site.
  legal: [
    { href: '/mentions-legales', label: 'Mentions légales' },
    { href: '/confidentialite', label: 'Confidentialité' },
  ],
} as const;
