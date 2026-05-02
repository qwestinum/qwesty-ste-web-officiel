'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { updateLeadNotes } from '@/lib/actions/leads';

interface LeadNotesEditorProps {
  leadId: string;
  initialNotes: string;
}

/**
 * Éditeur de notes admin avec sauvegarde explicite.
 * Pas d'auto-save aggressif pour éviter de spammer la DB,
 * mais un bouton "Enregistrer" + indication de modifications non sauvegardées.
 */
export function LeadNotesEditor({ leadId, initialNotes }: LeadNotesEditorProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [savedNotes, setSavedNotes] = useState(initialNotes);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDirty = notes !== savedNotes;

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    };
  }, []);

  function handleSave() {
    startTransition(async () => {
      const result = await updateLeadNotes(leadId, notes);
      if (result.success) {
        setSavedNotes(notes);
        setFeedback('Notes enregistrées');
      } else {
        setFeedback(result.message);
      }
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
      feedbackTimer.current = setTimeout(() => setFeedback(null), 2000);
    });
  }

  return (
    <div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={5}
        maxLength={5000}
        placeholder="Annotations internes : contexte du lead, prochaines actions, qualification…"
        className="w-full bg-lin border border-perle rounded-md px-4 py-3 font-sans text-sm text-sepia placeholder:text-pierre/50 focus:outline-none focus:border-or-fonce focus:ring-2 focus:ring-or/20 transition-colors resize-y"
      />

      <div className="flex items-center justify-between gap-3 mt-3">
        <div className="font-sans text-[11px] text-pierre">
          {isDirty ? (
            <span className="text-or-fonce">Modifications non sauvegardées</span>
          ) : feedback ? (
            <span>{feedback}</span>
          ) : (
            <span>{notes.length} / 5000 caractères</span>
          )}
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={!isDirty || isPending}
          className="px-4 py-2 rounded-sm bg-sepia text-lin font-sans text-xs font-semibold uppercase tracking-wide-2 hover:bg-or-fonce transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPending ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}
