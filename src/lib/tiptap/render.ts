import { generateHTML } from '@tiptap/html';
import DOMPurify from 'isomorphic-dompurify';
import { getTiptapExtensions } from './extensions';
import type { Json } from '@/lib/supabase/types';

/**
 * Convertit le JSON Tiptap en HTML sanitizé prêt pour le rendu public.
 *
 * Sanitization : on whitelist uniquement les balises et attributs nécessaires
 * pour empêcher toute injection XSS, même si quelqu'un pollue le JSON
 * directement en DB.
 */
export function tiptapJsonToSafeHtml(content: Json | null): string {
  if (!content || typeof content !== 'object') return '';

  let raw: string;
  try {
    // generateHTML attend un JSON Tiptap valide
    raw = generateHTML(content as never, getTiptapExtensions());
  } catch (err) {
    console.error('tiptap generateHTML failed:', err);
    return '';
  }

  return DOMPurify.sanitize(raw, {
    ALLOWED_TAGS: [
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
    ALLOWED_ATTR: [
      'href', 'rel', 'target',
      'src', 'alt', 'title', 'loading', 'class',
    ],
    ALLOWED_URI_REGEXP: /^(https?:|mailto:|tel:|\/|#)/i,
  });
}
