import Link from 'next/link';
import type { UseCaseKpi } from '@/lib/supabase/types';
import { Emphasis } from '@/components/shared/Emphasis';

interface ProofProps {
  kpis: UseCaseKpi[];
}

/**
 * Section preuves & résultats.
 * - Affiche jusqu'à 4 KPI dynamiques (issus des cas d'usage Supabase)
 * - Si aucun KPI n'est disponible, on affiche des placeholders élégants
 */
export function Proof({ kpis }: ProofProps) {
  // Limite à 4 KPI pour la grille
  const displayed = kpis.slice(0, 4);
  const shown = displayed.length > 0 ? displayed : PLACEHOLDER_KPIS;

  return (
    <section className="section-padding bg-white">
      <div className="container-page">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* Colonne texte */}
          <div>
            <span className="eyebrow">Résultats mesurés</span>
            <h2 className="mt-4 font-sans text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Des impacts <Emphasis>concrets,</Emphasis> documentés sur nos cas
              clients.
            </h2>
            <p className="mt-6 font-sans text-lg leading-relaxed text-ink-muted">
              Chaque mission Qwestinum produit un livrable concret et mesurable.
              De l&apos;hôtellerie 5 étoiles au cabinet de recrutement, nos cas
              démontrent que l&apos;IA transforme les opérations quand elle est
              déployée avec méthode.
            </p>

            <Link href="/cas-usage" className="btn-primary mt-8">
              Voir tous les cas d&apos;usage
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Colonne KPI */}
          <div className="grid grid-cols-2 gap-4">
            {shown.map((kpi, i) => (
              <KpiCard key={i} kpi={kpi} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function KpiCard({ kpi }: { kpi: UseCaseKpi }) {
  return (
    <div className="card-warm p-6">
      <div className="font-sans text-3xl font-bold leading-none tracking-tight text-accent-deep md:text-4xl">
        {kpi.value}
      </div>
      <div className="mt-3 font-sans text-xs leading-relaxed text-ink-muted">
        {kpi.label}
      </div>
      {kpi.projected && (
        <div className="mt-2 font-sans text-[10px] italic text-ink-muted">
          projection
        </div>
      )}
    </div>
  );
}

const PLACEHOLDER_KPIS: UseCaseKpi[] = [
  { value: '< 2min', label: 'Temps de réponse vs 48h sans IA — cabinet consulting' },
  { value: '−87%', label: 'Charge humaine projetée sur traitement RFQ — hôtellerie 5★', projected: true },
  { value: '1 000', label: 'CVs traités automatiquement / mois — cabinet de recrutement' },
  { value: '67,5%', label: 'Demandes traitées sans intervention humaine — consulting' },
];
