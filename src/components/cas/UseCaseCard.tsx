import Link from 'next/link';
import type { UseCase, UseCaseKpi } from '@/lib/supabase/types';

interface UseCaseCardProps {
  useCase: UseCase;
}

const ACCENT_STYLES: Record<UseCase['accent_color'], { dot: string; value: string; tag: string }> = {
  or: { dot: 'bg-or', value: 'text-or-fonce', tag: 'bg-or-pale/40 text-or-fonce' },
  'or-pale': { dot: 'bg-or-pale', value: 'text-or-fonce', tag: 'bg-or-pale/30 text-or-fonce' },
  sepia: { dot: 'bg-sepia', value: 'text-sepia', tag: 'bg-sepia text-lin' },
  pierre: { dot: 'bg-pierre', value: 'text-pierre', tag: 'bg-perle/60 text-sepia' },
};

export function UseCaseCard({ useCase }: UseCaseCardProps) {
  const accent = ACCENT_STYLES[useCase.accent_color] ?? ACCENT_STYLES.or;

  // Solution items et KPI sont stockés en JSON, on les caste avec garde
  const solutionItems = Array.isArray(useCase.solution_items)
    ? (useCase.solution_items as string[]).filter((s) => typeof s === 'string')
    : [];
  const kpis = Array.isArray(useCase.kpis)
    ? (useCase.kpis as UseCaseKpi[]).filter((k) => k && typeof k.value === 'string')
    : [];

  return (
    <Link
      href={`/cas-usage/${useCase.slug}`}
      className="group flex flex-col bg-lin border border-perle rounded-md p-7 md:p-8 transition-all hover:border-pierre/40 hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          {useCase.sector && (
            <span
              className={`font-sans text-[10px] font-semibold uppercase tracking-wide-2 px-2.5 py-1 rounded-sm ${accent.tag}`}
            >
              {useCase.sector}
            </span>
          )}
          {useCase.status_label && (
            <span className="font-sans text-[10px] font-semibold uppercase tracking-wide-2 px-2.5 py-1 rounded-sm border border-perle text-pierre">
              {useCase.status_label}
            </span>
          )}
        </div>
      </div>

      <h3 className="font-serif text-2xl md:text-3xl font-medium leading-tight tracking-tight-1 text-sepia">
        {useCase.title}
      </h3>

      {useCase.subtitle && (
        <p className="mt-3 font-sans text-sm leading-relaxed text-pierre">
          {useCase.subtitle}
        </p>
      )}

      {solutionItems.length > 0 && (
        <ul className="mt-6 pt-6 border-t border-perle space-y-2 flex-1">
          {solutionItems.slice(0, 3).map((item, i) => (
            <li key={i} className="flex gap-3 font-sans text-sm leading-relaxed text-sepia">
              <span className={`block w-1 h-1 rounded-full ${accent.dot} mt-2 shrink-0`} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      {kpis.length > 0 && (
        <div className="mt-6 pt-6 border-t border-perle grid grid-cols-3 gap-3">
          {kpis.slice(0, 3).map((kpi, i) => (
            <div key={i}>
              <div
                className={`font-serif text-xl md:text-2xl font-medium leading-tight-extra tracking-tighter-2 ${accent.value}`}
              >
                {kpi.value}
              </div>
              <div className="mt-1 font-sans text-[10px] leading-snug text-pierre">
                {kpi.label}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-5 border-t border-perle">
        <span className="font-sans text-xs font-semibold uppercase tracking-wide-2 text-or-fonce group-hover:text-sepia transition-colors inline-flex items-center gap-1.5">
          Lire le cas <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
