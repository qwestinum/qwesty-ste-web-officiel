import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllFormationsAdmin } from '@/lib/queries/admin-content';
import { CreateFormationButton } from '@/components/admin/forms/CreateFormationButton';
import { formatDateTime } from '@/lib/utils';
import type { ContentStatus } from '@/lib/supabase/types';

export const metadata: Metadata = { title: 'Formations' };
export const dynamic = 'force-dynamic';

const STATUS_CONFIG: Record<ContentStatus, { label: string; classes: string }> = {
  draft: { label: 'Brouillon', classes: 'bg-cream text-ink' },
  published: { label: 'Publié', classes: 'bg-accent text-ink' },
  archived: { label: 'Archivé', classes: 'bg-ink text-cream' },
};

export default async function AdminFormationsPage() {
  const formations = await getAllFormationsAdmin();

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 lg:py-10 max-w-6xl mx-auto">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="eyebrow">Contenu</span>
          <h1 className="mt-2 font-bold text-3xl md:text-4xl text-ink tracking-tight-1">
            Formations
          </h1>
          <p className="mt-2 font-sans text-sm text-ink-muted">
            {formations.length} {formations.length > 1 ? 'formations' : 'formation'}
          </p>
        </div>
        <CreateFormationButton />
      </header>

      {formations.length === 0 ? (
        <div className="bg-cream/20 border border-hairline rounded-xl p-12 text-center">
          <p className="font-sans text-sm text-ink-muted mb-4">
            Aucune formation. Créez la première.
          </p>
          <CreateFormationButton />
        </div>
      ) : (
        <div className="bg-white border border-hairline rounded-xl overflow-hidden">
          <ul className="divide-y divide-hairline">
            {formations.map((f) => (
              <li key={f.id}>
                <Link
                  href={`/admin/formations/${f.id}/edit`}
                  className="flex items-center gap-4 p-4 md:p-5 hover:bg-cream/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                      <span className="font-bold text-base text-ink truncate">{f.title}</span>
                      <span className={`font-sans text-[9px] font-semibold uppercase tracking-wide-2 rounded-lg px-1.5 py-0.5 shrink-0 ${STATUS_CONFIG[f.status].classes}`}>
                        {STATUS_CONFIG[f.status].label}
                      </span>
                      {f.is_flagship && (
                        <span className="font-sans text-[9px] font-semibold uppercase tracking-wide-2 rounded-lg px-1.5 py-0.5 bg-accent text-ink shrink-0">
                          Flagship
                        </span>
                      )}
                    </div>
                    <div className="font-sans text-xs text-ink-muted truncate">
                      {f.level_label ? `${f.level_label} · ` : ''}
                      {f.duration_label ? `${f.duration_label} · ` : ''}
                      /{f.slug}
                      {' · '}modifié {formatDateTime(f.updated_at)}
                    </div>
                  </div>
                  <span className="text-ink-muted shrink-0" aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
