import Link from 'next/link';
import type { Article } from '@/lib/supabase/types';
import { formatDate } from '@/lib/utils';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured';
}

const CATEGORY_LABELS: Record<string, { label: string; tone: string }> = {
  strategie: { label: 'Stratégie', tone: 'bg-halo text-ink' },
  methode: { label: 'Méthode', tone: 'bg-accent/10 text-accent-deep' },
  'retours-experience': { label: 'Retour d’expérience', tone: 'bg-ink text-cream' },
  'lucidite-ia': { label: 'Lucidité IA', tone: 'bg-sun text-ink' },
};

export function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const cat = CATEGORY_LABELS[article.category] ?? CATEGORY_LABELS.strategie;
  const date = formatDate(article.published_at);

  if (variant === 'featured') {
    return (
      <Link
        href={`/ressources/${article.slug}`}
        className="card-warm group block rounded-3xl p-8 transition-shadow duration-200 hover:shadow-lift md:p-12"
      >
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="tag bg-ink text-cream">Article phare</span>
          <span className={`tag ${cat.tone}`}>{cat.label}</span>
          {date && <span className="font-sans text-xs text-ink-muted">{date}</span>}
        </div>

        <h2 className="max-w-3xl font-sans text-3xl font-bold leading-display tracking-tight text-ink md:text-4xl lg:text-5xl">
          {article.title}
        </h2>

        {article.excerpt && (
          <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-ink-muted md:text-lg">
            {article.excerpt}
          </p>
        )}

        <div className="mt-8 flex items-center gap-4">
          {article.author_name && (
            <span className="font-sans text-xs text-ink-muted">
              Par {article.author_name}
            </span>
          )}
          {article.reading_time_minutes && (
            <>
              <span className="text-ink-muted">·</span>
              <span className="font-sans text-xs text-ink-muted">
                {article.reading_time_minutes} min de lecture
              </span>
            </>
          )}
        </div>

        <div className="mt-8">
          <span className="link-arrow">
            Lire l&apos;article <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
    );
  }

  // Variant default
  return (
    <Link
      href={`/ressources/${article.slug}`}
      className="card-cool group flex flex-col p-7 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
    >
      <div className="mb-5 flex items-center gap-3">
        <span className={`tag ${cat.tone}`}>{cat.label}</span>
        {date && <span className="font-sans text-xs text-ink-muted">{date}</span>}
      </div>

      <h3 className="font-sans text-xl font-bold leading-snug tracking-tight text-ink md:text-2xl">
        {article.title}
      </h3>

      {article.excerpt && (
        <p className="mt-4 flex-1 font-sans text-sm leading-relaxed text-ink-muted">
          {article.excerpt}
        </p>
      )}

      <div className="mt-6 flex items-center justify-between border-t border-hairline pt-5">
        {article.reading_time_minutes && (
          <span className="font-sans text-xs text-ink-muted">
            {article.reading_time_minutes} min de lecture
          </span>
        )}
        <span className="link-arrow">
          Lire <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
