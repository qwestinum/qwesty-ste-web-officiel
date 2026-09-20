import Link from 'next/link';
import type { FlagshipModule } from '@/lib/supabase/types';
import { Emphasis } from '@/components/shared/Emphasis';

interface FlagshipProgrammeProps {
  modules: FlagshipModule[];
}

/**
 * Bloc dédié au programme flagship (6 mois) sur la page Formations.
 * L'ancien pavé sépia pleine largeur est remplacé par la mise en avant
 * de la charte ORQA : fond crème, modules en cartes, les modules clés
 * en carte « chaude » (ivoire + filet jaune).
 */
export function FlagshipProgramme({ modules }: FlagshipProgrammeProps) {
  return (
    <section className="section-padding bg-cream" id="flagship">
      <div className="container-page">
        {/* Header */}
        <div className="mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between md:mb-16">
          <div className="max-w-2xl">
            <span className="tag bg-sun text-ink">
              Programme flagship · 6 mois
            </span>
            <h2 className="mt-6 font-sans text-3xl font-bold leading-display tracking-tight text-ink sm:text-4xl lg:text-5xl">
              IA, Process &amp;<br />
              <Emphasis>Transformation.</Emphasis>
            </h2>
            <p className="mt-6 font-sans text-lg leading-relaxed text-ink-muted">
              Six mois pour former des professionnels capables de transformer
              leur organisation grâce à l&apos;IA — de la stratégie jusqu&apos;à
              l&apos;exécution opérationnelle. Sans jargon, sans hype, avec des
              résultats mesurables.
            </p>
          </div>

          <div className="flex shrink-0 gap-8">
            <FlagshipStat value="6" label="Mois" />
            <FlagshipStat value={modules.length.toString()} label="Modules" />
            <FlagshipStat value="100%" label="Projet réel" />
          </div>
        </div>

        {/* Grille des modules */}
        {modules.length > 0 && (
          <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/#contact" className="btn-primary">
            Candidater au programme
            <span aria-hidden="true">→</span>
          </Link>
          <Link href="/#contact" className="btn-secondary">
            Télécharger le dossier complet
          </Link>
        </div>
      </div>
    </section>
  );
}

function FlagshipStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="stat-rule">
      <div>
        <div className="font-sans text-3xl font-bold leading-none tracking-tight text-ink md:text-4xl">
          {value}
        </div>
        <div className="mt-2 font-sans text-[11px] uppercase tracking-wide-1 text-ink-muted">
          {label}
        </div>
      </div>
    </div>
  );
}

function ModuleCard({ module }: { module: FlagshipModule }) {
  return (
    <div
      className={`h-full p-6 transition-shadow duration-200 hover:shadow-lift md:p-7 ${
        module.is_highlight ? 'card-warm' : 'card-cool'
      }`}
    >
      <div className="font-sans text-[11px] font-bold uppercase tracking-wide-1 text-accent-deep">
        Module {module.module_number}
      </div>
      <h3 className="mt-3 font-sans text-base font-bold leading-snug tracking-tight text-ink md:text-lg">
        {module.title}
      </h3>
      {module.description && (
        <p className="mt-2 font-sans text-xs leading-relaxed text-ink-muted">
          {module.description}
        </p>
      )}
      {module.tag && (
        <p className="mt-3 font-sans text-[10px] uppercase tracking-wide-1 text-ink-muted">
          {module.tag}
        </p>
      )}
    </div>
  );
}
