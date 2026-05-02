import type { LeadStatus } from '@/lib/supabase/types';

const STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; classes: string }
> = {
  new: { label: 'Nouveau', classes: 'bg-or text-sepia' },
  'in-progress': { label: 'En cours', classes: 'bg-or-pale/60 text-or-fonce' },
  archived: { label: 'Archivé', classes: 'bg-perle text-pierre' },
  spam: { label: 'Spam', classes: 'bg-sepia text-lin' },
};

interface LeadStatusPillProps {
  status: LeadStatus;
  size?: 'xs' | 'sm';
}

export function LeadStatusPill({ status, size = 'sm' }: LeadStatusPillProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.new;
  const sizeClasses = size === 'xs' ? 'text-[9px] px-1.5 py-0.5' : 'text-[10px] px-2 py-0.5';

  return (
    <span
      className={`inline-flex items-center font-sans font-semibold uppercase tracking-wide-2 rounded-sm ${sizeClasses} ${config.classes}`}
    >
      {config.label}
    </span>
  );
}
