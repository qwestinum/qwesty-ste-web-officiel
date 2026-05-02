import Link from 'next/link';
import type { FlagshipModule } from '@/lib/supabase/types';

interface FlagshipProgrammeProps {
  modules: FlagshipModule[];
}

/**
 * Bloc dédié au programme flagship (6 mois) sur la page Formations.
 * Bloc sépia plein largeur, modules en grille.
 */
export function FlagshipProgramme({ modules }: FlagshipProgrammeProps) {
  return (
    <section className="bg-sepia text-lin py-20 md:py-28 relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent 0px, transparent 30px, #D4A82C 30px, #D4A82C 31px)',
        }}
      />

      <div className="container-page relative">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14 md:mb-16">
          <div className="max-w-2xl">
            <span className="inline-block font-sans text-[11px] font-semibold uppercase tracking-wide-2 text-sepia bg-or px-3 py-1.5 rounded-sm">
              Programme flagship · 6 mois
            </span>
            <h2 className="mt-6 font-serif text-4xl md:text-5xl lg:text-6xl font-normal leading-tight-extra tracking-tighter-2 text-lin">
              IA, Process &<br />
              <em className="italic text-or">Transformation.</em>
            </h2>
            <p className="mt-6 font-sans text-lg leading-relaxed text-perle">
              Six mois pour former des professionnels capables de transformer leur organisation grâce à l'IA — de la stratégie jusqu'à l'exécution opérationnelle. Sans jargon, sans hype, avec des résultats mesurables.
            </p>
          </div>

          <div className="flex gap-8 shrink-0">
            <FlagshipStat value="6" label="Mois" />
            <FlagshipStat value={modules.length.toString()} label="Modules" />
            <FlagshipStat value="100%" label="Projet réel" />
          </div>
        </div>

        {/* Grille des modules */}
        {modules.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-pierre/30 mb-12">
            {modules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="flex flex-wrap gap-4 items-center">
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 rounded-sm bg-or px-7 py-4 font-sans text-xs font-semibold uppercase tracking-wide-2 text-sepia transition-all hover:bg-or-pale hover:-translate-y-0.5"
          >
            Candidater au programme
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 rounded-sm border border-perle/30 px-7 py-4 font-sans text-xs font-medium uppercase tracking-wide-2 text-lin hover:border-or hover:text-or transition-colors"
          >
            Télécharger le dossier complet
          </Link>
        </div>
      </div>
    </section>
  );
}

function FlagshipStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-serif text-3xl md:text-4xl font-medium leading-none tracking-tighter-2 text-or">
        {value}
      </div>
      <div className="mt-2 font-sans text-[11px] uppercase tracking-wide-1 text-perle">
        {label}
      </div>
    </div>
  );
}

function ModuleCard({ module }: { module: FlagshipModule }) {
  return (
    <div
      className={`bg-sepia p-6 md:p-7 transition-colors duration-200 ${
        module.is_highlight ? 'bg-or/[0.06] border-l-2 border-or' : 'hover:bg-or/[0.04]'
      }`}
    >
      <div className="font-sans text-[11px] font-semibold uppercase tracking-wide-1 text-or">
        Module {module.module_number}
      </div>
      <h3 className="mt-3 font-serif text-base md:text-lg font-medium leading-tight tracking-tight-1 text-lin">
        {module.title}
      </h3>
      {module.description && (
        <p className="mt-2 font-sans text-xs leading-relaxed text-perle">
          {module.description}
        </p>
      )}
      {module.tag && (
        <p className="mt-3 font-sans text-[10px] uppercase tracking-wide-1 text-pierre">
          {module.tag}
        </p>
      )}
    </div>
  );
}
