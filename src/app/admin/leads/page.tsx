import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllLeads } from '@/lib/queries/leads';
import { LeadStatusPill } from '@/components/admin/LeadStatusPill';
import { LeadFilters } from '@/components/admin/LeadFilters';
import { formatDateTime } from '@/lib/utils';
import type { LeadStatus } from '@/lib/supabase/types';

export const metadata: Metadata = { title: 'Leads' };
export const dynamic = 'force-dynamic';

const SUBJECT_LABELS: Record<string, string> = {
  general: 'Demande générale',
  diagnostic: 'Diagnostic',
  formation: 'Formations',
  partnership: 'Partenariat',
  press: 'Presse',
  other: 'Autre',
};

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: { status?: string; q?: string };
}) {
  const status = (searchParams.status ?? 'all') as LeadStatus | 'all';
  const search = searchParams.q ?? '';

  const leads = await getAllLeads({ status, search });

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 lg:py-10 max-w-6xl mx-auto">

      <header className="mb-8">
        <span className="label-mark">Contenu</span>
        <h1 className="mt-2 font-serif text-3xl md:text-4xl font-medium text-sepia tracking-tight-1">
          Leads
        </h1>
        <p className="mt-2 font-sans text-sm text-pierre">
          {leads.length} {leads.length > 1 ? 'leads' : 'lead'}
          {status !== 'all' ? ` · filtré par "${status}"` : ''}
          {search ? ` · recherche "${search}"` : ''}
        </p>
      </header>

      <LeadFilters currentStatus={status} currentSearch={search} />

      {leads.length === 0 ? (
        <div className="bg-perle/20 border border-perle rounded-md p-12 text-center">
          <p className="font-sans text-sm text-pierre">
            Aucun lead ne correspond aux filtres actuels.
          </p>
          {(status !== 'all' || search) && (
            <Link
              href="/admin/leads"
              className="mt-3 inline-block font-sans text-xs font-semibold uppercase tracking-wide-2 text-or-fonce hover:text-sepia transition-colors"
            >
              Réinitialiser les filtres
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-lin border border-perle rounded-md overflow-hidden">
          {/* Vue desktop : table */}
          <table className="hidden md:table w-full text-sm">
            <thead className="bg-perle/40 border-b border-perle">
              <tr>
                <Th>Date</Th>
                <Th>Nom</Th>
                <Th>Email</Th>
                <Th>Sujet</Th>
                <Th>Statut</Th>
                <Th align="right">Action</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-perle">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-perle/20 transition-colors">
                  <Td className="text-pierre tabular-nums whitespace-nowrap">
                    {formatDateTime(lead.created_at)}
                  </Td>
                  <Td className="font-medium text-sepia">
                    {lead.full_name}
                    {lead.company && (
                      <span className="block font-normal text-xs text-pierre">
                        {lead.company}
                      </span>
                    )}
                  </Td>
                  <Td>
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-or-fonce hover:text-sepia transition-colors"
                    >
                      {lead.email}
                    </a>
                  </Td>
                  <Td className="text-sepia">
                    {SUBJECT_LABELS[lead.subject] ?? lead.subject}
                  </Td>
                  <Td>
                    <LeadStatusPill status={lead.status} />
                  </Td>
                  <Td align="right">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="font-sans text-xs font-semibold uppercase tracking-wide-2 text-or-fonce hover:text-sepia transition-colors"
                    >
                      Ouvrir →
                    </Link>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Vue mobile : liste de cards */}
          <ul className="md:hidden divide-y divide-perle">
            {leads.map((lead) => (
              <li key={lead.id}>
                <Link
                  href={`/admin/leads/${lead.id}`}
                  className="block p-4 hover:bg-perle/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <div className="font-sans text-sm font-medium text-sepia truncate">
                        {lead.full_name}
                      </div>
                      <div className="font-sans text-xs text-pierre truncate">
                        {lead.email}
                      </div>
                    </div>
                    <LeadStatusPill status={lead.status} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-pierre">
                    <span>{SUBJECT_LABELS[lead.subject] ?? lead.subject}</span>
                    <span className="tabular-nums">
                      {formatDateTime(lead.created_at)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Th({
  children,
  align = 'left',
}: {
  children: React.ReactNode;
  align?: 'left' | 'right';
}) {
  return (
    <th
      className={`px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-wide-2 text-pierre text-${align}`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className = '',
  align = 'left',
}: {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'right';
}) {
  return (
    <td className={`px-4 py-3 font-sans text-sm text-${align} ${className}`}>
      {children}
    </td>
  );
}
