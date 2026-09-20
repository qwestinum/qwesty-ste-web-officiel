'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  createPartner,
  updatePartner,
  deletePartner,
  type PartnerPayload,
} from '@/lib/actions/partners';
import { ImageUploadField } from './ImageUploadField';
import type { Partner } from '@/lib/supabase/types';

interface PartnersManagerProps {
  partners: Partner[];
}

export function PartnersManager({ partners }: PartnersManagerProps) {
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
      const result = await createPartner();
      showFeedback(result.message, result.success);
      if (result.success && result.id) {
        router.refresh();
        setEditingId(result.id);
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="font-sans text-sm text-ink-muted">{partners.length} partenaire{partners.length > 1 ? 's' : ''}</p>
        <button type="button" onClick={handleCreate} disabled={isPending} className="btn-primary !py-2.5 !px-4 disabled:opacity-50">
          {isPending ? 'Création…' : '+ Nouveau partenaire'}
        </button>
      </div>

      {feedback && (
        <div className={`rounded-xl border p-3 font-sans text-xs ${feedback.ok ? 'border-accent bg-sun/20 text-ink' : 'border-ink bg-cream/30 text-ink'}`}>
          {feedback.msg}
        </div>
      )}

      <div className="bg-white border border-hairline rounded-xl overflow-hidden">
        {partners.length === 0 ? (
          <div className="p-10 text-center font-sans text-sm text-ink-muted">Aucun partenaire. Créez le premier.</div>
        ) : (
          <ul className="divide-y divide-hairline">
            {partners.map((partner) => (
              <PartnerRow
                key={partner.id}
                partner={partner}
                isEditing={editingId === partner.id}
                onEdit={() => setEditingId(editingId === partner.id ? null : partner.id)}
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

function PartnerRow({
  partner, isEditing, onEdit, onSaved, onDeleted, onFeedback,
}: {
  partner: Partner;
  isEditing: boolean;
  onEdit: () => void;
  onSaved: () => void;
  onDeleted: () => void;
  onFeedback: (msg: string, ok: boolean) => void;
}) {
  const [form, setForm] = useState<PartnerPayload>({
    name: partner.name,
    logo_url: partner.logo_url,
    logo_svg: partner.logo_svg,
    website_url: partner.website_url,
    description: partner.description,
    display_order: partner.display_order,
    is_active: partner.is_active,
  });
  const [isPending, startTransition] = useTransition();

  function updateField<K extends keyof PartnerPayload>(key: K, val: PartnerPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function handleSave() {
    startTransition(async () => {
      const result = await updatePartner(partner.id, form);
      onFeedback(result.message, result.success);
      if (result.success) onSaved();
    });
  }

  function handleDelete() {
    if (!confirm('Supprimer ce partenaire ? Action irréversible.')) return;
    startTransition(async () => {
      const result = await deletePartner(partner.id);
      onFeedback(result.message, result.success);
      if (result.success) onDeleted();
    });
  }

  return (
    <li>
      <div
        className="flex items-center gap-4 p-4 hover:bg-cream/20 transition-colors cursor-pointer"
        onClick={onEdit}
      >
        {form.logo_url ? (
          <img src={form.logo_url} alt="" className="h-8 w-8 object-contain shrink-0" />
        ) : (
          <div className="h-8 w-8 rounded-lg bg-cream/60 shrink-0 flex items-center justify-center">
            <span className="font-bold text-sm text-ink-muted">{partner.name[0]}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-sans text-sm font-semibold text-ink">{partner.name}</div>
          {partner.website_url && (
            <div className="font-sans text-[11px] text-ink-muted truncate">{partner.website_url}</div>
          )}
        </div>
        <span className={`font-sans text-[9px] font-semibold uppercase tracking-wide-2 px-1.5 py-0.5 rounded-lg shrink-0 ${partner.is_active ? 'bg-accent/20 text-accent-deep' : 'bg-cream text-ink-muted'}`}>
          {partner.is_active ? 'Actif' : 'Inactif'}
        </span>
        <span className="text-ink-muted text-sm shrink-0" aria-hidden="true">{isEditing ? '▲' : '▼'}</span>
      </div>

      {isEditing && (
        <div className="px-4 pb-5 pt-2 border-t border-hairline bg-white/60 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-sans text-[11px] font-semibold uppercase tracking-wide-2 text-ink-muted mb-1">Nom *</label>
              <input type="text" value={form.name} onChange={(e) => updateField('name', e.target.value)} className="input" />
            </div>
            <div>
              <label className="block font-sans text-[11px] font-semibold uppercase tracking-wide-2 text-ink-muted mb-1">Ordre</label>
              <input type="number" value={form.display_order} onChange={(e) => updateField('display_order', Number(e.target.value))} className="input" />
            </div>
          </div>

          <ImageUploadField
            bucket="partners-logos"
            value={form.logo_url}
            onChange={(url) => updateField('logo_url', url || null)}
            label="Logo (upload)"
          />

          <div>
            <label className="block font-sans text-[11px] font-semibold uppercase tracking-wide-2 text-ink-muted mb-1">Logo SVG (inline — optionnel)</label>
            <textarea value={form.logo_svg ?? ''} onChange={(e) => updateField('logo_svg', e.target.value || null)} rows={3} className="input font-mono text-xs" placeholder="<svg …>…</svg>" />
          </div>

          <div>
            <label className="block font-sans text-[11px] font-semibold uppercase tracking-wide-2 text-ink-muted mb-1">Site web</label>
            <input type="url" value={form.website_url ?? ''} onChange={(e) => updateField('website_url', e.target.value || null)} placeholder="https://…" className="input" />
          </div>

          <div>
            <label className="block font-sans text-[11px] font-semibold uppercase tracking-wide-2 text-ink-muted mb-1">Description</label>
            <textarea value={form.description ?? ''} onChange={(e) => updateField('description', e.target.value || null)} rows={2} className="input" />
          </div>

          <label className="flex items-center gap-2 font-sans text-sm text-ink">
            <input type="checkbox" checked={form.is_active} onChange={(e) => updateField('is_active', e.target.checked)} className="accent-accent-deep" />
            Actif (visible sur le site)
          </label>

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={handleSave} disabled={isPending} className="btn-primary !py-2 !px-4 disabled:opacity-50">
              {isPending ? '…' : 'Enregistrer'}
            </button>
            <button type="button" onClick={onEdit} className="px-4 py-2 rounded-lg border border-hairline font-sans text-xs text-ink-muted hover:border-ink-muted transition-colors">
              Annuler
            </button>
            <button type="button" onClick={handleDelete} disabled={isPending} className="ml-auto px-4 py-2 rounded-lg bg-ink/10 text-ink font-sans text-xs hover:bg-ink hover:text-cream transition-colors disabled:opacity-50">
              Supprimer
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
