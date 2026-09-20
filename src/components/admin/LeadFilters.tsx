'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const STATUS_FILTERS = [
  { value: 'all', label: 'Tous' },
  { value: 'new', label: 'Nouveaux' },
  { value: 'in-progress', label: 'En cours' },
  { value: 'archived', label: 'Archivés' },
  { value: 'spam', label: 'Spam' },
] as const;

interface LeadFiltersProps {
  currentStatus: string;
  currentSearch: string;
}

export function LeadFilters({ currentStatus, currentSearch }: LeadFiltersProps) {
  const router = useRouter();

  function buildHref(status: string, search: string) {
    const params = new URLSearchParams();
    if (status !== 'all') params.set('status', status);
    if (search.trim()) params.set('q', search.trim());
    const qs = params.toString();
    return `/admin/leads${qs ? `?${qs}` : ''}`;
  }

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = (formData.get('q') as string | null)?.trim() ?? '';
    router.push(buildHref(currentStatus, q));
  }

  return (
    <div className="mb-6 space-y-4">
      {/* Filtres statut */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => {
          const active = currentStatus === filter.value;
          return (
            <Link
              key={filter.value}
              href={buildHref(filter.value, currentSearch)}
              className={cn(
                'inline-flex items-center px-3 py-1.5 rounded-lg font-sans text-xs font-semibold uppercase tracking-wide-2 transition-colors',
                active
                  ? 'bg-ink text-cream'
                  : 'bg-cream/40 text-ink-muted hover:bg-cream hover:text-ink'
              )}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      {/* Recherche */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={currentSearch}
          placeholder="Rechercher par nom, email, entreprise, message…"
          className="flex-1 bg-white border border-hairline rounded-xl px-4 py-2.5 font-sans text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-accent-deep focus:ring-2 focus:ring-accent/20 transition-colors"
        />
        <button
          type="submit"
          className="bg-ink text-cream px-5 py-2.5 rounded-xl font-sans text-xs font-semibold uppercase tracking-wide-2 hover:bg-accent-deep transition-colors"
        >
          Rechercher
        </button>
        {currentSearch && (
          <Link
            href={buildHref(currentStatus, '')}
            className="inline-flex items-center px-3 py-2.5 rounded-xl font-sans text-xs text-ink-muted hover:text-ink transition-colors"
          >
            ✕
          </Link>
        )}
      </form>
    </div>
  );
}
