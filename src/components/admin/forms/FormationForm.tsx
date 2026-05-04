'use client';

import { useState, useTransition } from 'react';
import {
  saveFormation,
  setFormationStatus,
  deleteFormation,
  type FormationPayload,
} from '@/lib/actions/formations';
import { slugify } from '@/lib/utils';
import type { ContentStatus, Formation } from '@/lib/supabase/types';

const LEVEL_OPTIONS = [
  { value: '', label: '— Aucun —' },
  { value: 'fondations', label: 'Fondations' },
  { value: 'productivite', label: 'Productivité' },
  { value: 'methode', label: 'Méthode' },
  { value: 'execution', label: 'Exécution' },
  { value: 'direction', label: 'Direction' },
  { value: 'business', label: 'Business' },
  { value: 'conformite', label: 'Conformité' },
  { value: 'humain', label: 'Humain' },
];

const FORMAT_OPTIONS = ['inter', 'intra', 'distanciel', 'sur-mesure'];

interface FormationFormProps {
  formation: Formation;
}

export function FormationForm({ formation }: FormationFormProps) {
  const initProgramme = Array.isArray(formation.programme)
    ? (formation.programme as unknown as string[])
    : [];
  const initFormats = Array.isArray(formation.formats) ? formation.formats : [];

  const [payload, setPayload] = useState<FormationPayload>({
    title: formation.title,
    slug: formation.slug,
    excerpt: formation.excerpt,
    level: formation.level,
    level_label: formation.level_label,
    duration_days: formation.duration_days,
    duration_label: formation.duration_label,
    audience: formation.audience,
    description: formation.description,
    programme: initProgramme,
    formats: initFormats,
    price_label: formation.price_label,
    is_flagship: formation.is_flagship,
    display_order: formation.display_order,
  });
  const [programmeText, setProgrammeText] = useState(initProgramme.join('\n'));
  const [status, setStatus] = useState<ContentStatus>(formation.status);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackOk, setFeedbackOk] = useState(true);
  const [slugLockedToTitle, setSlugLockedToTitle] = useState(
    formation.slug.startsWith('formation-') || formation.slug === slugify(formation.title)
  );
  const [isPending, startTransition] = useTransition();

  function update<K extends keyof FormationPayload>(key: K, val: FormationPayload[K]) {
    setPayload((prev) => {
      const next = { ...prev, [key]: val };
      if (key === 'title' && slugLockedToTitle && typeof val === 'string') {
        next.slug = slugify(val);
      }
      return next;
    });
  }

  function toggleFormat(fmt: string) {
    setPayload((prev) => {
      const formats = prev.formats.includes(fmt)
        ? prev.formats.filter((f) => f !== fmt)
        : [...prev.formats, fmt];
      return { ...prev, formats };
    });
  }

  function showFeedback(msg: string, ok = true) {
    setFeedback(msg);
    setFeedbackOk(ok);
    setTimeout(() => setFeedback(null), 3500);
  }

  function handleSave() {
    const programme = programmeText.split('\n').map((s) => s.trim()).filter(Boolean);
    startTransition(async () => {
      const result = await saveFormation(formation.id, { ...payload, programme });
      showFeedback(result.message, result.success);
    });
  }

  function handleStatusChange(newStatus: ContentStatus) {
    startTransition(async () => {
      const result = await setFormationStatus(formation.id, newStatus);
      if (result.success) setStatus(newStatus);
      showFeedback(result.message, result.success);
    });
  }

  function handleDelete() {
    if (!confirm('Supprimer définitivement cette formation ? Action irréversible.')) return;
    startTransition(async () => {
      const result = await deleteFormation(formation.id);
      if (result.success) window.location.href = '/admin/formations';
      else showFeedback(result.message, false);
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
      {/* Colonne principale */}
      <div className="lg:col-span-8 space-y-6">

        <section className="bg-lin border border-perle rounded-md p-5 space-y-4">
          <h3 className="label-mark">Identité</h3>

          <Field label="Titre" required>
            <input type="text" value={payload.title} onChange={(e) => update('title', e.target.value)} className="input" />
          </Field>

          <Field label="Slug" hint={slugLockedToTitle ? 'Généré depuis le titre' : `/formations/${payload.slug}`}>
            <input
              type="text"
              value={payload.slug}
              onChange={(e) => { setSlugLockedToTitle(false); update('slug', slugify(e.target.value)); }}
              className="input font-mono text-xs"
            />
          </Field>

          <Field label="Résumé (excerpt)" hint="Affiché sur la liste et dans les cartes">
            <textarea value={payload.excerpt ?? ''} onChange={(e) => update('excerpt', e.target.value || null)} rows={3} className="input" />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Niveau">
              <select value={payload.level ?? ''} onChange={(e) => update('level', e.target.value || null)} className="input">
                {LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            <Field label="Label de niveau" hint='ex : "Fondations"'>
              <input type="text" value={payload.level_label ?? ''} onChange={(e) => update('level_label', e.target.value || null)} className="input" />
            </Field>
          </div>

          <Field label="Public cible">
            <input type="text" value={payload.audience ?? ''} onChange={(e) => update('audience', e.target.value || null)} placeholder="ex : Managers, DSI, consultants…" className="input" />
          </Field>
        </section>

        <section className="bg-lin border border-perle rounded-md p-5 space-y-4">
          <h3 className="label-mark">Durée & Format</h3>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Durée (jours)">
              <input
                type="number"
                value={payload.duration_days ?? ''}
                onChange={(e) => update('duration_days', e.target.value ? Number(e.target.value) : null)}
                step="0.5"
                className="input"
              />
            </Field>
            <Field label="Label durée" hint='ex : "2 jours · 14h"'>
              <input type="text" value={payload.duration_label ?? ''} onChange={(e) => update('duration_label', e.target.value || null)} className="input" />
            </Field>
          </div>

          <Field label="Formats disponibles">
            <div className="flex flex-wrap gap-3 mt-1">
              {FORMAT_OPTIONS.map((fmt) => (
                <label key={fmt} className="flex items-center gap-2 font-sans text-sm text-sepia cursor-pointer">
                  <input
                    type="checkbox"
                    checked={payload.formats.includes(fmt)}
                    onChange={() => toggleFormat(fmt)}
                    className="accent-or-fonce"
                  />
                  {fmt}
                </label>
              ))}
            </div>
          </Field>

          <Field label="Tarif">
            <input type="text" value={payload.price_label ?? ''} onChange={(e) => update('price_label', e.target.value || null)} placeholder='ex : "Sur devis", "1 200€ HT"' className="input" />
          </Field>

          <label className="flex items-center gap-2.5">
            <input type="checkbox" checked={payload.is_flagship} onChange={(e) => update('is_flagship', e.target.checked)} className="h-4 w-4 accent-or-fonce" />
            <span className="font-sans text-sm text-sepia">Formation flagship (programme phare)</span>
          </label>
        </section>

        <section className="bg-lin border border-perle rounded-md p-5 space-y-4">
          <h3 className="label-mark">Contenu</h3>

          <Field label="Description">
            <textarea value={payload.description ?? ''} onChange={(e) => update('description', e.target.value || null)} rows={5} className="input" />
          </Field>

          <Field label="Programme" hint="Un module par ligne">
            <textarea
              value={programmeText}
              onChange={(e) => setProgrammeText(e.target.value)}
              rows={6}
              className="input"
              placeholder="Module 1 : Comprendre l'IA&#10;Module 2 : …"
            />
          </Field>
        </section>
      </div>

      {/* Sidebar */}
      <aside className="lg:col-span-4 space-y-5">

        <div className="bg-lin border border-perle rounded-md p-5">
          <h3 className="label-mark mb-3">Statut</h3>
          <StatusBadge status={status} />
          <div className="mt-3 space-y-2">
            {status === 'draft' && <ActionBtn primary onClick={() => handleStatusChange('published')} disabled={isPending}>Publier</ActionBtn>}
            {status === 'published' && <ActionBtn onClick={() => handleStatusChange('draft')} disabled={isPending}>Dépublier</ActionBtn>}
            {status !== 'archived' && status !== 'draft' && <ActionBtn onClick={() => handleStatusChange('archived')} disabled={isPending}>Archiver</ActionBtn>}
            {status === 'archived' && <ActionBtn onClick={() => handleStatusChange('draft')} disabled={isPending}>Désarchiver</ActionBtn>}
          </div>
        </div>

        <div className="bg-lin border border-perle rounded-md p-5">
          <h3 className="label-mark mb-3">Paramètres</h3>
          <Field label="Ordre d'affichage">
            <input type="number" value={payload.display_order} onChange={(e) => update('display_order', Number(e.target.value))} className="input" />
          </Field>
        </div>

        <button type="button" onClick={handleSave} disabled={isPending} className="btn-primary w-full !py-3 disabled:opacity-50">
          {isPending ? 'Enregistrement…' : 'Enregistrer'}
        </button>

        {feedback && (
          <div className={`rounded-md border p-3 font-sans text-xs ${feedbackOk ? 'border-or bg-or-pale/20 text-sepia' : 'border-sepia bg-perle/30 text-sepia'}`}>
            {feedback}
          </div>
        )}

        <details className="bg-perle/20 border border-perle rounded-md p-5 group">
          <summary className="label-mark cursor-pointer list-none">Zone danger</summary>
          <p className="mt-3 font-sans text-xs text-pierre">La suppression est définitive.</p>
          <button type="button" onClick={handleDelete} disabled={isPending} className="mt-3 w-full px-4 py-2 rounded-sm bg-sepia text-lin font-sans text-xs font-semibold uppercase tracking-wide-2 hover:bg-or-fonce transition-colors disabled:opacity-50">
            Supprimer définitivement
          </button>
        </details>
      </aside>
    </div>
  );
}

function Field({ label, required = false, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block font-sans text-[11px] font-medium uppercase tracking-wide-2 text-pierre mb-1.5">
        {label} {required && <span className="text-or-fonce">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 font-sans text-[11px] text-pierre/80">{hint}</p>}
    </div>
  );
}

function StatusBadge({ status }: { status: ContentStatus }) {
  const cfg = {
    draft: { label: 'Brouillon', classes: 'bg-perle text-sepia' },
    published: { label: 'Publié', classes: 'bg-or text-sepia' },
    archived: { label: 'Archivé', classes: 'bg-sepia text-lin' },
  }[status];
  return (
    <span className={`inline-flex items-center font-sans text-[10px] font-semibold uppercase tracking-wide-2 rounded-sm px-2 py-1 ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}

function ActionBtn({ children, onClick, primary = false, disabled = false }: {
  children: React.ReactNode; onClick: () => void; primary?: boolean; disabled?: boolean;
}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={primary
      ? 'w-full px-4 py-2.5 rounded-sm bg-or text-sepia font-sans text-xs font-semibold uppercase tracking-wide-2 hover:bg-or-fonce hover:text-lin transition-colors disabled:opacity-50'
      : 'w-full px-4 py-2.5 rounded-sm border border-perle font-sans text-xs font-semibold uppercase tracking-wide-2 text-sepia hover:border-pierre hover:bg-perle/30 transition-colors disabled:opacity-50'
    }>
      {children}
    </button>
  );
}
