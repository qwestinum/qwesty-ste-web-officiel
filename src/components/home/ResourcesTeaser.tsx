import Link from 'next/link';
import type { Article } from '@/lib/supabase/types';
import { formatDate } from '@/lib/utils';
import { Emphasis } from '@/components/shared/Emphasis';

interface ResourcesTeaserProps {
  articles: Article[];
}

const CATEGORY_LABELS: Record<string, { label: string; tone: string }> = {
  strategie: { label: 'Stratégie', tone: 'bg-halo text-ink' },
  methode: { label: 'Méthode', tone: 'bg-accent/10 text-accent-deep' },
  'retours-experience': { label: 'Retour d’expérience', tone: 'bg-ink text-cream' },
  'lucidite-ia': { label: 'Lucidité IA', tone: 'bg-sun text-ink' },
};

export function ResourcesTeaser({ articles }: ResourcesTeaserProps) {
  if (articles.length === 0) return null;

  return (
    <section className="section-padding bg-white">
      <div className="container-page">

        <div className="mb-14 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="eyebrow">Ressources</span>
            <h2 className="mt-4 font-sans text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Nos dernières <Emphasis>analyses.</Emphasis>
            </h2>
            <p className="mt-5 font-sans text-base leading-relaxed text-ink-muted md:text-lg">
              Méthodes, tribunes, cas d&apos;étude et chroniques d&apos;échecs
              documentés.
            </p>
          </div>
          <Link href="/ressources" className="btn-link self-start text-[15px] md:self-auto">
            Toutes les ressources
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {articles.map((article) => (
            <ArticleTeaserCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ArticleTeaserCard({ article }: { article: Article }) {
  const cat = CATEGORY_LABELS[article.category] ?? CATEGORY_LABELS.strategie;
  const date = formatDate(article.published_at);

  return (
    <Link
      href={`/ressources/${article.slug}`}
      className="card-cool group flex flex-col p-7 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
    >
      <div className="mb-5 flex items-center gap-3">
        <span
          className={`rounded-full px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-eyebrow ${cat.tone}`}
        >
          {cat.label}
        </span>
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
        <span className="inline-flex items-center gap-1.5 font-sans text-[15px] font-bold text-ink underline decoration-accent decoration-2 underline-offset-[6px] transition-colors group-hover:decoration-accent-deep">
          Lire <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
