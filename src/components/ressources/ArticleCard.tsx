import Link from 'next/link';
import type { Article } from '@/lib/supabase/types';
import { formatDate } from '@/lib/utils';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured';
}

const CATEGORY_LABELS: Record<string, { label: string; tone: string }> = {
  strategie: { label: 'Stratégie', tone: 'bg-or-pale/40 text-or-fonce' },
  methode: { label: 'Méthode', tone: 'bg-perle/60 text-sepia' },
  'retours-experience': { label: 'Retour d\u2019expérience', tone: 'bg-sepia text-lin' },
  'lucidite-ia': { label: 'Lucidité IA', tone: 'bg-or text-sepia' },
};

export function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const cat = CATEGORY_LABELS[article.category] ?? CATEGORY_LABELS.strategie;
  const date = formatDate(article.published_at);

  if (variant === 'featured') {
    return (
      <Link
        href={`/ressources/${article.slug}`}
        className="group block bg-lin border border-perle rounded-md p-8 md:p-12 transition-all hover:border-pierre/40"
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wide-2 px-2.5 py-1 rounded-sm bg-sepia text-lin">
            Article phare
          </span>
          <span
            className={`font-sans text-[10px] font-semibold uppercase tracking-wide-2 px-2.5 py-1 rounded-sm ${cat.tone}`}
          >
            {cat.label}
          </span>
          {date && <span className="font-sans text-xs text-pierre">{date}</span>}
        </div>

        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal leading-tight-extra tracking-tighter-2 text-sepia max-w-3xl">
          {article.title}
        </h2>

        {article.excerpt && (
          <p className="mt-6 max-w-2xl font-sans text-base md:text-lg leading-relaxed text-pierre">
            {article.excerpt}
          </p>
        )}

        <div className="mt-8 flex items-center gap-4">
          {article.author_name && (
            <span className="font-sans text-xs text-pierre">Par {article.author_name}</span>
          )}
          {article.reading_time_minutes && (
            <>
              <span className="text-pierre">·</span>
              <span className="font-sans text-xs text-pierre">
                {article.reading_time_minutes} min de lecture
              </span>
            </>
          )}
        </div>

        <div className="mt-8">
          <span className="font-sans text-xs font-semibold uppercase tracking-wide-2 text-or-fonce group-hover:text-sepia transition-colors inline-flex items-center gap-1.5">
            Lire l'article <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
    );
  }

  // Variant default
  return (
    <Link
      href={`/ressources/${article.slug}`}
      className="group flex flex-col bg-lin border border-perle rounded-md p-7 transition-all hover:border-pierre/40 hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-3 mb-5">
        <span
          className={`font-sans text-[10px] font-semibold uppercase tracking-wide-2 px-2.5 py-1 rounded-sm ${cat.tone}`}
        >
          {cat.label}
        </span>
        {date && <span className="font-sans text-xs text-pierre">{date}</span>}
      </div>

      <h3 className="font-serif text-xl md:text-2xl font-medium leading-tight tracking-tight-1 text-sepia">
        {article.title}
      </h3>

      {article.excerpt && (
        <p className="mt-4 font-sans text-sm leading-relaxed text-pierre flex-1">
          {article.excerpt}
        </p>
      )}

      <div className="mt-6 pt-5 border-t border-perle flex items-center justify-between">
        {article.reading_time_minutes && (
          <span className="font-sans text-xs text-pierre">
            {article.reading_time_minutes} min de lecture
          </span>
        )}
        <span className="font-sans text-xs font-semibold uppercase tracking-wide-2 text-or-fonce group-hover:text-sepia transition-colors inline-flex items-center gap-1.5">
          Lire <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
