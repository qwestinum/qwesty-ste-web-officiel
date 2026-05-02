import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine intelligemment des classes Tailwind en évitant les conflits.
 * Exemple : cn('px-4', condition && 'px-8') → 'px-8' si condition vraie.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formate une date ISO en chaîne lisible française.
 * Exemple : formatDate('2026-04-01') → 'avril 2026'
 */
export function formatDate(iso: string | null, options?: Intl.DateTimeFormatOptions) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    ...options,
  });
}

/**
 * Génère un slug URL-safe à partir d'une chaîne.
 * "L'IA en 2026" → "l-ia-en-2026"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // accents
    .replace(/[^a-z0-9\s-]/g, '')      // caractères spéciaux
    .trim()
    .replace(/\s+/g, '-')              // espaces → tirets
    .replace(/-+/g, '-');              // tirets multiples
}

/**
 * Calcule le temps de lecture en minutes depuis du texte HTML.
 * Base : 220 mots par minute (lecture moyenne FR).
 */
export function calculateReadingTime(html: string | null): number {
  if (!html) return 0;
  const text = html.replace(/<[^>]+>/g, ' ');
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 220));
}
