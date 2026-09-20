import type { LeadStatus } from '@/lib/supabase/types';

const STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; classes: string }
> = {
  new: { label: 'Nouveau', classes: 'bg-accent text-ink' },
  'in-progress': { label: 'En cours', classes: 'bg-sun/60 text-accent-deep' },
  archived: { label: 'Archivé', classes: 'bg-cream text-ink-muted' },
  spam: { label: 'Spam', classes: 'bg-ink text-cream' },
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
      className={`inline-flex items-center font-sans font-semibold uppercase tracking-wide-2 rounded-lg ${sizeClasses} ${config.classes}`}
    >
      {config.label}
    </span>
  );
}
