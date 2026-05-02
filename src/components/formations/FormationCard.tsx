import Link from 'next/link';
import type { Formation } from '@/lib/supabase/types';

interface FormationCardProps {
  formation: Formation;
}

export function FormationCard({ formation }: FormationCardProps) {
  return (
    <Link
      href={`/formations/${formation.slug}`}
      className="group flex flex-col bg-lin border border-perle rounded-md p-7 transition-all hover:border-pierre/40 hover:-translate-y-0.5"
    >
      {/* Tag niveau + durée */}
      <div className="flex items-center justify-between gap-3 mb-5">
        {formation.level_label && (
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wide-2 px-2.5 py-1 rounded-sm bg-or-pale/40 text-or-fonce">
            {formation.level_label}
          </span>
        )}
        {formation.duration_label && (
          <span className="font-sans text-xs text-pierre">{formation.duration_label}</span>
        )}
      </div>

      <h3 className="font-serif text-xl md:text-2xl font-medium leading-tight tracking-tight-1 text-sepia">
        {formation.title}
      </h3>

      {formation.audience && (
        <p className="mt-2 font-sans text-xs italic text-pierre">
          {formation.audience}
        </p>
      )}

      {formation.excerpt && (
        <p className="mt-4 font-sans text-sm leading-relaxed text-pierre flex-1">
          {formation.excerpt}
        </p>
      )}

      {/* Footer formats + CTA */}
      <div className="mt-6 pt-5 border-t border-perle flex items-center justify-between gap-3 flex-wrap">
        {formation.formats && formation.formats.length > 0 && (
          <span className="font-sans text-[10px] text-pierre uppercase tracking-wide-1">
            {formation.formats.join(' · ')}
          </span>
        )}
        <span className="font-sans text-xs font-semibold uppercase tracking-wide-2 text-or-fonce group-hover:text-sepia transition-colors inline-flex items-center gap-1.5 ml-auto">
          Découvrir <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
