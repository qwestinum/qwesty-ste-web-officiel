import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllUseCasesAdmin } from '@/lib/queries/admin-content';
import { CreateUseCaseButton } from '@/components/admin/forms/CreateUseCaseButton';
import { formatDateTime } from '@/lib/utils';
import type { ContentStatus } from '@/lib/supabase/types';

export const metadata: Metadata = { title: "Cas d'usage" };
export const dynamic = 'force-dynamic';

const STATUS_CONFIG: Record<ContentStatus, { label: string; classes: string }> = {
  draft: { label: 'Brouillon', classes: 'bg-perle text-sepia' },
  published: { label: 'Publié', classes: 'bg-or text-sepia' },
  archived: { label: 'Archivé', classes: 'bg-sepia text-lin' },
};

const CASE_TYPE_LABELS: Record<string, string> = {
  client: 'Mission client',
  product: 'Solution propriétaire',
};

export default async function AdminUseCasesPage() {
  const cases = await getAllUseCasesAdmin();

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 lg:py-10 max-w-6xl mx-auto">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="label-mark">Contenu</span>
          <h1 className="mt-2 font-serif text-3xl md:text-4xl font-medium text-sepia tracking-tight-1">
            {"Cas d'usage"}
          </h1>
          <p className="mt-2 font-sans text-sm text-pierre">
            {cases.length} {cases.length > 1 ? 'cas' : 'cas'}
          </p>
        </div>
        <CreateUseCaseButton />
      </header>

      {cases.length === 0 ? (
        <div className="bg-perle/20 border border-perle rounded-md p-12 text-center">
          <p className="font-sans text-sm text-pierre mb-4">
            Aucun cas pour l'instant. Créez le premier.
          </p>
          <CreateUseCaseButton />
        </div>
      ) : (
        <div className="bg-lin border border-perle rounded-md overflow-hidden">
          <ul className="divide-y divide-perle">
            {cases.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/admin/use-cases/${c.id}/edit`}
                  className="flex items-center gap-4 p-4 md:p-5 hover:bg-perle/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                      <span className="font-serif text-base font-medium text-sepia truncate">{c.title}</span>
                      <span className={`font-sans text-[9px] font-semibold uppercase tracking-wide-2 rounded-sm px-1.5 py-0.5 shrink-0 ${STATUS_CONFIG[c.status].classes}`}>
                        {STATUS_CONFIG[c.status].label}
                      </span>
                      {c.is_featured && (
                        <span className="font-sans text-[9px] font-semibold uppercase tracking-wide-2 rounded-sm px-1.5 py-0.5 bg-or-pale/40 text-or-fonce shrink-0">
                          Phare
                        </span>
                      )}
                    </div>
                    <div className="font-sans text-xs text-pierre truncate">
                      {CASE_TYPE_LABELS[c.case_type] ?? c.case_type}
                      {c.sector ? ` · ${c.sector}` : ''}
                      {' · '}modifié {formatDateTime(c.updated_at)}
                    </div>
                  </div>
                  <span className="text-pierre shrink-0" aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
