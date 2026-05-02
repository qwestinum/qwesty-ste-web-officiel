'use client';

import { useState, useTransition } from 'react';
import {
  saveArticleMeta,
  setArticleStatus,
  deleteArticle,
  type ArticleMetaPayload,
} from '@/lib/actions/articles';
import { slugify } from '@/lib/utils';
import type { Article, ArticleCategory, ContentStatus } from '@/lib/supabase/types';

const CATEGORY_OPTIONS: Array<{ value: ArticleCategory; label: string }> = [
  { value: 'strategie', label: 'Stratégie' },
  { value: 'methode', label: 'Méthode' },
  { value: 'retours-experience', label: "Retour d'expérience" },
  { value: 'lucidite-ia', label: 'Lucidité IA' },
];

interface ArticleMetaFormProps {
  article: Article;
}

export function ArticleMetaForm({ article }: ArticleMetaFormProps) {
  const [meta, setMeta] = useState<ArticleMetaPayload>({
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    category: article.category,
    cover_image_url: article.cover_image_url,
    author_name: article.author_name,
    seo_title: article.seo_title,
    seo_description: article.seo_description,
    is_featured: article.is_featured,
  });
  const [status, setStatus] = useState<ContentStatus>(article.status);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error'>('success');
  const [isPending, startTransition] = useTransition();
  const [slugLockedToTitle, setSlugLockedToTitle] = useState(
    article.slug.startsWith('brouillon-') || article.slug === slugify(article.title)
  );

  function update<K extends keyof ArticleMetaPayload>(key: K, value: ArticleMetaPayload[K]) {
    setMeta((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'title' && slugLockedToTitle && typeof value === 'string') {
        next.slug = slugify(value);
      }
      return next;
    });
  }

  function handleSlugChange(value: string) {
    setSlugLockedToTitle(false);
    update('slug', slugify(value));
  }

  function showFeedback(message: string, type: 'success' | 'error' = 'success') {
    setFeedback(message);
    setFeedbackType(type);
    setTimeout(() => setFeedback(null), 3000);
  }

  function handleSave() {
    startTransition(async () => {
      const result = await saveArticleMeta(article.id, meta);
      showFeedback(result.message, result.success ? 'success' : 'error');
    });
  }

  function handleStatusChange(newStatus: ContentStatus) {
    startTransition(async () => {
      const result = await setArticleStatus(article.id, newStatus);
      if (result.success) setStatus(newStatus);
      showFeedback(result.message, result.success ? 'success' : 'error');
    });
  }

  function handleDelete() {
    if (!confirm('Supprimer définitivement cet article ? Cette action est irréversible.')) return;

    startTransition(async () => {
      const result = await deleteArticle(article.id);
      if (result.success) {
        window.location.href = '/admin/articles';
      } else {
        showFeedback(result.message, 'error');
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Statut + actions */}
      <div className="bg-lin border border-perle rounded-md p-5">
        <h3 className="label-mark mb-3">Statut</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <StatusBadge status={status} />
        </div>

        <div className="space-y-2">
          {status === 'draft' && (
            <ActionButton primary onClick={() => handleStatusChange('published')} disabled={isPending}>
              Publier
            </ActionButton>
          )}
          {status === 'published' && (
            <ActionButton onClick={() => handleStatusChange('draft')} disabled={isPending}>
              Dépublier (remettre en brouillon)
            </ActionButton>
          )}
          {status !== 'archived' && status !== 'draft' && (
            <ActionButton onClick={() => handleStatusChange('archived')} disabled={isPending}>
              Archiver
            </ActionButton>
          )}
          {status === 'archived' && (
            <ActionButton onClick={() => handleStatusChange('draft')} disabled={isPending}>
              Désarchiver
            </ActionButton>
          )}

          <a
            href={`/admin/articles/${article.id}/preview`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center px-4 py-2.5 rounded-sm border border-perle font-sans text-xs font-semibold uppercase tracking-wide-2 text-sepia hover:border-or-fonce hover:text-or-fonce transition-colors"
          >
            Aperçu →
          </a>
        </div>
      </div>

      {/* Métadonnées */}
      <div className="bg-lin border border-perle rounded-md p-5 space-y-4">
        <h3 className="label-mark">Métadonnées</h3>

        <Field label="Titre" required>
          <input
            type="text"
            value={meta.title}
            onChange={(e) => update('title', e.target.value)}
            className="w-full bg-lin border border-perle rounded-sm px-3 py-2 font-sans text-sm text-sepia focus:outline-none focus:border-or-fonce"
          />
        </Field>

        <Field
          label="Slug (URL)"
          hint={
            slugLockedToTitle
              ? 'Généré depuis le titre. Cliquez pour personnaliser.'
              : 'URL : /ressources/' + meta.slug
          }
        >
          <input
            type="text"
            value={meta.slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            className="w-full bg-lin border border-perle rounded-sm px-3 py-2 font-mono text-xs text-sepia focus:outline-none focus:border-or-fonce"
          />
        </Field>

        <Field label="Catégorie">
          <select
            value={meta.category}
            onChange={(e) => update('category', e.target.value as ArticleCategory)}
            className="w-full bg-lin border border-perle rounded-sm px-3 py-2 font-sans text-sm text-sepia focus:outline-none focus:border-or-fonce"
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </Field>

        <Field label="Résumé (excerpt)" hint="Affiché sur la liste des ressources">
          <textarea
            value={meta.excerpt ?? ''}
            onChange={(e) => update('excerpt', e.target.value)}
            rows={3}
            className="w-full bg-lin border border-perle rounded-sm px-3 py-2 font-sans text-sm text-sepia focus:outline-none focus:border-or-fonce resize-y"
          />
        </Field>

        <Field label="Image de couverture (URL)" hint="Optionnel">
          <input
            type="url"
            value={meta.cover_image_url ?? ''}
            onChange={(e) => update('cover_image_url', e.target.value)}
            placeholder="https://..."
            className="w-full bg-lin border border-perle rounded-sm px-3 py-2 font-sans text-xs text-sepia focus:outline-none focus:border-or-fonce"
          />
        </Field>

        <Field label="Auteur">
          <input
            type="text"
            value={meta.author_name ?? ''}
            onChange={(e) => update('author_name', e.target.value)}
            placeholder="Imad Belfaqir"
            className="w-full bg-lin border border-perle rounded-sm px-3 py-2 font-sans text-sm text-sepia focus:outline-none focus:border-or-fonce"
          />
        </Field>

        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="is_featured"
            checked={meta.is_featured}
            onChange={(e) => update('is_featured', e.target.checked)}
            className="h-4 w-4 accent-or-fonce"
          />
          <label htmlFor="is_featured" className="font-sans text-sm text-sepia">
            Article phare (mis en avant sur /ressources)
          </label>
        </div>
      </div>

      {/* SEO */}
      <details className="bg-lin border border-perle rounded-md p-5 group">
        <summary className="label-mark cursor-pointer list-none flex items-center justify-between">
          <span>SEO</span>
          <span className="font-sans text-[10px] text-pierre group-open:rotate-180 transition-transform">▾</span>
        </summary>
        <div className="space-y-4 mt-4">
          <Field label="Titre SEO" hint="Affiché dans l'onglet du navigateur et Google">
            <input
              type="text"
              value={meta.seo_title ?? ''}
              onChange={(e) => update('seo_title', e.target.value)}
              maxLength={70}
              className="w-full bg-lin border border-perle rounded-sm px-3 py-2 font-sans text-sm text-sepia focus:outline-none focus:border-or-fonce"
            />
          </Field>

          <Field label="Description SEO" hint="155 caractères max">
            <textarea
              value={meta.seo_description ?? ''}
              onChange={(e) => update('seo_description', e.target.value)}
              maxLength={160}
              rows={3}
              className="w-full bg-lin border border-perle rounded-sm px-3 py-2 font-sans text-sm text-sepia focus:outline-none focus:border-or-fonce resize-y"
            />
          </Field>
        </div>
      </details>

      {/* Bouton sauvegarde */}
      <button
        type="button"
        onClick={handleSave}
        disabled={isPending}
        className="btn-primary w-full !py-3 disabled:opacity-50"
      >
        {isPending ? 'Enregistrement…' : 'Enregistrer les métadonnées'}
      </button>

      {/* Feedback */}
      {feedback && (
        <div
          className={`rounded-md border p-3 font-sans text-xs text-sepia ${
            feedbackType === 'success' ? 'border-or bg-or-pale/20' : 'border-sepia bg-perle/30'
          }`}
        >
          {feedback}
        </div>
      )}

      {/* Suppression — zone danger */}
      <details className="bg-perle/20 border border-perle rounded-md p-5 group">
        <summary className="label-mark cursor-pointer list-none">
          Zone danger
        </summary>
        <p className="mt-3 font-sans text-xs text-pierre">
          La suppression est définitive et ne peut pas être annulée.
        </p>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="mt-3 w-full px-4 py-2 rounded-sm bg-sepia text-lin font-sans text-xs font-semibold uppercase tracking-wide-2 hover:bg-or-fonce transition-colors disabled:opacity-50"
        >
          Supprimer définitivement
        </button>
      </details>
    </div>
  );
}

function Field({
  label,
  required = false,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block font-sans text-[11px] font-medium uppercase tracking-wide-2 text-pierre mb-1.5">
        {label} {required && <span className="text-or-fonce">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 font-sans text-[11px] text-pierre/80">{hint}</p>}
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  primary = false,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={
        primary
          ? 'w-full px-4 py-2.5 rounded-sm bg-or text-sepia font-sans text-xs font-semibold uppercase tracking-wide-2 hover:bg-or-fonce hover:text-lin transition-colors disabled:opacity-50'
          : 'w-full px-4 py-2.5 rounded-sm border border-perle font-sans text-xs font-semibold uppercase tracking-wide-2 text-sepia hover:border-pierre hover:bg-perle/30 transition-colors disabled:opacity-50'
      }
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }: { status: ContentStatus }) {
  const config = {
    draft: { label: 'Brouillon', classes: 'bg-perle text-sepia' },
    published: { label: 'Publié', classes: 'bg-or text-sepia' },
    archived: { label: 'Archivé', classes: 'bg-sepia text-lin' },
  }[status];
  return (
    <span
      className={`inline-flex items-center font-sans text-[10px] font-semibold uppercase tracking-wide-2 rounded-sm px-2 py-1 ${config.classes}`}
    >
      {config.label}
    </span>
  );
}
