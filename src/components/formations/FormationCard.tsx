import Link from 'next/link';
import type { Formation } from '@/lib/supabase/types';

interface FormationCardProps {
  formation: Formation;
}

export function FormationCard({ formation }: FormationCardProps) {
  return (
    <Link
      href={`/formations/${formation.slug}`}
      className="card-cool group flex flex-col p-7 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
    >
      {/* Tag niveau + durée */}
      <div className="mb-5 flex items-center justify-between gap-3">
        {formation.level_label && (
          <span className="tag bg-halo text-ink">{formation.level_label}</span>
        )}
        {formation.duration_label && (
          <span className="font-sans text-xs text-ink-muted">
            {formation.duration_label}
          </span>
        )}
      </div>

      <h3 className="font-sans text-xl font-bold leading-snug tracking-tight text-ink md:text-2xl">
        {formation.title}
      </h3>

      {formation.audience && (
        <p className="mt-2 font-sans text-xs italic text-ink-muted">
          {formation.audience}
        </p>
      )}

      {formation.excerpt && (
        <p className="mt-4 flex-1 font-sans text-sm leading-relaxed text-ink-muted">
          {formation.excerpt}
        </p>
      )}

      {/* Footer formats + CTA */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-5">
        {formation.formats && formation.formats.length > 0 && (
          <span className="font-sans text-[10px] uppercase tracking-wide-1 text-ink-muted">
            {formation.formats.join(' · ')}
          </span>
        )}
        <span className="link-arrow ml-auto">
          Découvrir <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
