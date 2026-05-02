import { generateHTML } from '@tiptap/html';
import sanitizeHtml from 'sanitize-html';
import { getTiptapExtensions } from './extensions';
import type { Json } from '@/lib/supabase/types';

/**
 * Convertit le JSON Tiptap en HTML sanitize prêt pour le rendu public.
 *
 * Sanitization : on whitelist uniquement les balises et attributs nécessaires
 * pour empêcher toute injection XSS, même si quelqu'un pollue le JSON
 * directement en DB.
 *
 * On utilise sanitize-html plutôt que dompurify pour éviter les problèmes
 * d'ESM/CJS sur Vercel runtime Node.
 */
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'p', 'br', 'hr',
    'h2', 'h3', 'h4',
    'strong', 'em', 'u', 's',
    'a',
    'ul', 'ol', 'li',
    'blockquote',
    'code', 'pre',
    'img',
    'figure', 'figcaption',
  ],
  allowedAttributes: {
    a: ['href', 'rel', 'target'],
    img: ['src', 'alt', 'title', 'loading', 'class'],
    '*': ['class'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesByTag: {
    img: ['http', 'https', 'data'],
  },
  // Évite que sanitize-html transforme les entités déjà encodées
  disallowedTagsMode: 'discard',
  // Force rel="noopener noreferrer" sur tous les liens externes
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', {
      rel: 'noopener noreferrer',
      target: '_blank',
    }),
  },
};

export function tiptapJsonToSafeHtml(content: Json | null): string {
  if (!content || typeof content !== 'object') return '';

  let raw: string;
  try {
    raw = generateHTML(content as never, getTiptapExtensions());
  } catch (err) {
    console.error('tiptap generateHTML failed:', err);
    return '';
  }

  return sanitizeHtml(raw, SANITIZE_OPTIONS);
}