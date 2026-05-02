import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine intelligemment des classes Tailwind en évitant les conflits.
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
 * Formate une date ISO en chaîne courte avec heure.
 * Exemple : formatDateTime('2026-04-01T14:30Z') → '01/04 14:30'
 */
export function formatDateTime(iso: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month} ${hours}:${minutes}`;
}

/**
 * Génère un slug URL-safe à partir d'une chaîne.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Calcule le temps de lecture en minutes depuis du texte HTML.
 */
export function calculateReadingTime(html: string | null): number {
  if (!html) return 0;
  const text = html.replace(/<[^>]+>/g, ' ');
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 220));
}
