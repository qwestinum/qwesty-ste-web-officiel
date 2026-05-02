import Link from 'next/link';
import type { UseCaseKpi } from '@/lib/supabase/types';

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

  return (
    <section className="py-20 md:py-28">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Colonne texte */}
          <div>
            <span className="label-mark">Résultats mesurés</span>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl font-normal leading-tight tracking-tighter-2 text-sepia">
              Des impacts <em className="italic text-or-fonce">concrets,</em> documentés sur nos cas clients.
            </h2>
            <p className="mt-6 font-sans text-lg leading-relaxed text-pierre">
              Chaque mission Qwestinum produit un livrable concret et mesurable. De l'hôtellerie 5 étoiles au cabinet de recrutement, nos cas démontrent que l'IA transforme les opérations quand elle est déployée avec méthode.
            </p>

            <Link href="/cas-usage" className="btn-primary mt-8">
              Voir tous les cas d'usage
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Colonne KPI */}
          <div className="grid grid-cols-2 gap-4">
            {displayed.length > 0
              ? displayed.map((kpi, i) => <KpiCard key={i} kpi={kpi} accent={ACCENTS[i % ACCENTS.length]} />)
              : PLACEHOLDER_KPIS.map((kpi, i) => <KpiCard key={i} kpi={kpi} accent={ACCENTS[i % ACCENTS.length]} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

const ACCENTS = ['or-fonce', 'or', 'sepia', 'pierre'] as const;

function KpiCard({ kpi, accent }: { kpi: UseCaseKpi; accent: string }) {
  const accentColors: Record<string, string> = {
    'or-fonce': 'text-or-fonce',
    or: 'text-or-fonce',
    sepia: 'text-sepia',
    pierre: 'text-pierre',
  };
  const borderColors: Record<string, string> = {
    'or-fonce': 'before:bg-or-fonce',
    or: 'before:bg-or',
    sepia: 'before:bg-sepia',
    pierre: 'before:bg-pierre',
  };

  return (
    <div
      className={`relative bg-lin border border-perle p-6 rounded-md overflow-hidden before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] ${borderColors[accent]}`}
    >
      <div
        className={`font-serif text-3xl md:text-4xl font-medium leading-tight-extra tracking-tighter-2 ${accentColors[accent]}`}
      >
        {kpi.value}
      </div>
      <div className="mt-2 font-sans text-xs leading-relaxed text-pierre">
        {kpi.label}
      </div>
      {kpi.projected && (
        <div className="mt-2 font-sans text-[10px] italic text-pierre">
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
