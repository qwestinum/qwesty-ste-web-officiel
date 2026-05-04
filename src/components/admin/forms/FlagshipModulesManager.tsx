'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  createFlagshipModule,
  updateFlagshipModule,
  deleteFlagshipModule,
  type FlagshipModulePayload,
} from '@/lib/actions/flagship-modules';
import type { FlagshipModule } from '@/lib/supabase/types';

interface FlagshipModulesManagerProps {
  modules: FlagshipModule[];
}

export function FlagshipModulesManager({ modules }: FlagshipModulesManagerProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();

  function showFeedback(msg: string, ok = true) {
    setFeedback({ msg, ok });
    setTimeout(() => setFeedback(null), 3500);
  }

  function handleCreate() {
    startTransition(async () => {
      const result = await createFlagshipModule();
      showFeedback(result.message, result.success);
      if (result.success) router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="font-sans text-sm text-pierre">{modules.length} module{modules.length > 1 ? 's' : ''}</p>
        <button type="button" onClick={handleCreate} disabled={isPending} className="btn-primary !py-2.5 !px-4 disabled:opacity-50">
          {isPending ? 'Création…' : '+ Nouveau module'}
        </button>
      </div>

      {feedback && (
        <div className={`rounded-md border p-3 font-sans text-xs ${feedback.ok ? 'border-or bg-or-pale/20 text-sepia' : 'border-sepia bg-perle/30 text-sepia'}`}>
          {feedback.msg}
        </div>
      )}

      <div className="bg-lin border border-perle rounded-md overflow-hidden">
        {modules.length === 0 ? (
          <div className="p-10 text-center font-sans text-sm text-pierre">Aucun module. Créez le premier.</div>
        ) : (
          <ul className="divide-y divide-perle">
            {modules.map((mod) => (
              <ModuleRow
                key={mod.id}
                module={mod}
                isEditing={editingId === mod.id}
                onEdit={() => setEditingId(editingId === mod.id ? null : mod.id)}
                onSaved={() => { setEditingId(null); router.refresh(); }}
                onDeleted={() => { setEditingId(null); router.refresh(); }}
                onFeedback={showFeedback}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function ModuleRow({
  module, isEditing, onEdit, onSaved, onDeleted, onFeedback,
}: {
  module: FlagshipModule;
  isEditing: boolean;
  onEdit: () => void;
  onSaved: () => void;
  onDeleted: () => void;
  onFeedback: (msg: string, ok: boolean) => void;
}) {
  const [form, setForm] = useState<FlagshipModulePayload>({
    module_number: module.module_number,
    title: module.title,
    description: module.description,
    tag: module.tag,
    is_highlight: module.is_highlight,
    display_order: module.display_order,
  });
  const [isPending, startTransition] = useTransition();

  function updateField<K extends keyof FlagshipModulePayload>(key: K, val: FlagshipModulePayload[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function handleSave() {
    startTransition(async () => {
      const result = await updateFlagshipModule(module.id, form);
      onFeedback(result.message, result.success);
      if (result.success) onSaved();
    });
  }

  function handleDelete() {
    if (!confirm('Supprimer ce module ? Action irréversible.')) return;
    startTransition(async () => {
      const result = await deleteFlagshipModule(module.id);
      onFeedback(result.message, result.success);
      if (result.success) onDeleted();
    });
  }

  return (
    <li>
      <div
        className="flex items-center gap-4 p-4 hover:bg-perle/20 transition-colors cursor-pointer"
        onClick={onEdit}
      >
        <span className="font-serif text-lg font-medium text-or-fonce w-6 shrink-0 text-center">
          {module.module_number}
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-sans text-sm font-medium text-sepia truncate">{module.title}</div>
          {module.tag && (
            <div className="font-sans text-[11px] text-pierre">{module.tag}</div>
          )}
        </div>
        {module.is_highlight && (
          <span className="font-sans text-[9px] font-semibold uppercase tracking-wide-2 bg-or-pale/40 text-or-fonce px-1.5 py-0.5 rounded-sm shrink-0">
            Phare
          </span>
        )}
        <span className="text-pierre text-sm shrink-0" aria-hidden="true">{isEditing ? '▲' : '▼'}</span>
      </div>

      {isEditing && (
        <div className="px-4 pb-5 pt-2 border-t border-perle bg-lin/60 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-sans text-[11px] font-medium uppercase tracking-wide-2 text-pierre mb-1">N°</label>
              <input type="number" value={form.module_number} onChange={(e) => updateField('module_number', Number(e.target.value))} className="input" />
            </div>
            <div>
              <label className="block font-sans text-[11px] font-medium uppercase tracking-wide-2 text-pierre mb-1">Ordre</label>
              <input type="number" value={form.display_order} onChange={(e) => updateField('display_order', Number(e.target.value))} className="input" />
            </div>
          </div>

          <div>
            <label className="block font-sans text-[11px] font-medium uppercase tracking-wide-2 text-pierre mb-1">Titre *</label>
            <input type="text" value={form.title} onChange={(e) => updateField('title', e.target.value)} className="input" />
          </div>

          <div>
            <label className="block font-sans text-[11px] font-medium uppercase tracking-wide-2 text-pierre mb-1">Tag</label>
            <input type="text" value={form.tag ?? ''} onChange={(e) => updateField('tag', e.target.value || null)} placeholder='ex : "Méthode signature"' className="input" />
          </div>

          <div>
            <label className="block font-sans text-[11px] font-medium uppercase tracking-wide-2 text-pierre mb-1">Description</label>
            <textarea value={form.description ?? ''} onChange={(e) => updateField('description', e.target.value || null)} rows={2} className="input" />
          </div>

          <label className="flex items-center gap-2 font-sans text-sm text-sepia">
            <input type="checkbox" checked={form.is_highlight} onChange={(e) => updateField('is_highlight', e.target.checked)} className="accent-or-fonce" />
            Module phare (mis en avant)
          </label>

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={handleSave} disabled={isPending} className="btn-primary !py-2 !px-4 disabled:opacity-50">
              {isPending ? '…' : 'Enregistrer'}
            </button>
            <button type="button" onClick={onEdit} className="px-4 py-2 rounded-sm border border-perle font-sans text-xs text-pierre hover:border-pierre transition-colors">
              Annuler
            </button>
            <button type="button" onClick={handleDelete} disabled={isPending} className="ml-auto px-4 py-2 rounded-sm bg-sepia/10 text-sepia font-sans text-xs hover:bg-sepia hover:text-lin transition-colors disabled:opacity-50">
              Supprimer
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
