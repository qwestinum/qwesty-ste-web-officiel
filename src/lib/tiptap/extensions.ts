import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import type { Extensions } from '@tiptap/core';

/**
 * Extensions Tiptap partagées entre l'éditeur (client) et le rendu serveur.
 * Important : utiliser exactement les mêmes extensions des deux côtés
 * pour que le HTML généré soit cohérent.
 */
export function getTiptapExtensions(opts?: { placeholder?: string }): Extensions {
  return [
    StarterKit.configure({
      heading: { levels: [2, 3, 4] },
      codeBlock: {
        HTMLAttributes: { class: 'language-text' },
      },
      bulletList: {
        HTMLAttributes: { class: 'prose-bullet-list' },
      },
      orderedList: {
        HTMLAttributes: { class: 'prose-ordered-list' },
      },
    }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      protocols: ['http', 'https', 'mailto', 'tel'],
      HTMLAttributes: {
        rel: 'noopener noreferrer',
        target: '_blank',
      },
    }),
    Image.configure({
      HTMLAttributes: {
        class: 'tiptap-image',
        loading: 'lazy',
      },
      allowBase64: false,
    }),
    Placeholder.configure({
      placeholder: opts?.placeholder ?? 'Commencez à écrire ici…',
      emptyEditorClass: 'is-editor-empty',
    }),
  ];
}
