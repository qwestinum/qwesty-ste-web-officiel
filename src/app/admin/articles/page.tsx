import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllArticlesAdmin } from '@/lib/queries/articles-admin';
import { CreateArticleButton } from '@/components/admin/editor/CreateArticleButton';
import { formatDateTime } from '@/lib/utils';
import type { ContentStatus } from '@/lib/supabase/types';

export const metadata: Metadata = { title: 'Articles' };
export const dynamic = 'force-dynamic';

const STATUS_CONFIG: Record<ContentStatus, { label: string; classes: string }> = {
  draft: { label: 'Brouillon', classes: 'bg-perle text-sepia' },
  published: { label: 'Publié', classes: 'bg-or text-sepia' },
  archived: { label: 'Archivé', classes: 'bg-sepia text-lin' },
};

const CATEGORY_LABELS: Record<string, string> = {
  strategie: 'Stratégie',
  methode: 'Méthode',
  'retours-experience': "Retour d'expérience",
  'lucidite-ia': 'Lucidité IA',
};

const STATUS_FILTERS = [
  { value: 'all', label: 'Tous' },
  { value: 'draft', label: 'Brouillons' },
  { value: 'published', label: 'Publiés' },
  { value: 'archived', label: 'Archivés' },
] as const;

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const status = (searchParams.status ?? 'all') as ContentStatus | 'all';
  const articles = await getAllArticlesAdmin({ status });

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 lg:py-10 max-w-6xl mx-auto">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="label-mark">Contenu</span>
          <h1 className="mt-2 font-serif text-3xl md:text-4xl font-medium text-sepia tracking-tight-1">
            Articles
          </h1>
          <p className="mt-2 font-sans text-sm text-pierre">
            {articles.length} {articles.length > 1 ? 'articles' : 'article'}
            {status !== 'all' ? ` · filtré par "${STATUS_CONFIG[status]?.label ?? status}"` : ''}
          </p>
        </div>
        <CreateArticleButton />
      </header>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_FILTERS.map((f) => {
          const active = status === f.value;
          const href = f.value === 'all' ? '/admin/articles' : `/admin/articles?status=${f.value}`;
          return (
            <Link
              key={f.value}
              href={href}
              className={`inline-flex items-center px-3 py-1.5 rounded-sm font-sans text-xs font-semibold uppercase tracking-wide-2 transition-colors ${
                active ? 'bg-sepia text-lin' : 'bg-perle/40 text-pierre hover:bg-perle hover:text-sepia'
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {articles.length === 0 ? (
        <div className="bg-perle/20 border border-perle rounded-md p-12 text-center">
          <p className="font-sans text-sm text-pierre mb-4">
            {status === 'all'
              ? "Aucun article pour l'instant. Créez votre premier brouillon."
              : 'Aucun article ne correspond à ce filtre.'}
          </p>
          {status === 'all' && <CreateArticleButton />}
        </div>
      ) : (
        <div className="bg-lin border border-perle rounded-md overflow-hidden">
          <ul className="divide-y divide-perle">
            {articles.map((article) => (
              <li key={article.id}>
                <Link
                  href={`/admin/articles/${article.id}/edit`}
                  className="flex items-center gap-4 p-4 md:p-5 hover:bg-perle/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                      <span className="font-serif text-base font-medium text-sepia truncate">
                        {article.title}
                      </span>
                      <span
                        className={`font-sans text-[9px] font-semibold uppercase tracking-wide-2 rounded-sm px-1.5 py-0.5 shrink-0 ${
                          STATUS_CONFIG[article.status].classes
                        }`}
                      >
                        {STATUS_CONFIG[article.status].label}
                      </span>
                      {article.is_featured && (
                        <span className="font-sans text-[9px] font-semibold uppercase tracking-wide-2 rounded-sm px-1.5 py-0.5 bg-or-pale/40 text-or-fonce">
                          Phare
                        </span>
                      )}
                    </div>
                    <div className="font-sans text-xs text-pierre truncate">
                      {CATEGORY_LABELS[article.category] ?? article.category} · /{article.slug}
                      {' · '}
                      modifié {formatDateTime(article.updated_at)}
                    </div>
                  </div>
                  <span className="text-pierre shrink-0" aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
