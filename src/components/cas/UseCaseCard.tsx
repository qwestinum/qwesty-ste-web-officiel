import Link from 'next/link';
import type { UseCase, UseCaseKpi } from '@/lib/supabase/types';

interface UseCaseCardProps {
  useCase: UseCase;
}

/**
 * Les clés (`or`, `sepia`…) viennent de la colonne `accent_color` en base :
 * on les conserve telles quelles et on ne remappe que les styles vers la
 * nouvelle palette, pour ne pas toucher au schéma Supabase.
 */
const ACCENT_STYLES: Record<UseCase['accent_color'], { dot: string; value: string; tag: string }> = {
  or: { dot: 'bg-sun', value: 'text-accent-deep', tag: 'bg-halo text-ink' },
  'or-pale': { dot: 'bg-sun-light', value: 'text-accent-deep', tag: 'bg-halo text-ink' },
  sepia: { dot: 'bg-ink', value: 'text-ink', tag: 'bg-ink text-cream' },
  pierre: { dot: 'bg-accent', value: 'text-accent-deep', tag: 'bg-accent/10 text-accent-deep' },
};

export function UseCaseCard({ useCase }: UseCaseCardProps) {
  const accent = ACCENT_STYLES[useCase.accent_color] ?? ACCENT_STYLES.or;

  // Casts via unknown pour Json -> types métier (TypeScript strict)
  const solutionItems = Array.isArray(useCase.solution_items)
    ? (useCase.solution_items as unknown as string[]).filter(
        (s) => typeof s === 'string'
      )
    : [];

  const kpis = Array.isArray(useCase.kpis)
    ? (useCase.kpis as unknown as UseCaseKpi[]).filter(
        (k) => k && typeof k === 'object' && typeof k.value === 'string'
      )
    : [];

  return (
    <Link
      href={`/cas-usage/${useCase.slug}`}
      className="card-cool group flex flex-col p-7 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift md:p-8"
    >
      <div className="mb-6 flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {useCase.sector && (
            <span className={`tag ${accent.tag}`}>{useCase.sector}</span>
          )}
          {useCase.status_label && (
            <span className="tag border border-hairline text-ink-muted">
              {useCase.status_label}
            </span>
          )}
        </div>
      </div>

      <h3 className="font-sans text-2xl font-bold leading-snug tracking-tight text-ink md:text-3xl">
        {useCase.title}
      </h3>

      {useCase.subtitle && (
        <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">
          {useCase.subtitle}
        </p>
      )}

      {solutionItems.length > 0 && (
        <ul className="mt-6 flex-1 space-y-2 border-t border-hairline pt-6">
          {solutionItems.slice(0, 3).map((item, i) => (
            <li key={i} className="flex gap-3 font-sans text-sm leading-relaxed text-ink">
              <span className={`mt-[0.45rem] block size-1.5 shrink-0 rounded-full ${accent.dot}`} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      {kpis.length > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-3 border-t border-hairline pt-6">
          {kpis.slice(0, 3).map((kpi, i) => (
            <div key={i}>
              <div
                className={`font-sans text-xl font-bold leading-none tracking-tight md:text-2xl ${accent.value}`}
              >
                {kpi.value}
              </div>
              <div className="mt-1.5 font-sans text-[10px] leading-snug text-ink-muted">
                {kpi.label}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 border-t border-hairline pt-5">
        <span className="link-arrow">
          Lire le cas <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
