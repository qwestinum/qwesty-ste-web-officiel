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
                'inline-flex items-center px-3 py-1.5 rounded-sm font-sans text-xs font-semibold uppercase tracking-wide-2 transition-colors',
                active
                  ? 'bg-sepia text-lin'
                  : 'bg-perle/40 text-pierre hover:bg-perle hover:text-sepia'
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
          className="flex-1 bg-lin border border-perle rounded-md px-4 py-2.5 font-sans text-sm text-sepia placeholder:text-pierre/50 focus:outline-none focus:border-or-fonce focus:ring-2 focus:ring-or/20 transition-colors"
        />
        <button
          type="submit"
          className="bg-sepia text-lin px-5 py-2.5 rounded-md font-sans text-xs font-semibold uppercase tracking-wide-2 hover:bg-or-fonce transition-colors"
        >
          Rechercher
        </button>
        {currentSearch && (
          <Link
            href={buildHref(currentStatus, '')}
            className="inline-flex items-center px-3 py-2.5 rounded-md font-sans text-xs text-pierre hover:text-sepia transition-colors"
          >
            ✕
          </Link>
        )}
      </form>
    </div>
  );
}
