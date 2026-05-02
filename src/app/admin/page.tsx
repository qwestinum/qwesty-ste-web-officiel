import type { Metadata } from 'next';
import Link from 'next/link';
import {
  getLeadsActivityLast14Days,
  getLeadsCounters,
  getRecentLeads,
} from '@/lib/queries/leads';
import { ActivityChart } from '@/components/admin/ActivityChart';
import { LeadStatusPill } from '@/components/admin/LeadStatusPill';
import { formatDateTime } from '@/lib/utils';

export const metadata: Metadata = { title: 'Tableau de bord' };
export const dynamic = 'force-dynamic';

const SUBJECT_LABELS: Record<string, string> = {
  general: 'Demande générale',
  diagnostic: 'Diagnostic',
  formation: 'Formations',
  partnership: 'Partenariat',
  press: 'Presse',
  other: 'Autre',
};

export default async function AdminDashboardPage() {
  const [counters, activity, recent] = await Promise.all([
    getLeadsCounters(),
    getLeadsActivityLast14Days(),
    getRecentLeads(5),
  ]);

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 lg:py-10 max-w-6xl mx-auto">

      {/* Page header */}
      <header className="mb-10">
        <span className="label-mark">Pilotage</span>
        <h1 className="mt-2 font-serif text-3xl md:text-4xl font-medium text-sepia tracking-tight-1">
          Tableau de bord
        </h1>
        <p className="mt-2 font-sans text-sm text-pierre">
          Vue d'ensemble de l'activité commerciale Qwestinum.
        </p>
      </header>

      {/* Counters */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        <Counter label="Total leads" value={counters.total} accent="sepia" />
        <Counter label="Nouveaux" value={counters.new} accent="or" highlight={counters.new > 0} />
        <Counter label="En cours" value={counters.inProgress} accent="or-pale" />
        <Counter label="Archivés" value={counters.archived} accent="pierre" />
      </section>

      {/* Activity chart */}
      <section className="bg-perle/30 border border-perle rounded-md p-6 md:p-8 mb-10">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <h2 className="font-serif text-xl font-medium text-sepia tracking-tight-1">
              Activité — 14 derniers jours
            </h2>
            <p className="mt-1 font-sans text-xs text-pierre">
              Nombre de leads reçus par jour
            </p>
          </div>
          <Link
            href="/admin/leads"
            className="font-sans text-xs font-semibold uppercase tracking-wide-2 text-or-fonce hover:text-sepia transition-colors"
          >
            Tous les leads →
          </Link>
        </div>
        <ActivityChart data={activity} />
      </section>

      {/* Derniers leads */}
      <section>
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-serif text-xl font-medium text-sepia tracking-tight-1">
            Derniers leads
          </h2>
          {recent.length > 0 && (
            <Link
              href="/admin/leads"
              className="font-sans text-xs font-semibold uppercase tracking-wide-2 text-or-fonce hover:text-sepia transition-colors"
            >
              Voir tout →
            </Link>
          )}
        </div>

        {recent.length === 0 ? (
          <div className="bg-perle/20 border border-perle rounded-md p-12 text-center">
            <p className="font-sans text-sm text-pierre">
              Aucun lead pour l'instant. Les nouvelles demandes apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="bg-lin border border-perle rounded-md overflow-hidden">
            <ul className="divide-y divide-perle">
              {recent.map((lead) => (
                <li key={lead.id}>
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="flex items-center gap-4 p-4 hover:bg-perle/30 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-sans text-sm font-medium text-sepia truncate">
                          {lead.full_name}
                        </span>
                        <LeadStatusPill status={lead.status} size="xs" />
                      </div>
                      <div className="font-sans text-xs text-pierre truncate">
                        {SUBJECT_LABELS[lead.subject] ?? lead.subject} · {lead.email}
                        {lead.company ? ` · ${lead.company}` : ''}
                      </div>
                    </div>
                    <div className="font-sans text-xs text-pierre shrink-0 hidden sm:block">
                      {formatDateTime(lead.created_at)}
                    </div>
                    <span className="text-pierre shrink-0" aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}

function Counter({
  label,
  value,
  accent,
  highlight = false,
}: {
  label: string;
  value: number;
  accent: 'sepia' | 'or' | 'or-pale' | 'pierre';
  highlight?: boolean;
}) {
  const accentClasses: Record<string, string> = {
    sepia: 'border-l-sepia',
    or: 'border-l-or',
    'or-pale': 'border-l-or-pale',
    pierre: 'border-l-pierre',
  };

  return (
    <div
      className={`bg-lin border border-perle border-l-2 ${accentClasses[accent]} rounded-md p-5 ${
        highlight ? 'ring-1 ring-or/30' : ''
      }`}
    >
      <div className="font-sans text-[11px] uppercase tracking-wide-2 text-pierre mb-2">
        {label}
      </div>
      <div className="font-serif text-3xl font-medium text-sepia tracking-tight-1 leading-none">
        {value}
      </div>
    </div>
  );
}
