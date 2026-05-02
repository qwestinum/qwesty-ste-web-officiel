import Link from 'next/link';
import type { Article } from '@/lib/supabase/types';
import { formatDate } from '@/lib/utils';

interface ResourcesTeaserProps {
  articles: Article[];
}

const CATEGORY_LABELS: Record<string, { label: string; tone: string }> = {
  strategie: { label: 'Stratégie', tone: 'bg-or-pale/40 text-or-fonce' },
  methode: { label: 'Méthode', tone: 'bg-perle/60 text-sepia' },
  'retours-experience': { label: 'Retour d\u2019expérience', tone: 'bg-sepia text-lin' },
  'lucidite-ia': { label: 'Lucidité IA', tone: 'bg-or text-sepia' },
};

export function ResourcesTeaser({ articles }: ResourcesTeaserProps) {
  if (articles.length === 0) return null;

  return (
    <section className="py-20 md:py-28">
      <div className="container-page">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 md:mb-16 gap-4">
          <div className="max-w-2xl">
            <span className="label-mark">Ressources</span>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl font-normal leading-tight tracking-tighter-2 text-sepia">
              Nos dernières <em className="italic text-or-fonce">analyses.</em>
            </h2>
            <p className="mt-5 font-sans text-base md:text-lg leading-relaxed text-pierre">
              Méthodes, tribunes, cas d\u2019étude et chroniques d\u2019échecs documentés.
            </p>
          </div>
          <Link
            href="/ressources"
            className="font-sans text-xs font-semibold uppercase tracking-wide-2 text-or-fonce hover:text-sepia transition-colors inline-flex items-center gap-2 self-start md:self-auto"
          >
            Toutes les ressources
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ArticleCard({ article }: { article: Article }) {
  const cat = CATEGORY_LABELS[article.category] ?? CATEGORY_LABELS.strategie;
  const date = formatDate(article.published_at);

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
        {date && (
          <span className="font-sans text-xs text-pierre">{date}</span>
        )}
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
