import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLeadById } from '@/lib/queries/leads';
import { LeadStatusPill } from '@/components/admin/LeadStatusPill';
import { LeadStatusActions } from '@/components/admin/LeadStatusActions';
import { LeadNotesEditor } from '@/components/admin/LeadNotesEditor';
import { formatDateTime } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const SUBJECT_LABELS: Record<string, string> = {
  general: 'Demande générale',
  diagnostic: 'Diagnostic IA',
  formation: 'Formations',
  partnership: 'Partenariat',
  press: 'Presse / Média',
  other: 'Autre',
};

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const lead = await getLeadById(params.id);
  return { title: lead ? `Lead — ${lead.full_name}` : 'Lead introuvable' };
}

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const lead = await getLeadById(params.id);
  if (!lead) notFound();

  const replyMailto = `mailto:${lead.email}?subject=${encodeURIComponent(`Re: Votre demande Qwestinum (${SUBJECT_LABELS[lead.subject] ?? ''})`)}`;

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 lg:py-10 max-w-4xl mx-auto">

      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-wide-2 text-ink-muted hover:text-ink transition-colors mb-6"
      >
        <span aria-hidden="true">←</span> Tous les leads
      </Link>

      {/* Header lead */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wide-2 px-2.5 py-1 rounded-lg bg-sun/40 text-accent-deep">
            {SUBJECT_LABELS[lead.subject] ?? lead.subject}
          </span>
          <LeadStatusPill status={lead.status} />
          <span className="font-sans text-xs text-ink-muted">
            Reçu le {formatDateTime(lead.created_at)}
          </span>
        </div>

        <h1 className="font-bold text-3xl md:text-4xl text-ink tracking-tight-1">
          {lead.full_name}
        </h1>
        {lead.company && (
          <p className="mt-1 font-sans text-base text-ink-muted">{lead.company}</p>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Colonne principale : message + notes */}
        <div className="lg:col-span-2 space-y-6">

          {/* Message */}
          <section className="bg-white border border-hairline rounded-xl p-6 md:p-7">
            <h2 className="eyebrow mb-3">Message</h2>
            <div className="font-sans text-base leading-relaxed text-ink whitespace-pre-wrap">
              {lead.message}
            </div>
          </section>

          {/* Notes admin */}
          <section className="bg-cream/30 border border-hairline rounded-xl p-6 md:p-7">
            <h2 className="eyebrow mb-3">Notes internes</h2>
            <LeadNotesEditor leadId={lead.id} initialNotes={lead.notes ?? ''} />
          </section>
        </div>

        {/* Colonne latérale : actions + infos */}
        <aside className="space-y-6">

          {/* Actions principales */}
          <div className="bg-white border border-hairline rounded-xl p-5">
            <h2 className="eyebrow mb-3">Répondre</h2>
            <a
              href={replyMailto}
              className="btn-primary w-full !py-3 mb-3"
            >
              Répondre par email
              <span aria-hidden="true">→</span>
            </a>
            <p className="font-sans text-[11px] text-ink-muted">
              Ouvre votre client mail avec l'objet et le destinataire pré-remplis.
            </p>
          </div>

          {/* Statut */}
          <div className="bg-white border border-hairline rounded-xl p-5">
            <h2 className="eyebrow mb-3">Changer le statut</h2>
            <LeadStatusActions leadId={lead.id} currentStatus={lead.status} />
          </div>

          {/* Coordonnées */}
          <div className="bg-white border border-hairline rounded-xl p-5">
            <h2 className="eyebrow mb-3">Coordonnées</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-[10px] uppercase tracking-wide-1 text-ink-muted mb-0.5">Email</dt>
                <dd>
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-accent-deep hover:text-ink transition-colors break-all"
                  >
                    {lead.email}
                  </a>
                </dd>
              </div>
              {lead.phone && (
                <div>
                  <dt className="text-[10px] uppercase tracking-wide-1 text-ink-muted mb-0.5">Téléphone</dt>
                  <dd>
                    <a
                      href={`tel:${lead.phone.replace(/\s/g, '')}`}
                      className="text-ink hover:text-accent-deep transition-colors"
                    >
                      {lead.phone}
                    </a>
                  </dd>
                </div>
              )}
              {lead.company && (
                <div>
                  <dt className="text-[10px] uppercase tracking-wide-1 text-ink-muted mb-0.5">Entreprise</dt>
                  <dd className="text-ink">{lead.company}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Métadonnées techniques */}
          <details className="bg-cream/20 border border-hairline rounded-xl p-5 group">
            <summary className="eyebrow cursor-pointer list-none flex items-center justify-between">
              <span>Métadonnées</span>
              <span className="font-sans text-[10px] text-ink-muted group-open:rotate-180 transition-transform">▾</span>
            </summary>
            <dl className="mt-4 space-y-2 text-xs font-mono text-ink-muted">
              <div>
                <dt className="text-[10px] uppercase">ID</dt>
                <dd className="break-all">{lead.id}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase">Source</dt>
                <dd>{lead.source ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase">IP (hash)</dt>
                <dd className="break-all">{lead.ip_hash ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase">User agent</dt>
                <dd className="break-all">{lead.user_agent ?? '—'}</dd>
              </div>
            </dl>
          </details>
        </aside>
      </div>
    </div>
  );
}
