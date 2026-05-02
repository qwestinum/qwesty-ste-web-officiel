'use client';

import { useState, useTransition } from 'react';
import { updateLeadStatus } from '@/lib/actions/leads';
import { cn } from '@/lib/utils';
import type { LeadStatus } from '@/lib/supabase/types';

const STATUSES: Array<{ value: LeadStatus; label: string; description: string }> = [
  { value: 'new', label: 'Nouveau', description: 'À traiter' },
  { value: 'in-progress', label: 'En cours', description: 'Réponse en cours' },
  { value: 'archived', label: 'Archivé', description: 'Traité, plus à voir' },
  { value: 'spam', label: 'Spam', description: 'Indésirable' },
];

interface LeadStatusActionsProps {
  leadId: string;
  currentStatus: LeadStatus;
}

export function LeadStatusActions({ leadId, currentStatus }: LeadStatusActionsProps) {
  const [optimistic, setOptimistic] = useState<LeadStatus>(currentStatus);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick(status: LeadStatus) {
    if (status === optimistic) return;
    const previous = optimistic;
    setOptimistic(status);
    setFeedback(null);

    startTransition(async () => {
      const result = await updateLeadStatus(leadId, status);
      if (!result.success) {
        setOptimistic(previous);
        setFeedback(result.message);
      } else {
        setFeedback(result.message);
        setTimeout(() => setFeedback(null), 2000);
      }
    });
  }

  return (
    <div className="space-y-1.5">
      {STATUSES.map((s) => {
        const active = s.value === optimistic;
        return (
          <button
            key={s.value}
            type="button"
            onClick={() => handleClick(s.value)}
            disabled={isPending && active}
            className={cn(
              'w-full text-left px-3 py-2.5 rounded-sm border transition-colors',
              active
                ? 'border-or bg-or-pale/30 text-sepia'
                : 'border-perle bg-lin text-sepia hover:border-pierre/40 hover:bg-perle/30'
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-sans text-sm font-medium">{s.label}</span>
              {active && (
                <span className="font-sans text-[10px] uppercase tracking-wide-1 text-or-fonce">
                  Actuel
                </span>
              )}
            </div>
            <div className="font-sans text-[11px] text-pierre mt-0.5">{s.description}</div>
          </button>
        );
      })}

      {feedback && (
        <p className="font-sans text-xs text-or-fonce mt-2">{feedback}</p>
      )}
    </div>
  );
}
