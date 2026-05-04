'use client';

import { useState, useTransition } from 'react';
import {
  saveUseCase,
  setUseCaseStatus,
  deleteUseCase,
  type UseCasePayload,
} from '@/lib/actions/use-cases';
import { ImageUploadField } from './ImageUploadField';
import { slugify } from '@/lib/utils';
import type { ContentStatus, UseCase, UseCaseKpi } from '@/lib/supabase/types';

const CASE_TYPE_OPTIONS = [
  { value: 'client', label: 'Mission client' },
  { value: 'product', label: 'Solution propriétaire' },
] as const;

const ACCENT_COLOR_OPTIONS = [
  { value: 'or', label: 'Or', swatch: 'bg-or' },
  { value: 'or-pale', label: 'Or pâle', swatch: 'bg-or-pale' },
  { value: 'sepia', label: 'Sépia', swatch: 'bg-sepia' },
  { value: 'pierre', label: 'Pierre', swatch: 'bg-pierre' },
] as const;

const EMPTY_KPI: UseCaseKpi = { value: '', label: '', projected: false };

interface UseCaseFormProps {
  useCase: UseCase;
}

export function UseCaseForm({ useCase }: UseCaseFormProps) {
  const initSolutionItems = Array.isArray(useCase.solution_items)
    ? (useCase.solution_items as unknown as string[])
    : [];
  const initKpis: UseCaseKpi[] = Array.isArray(useCase.kpis)
    ? (useCase.kpis as unknown as UseCaseKpi[])
    : [];
  // Pad to 4 KPI slots
  const paddedKpis: UseCaseKpi[] = [
    ...initKpis.slice(0, 4),
    ...Array(Math.max(0, 4 - initKpis.length)).fill(null).map(() => ({ ...EMPTY_KPI })),
  ];

  const [payload, setPayload] = useState<UseCasePayload>({
    title: useCase.title,
    slug: useCase.slug,
    subtitle: useCase.subtitle,
    case_type: useCase.case_type,
    sector: useCase.sector,
    status_label: useCase.status_label,
    accent_color: useCase.accent_color,
    problem: useCase.problem,
    solution_items: initSolutionItems,
    kpis: paddedKpis,
    is_featured: useCase.is_featured,
    display_order: useCase.display_order,
  });
  const [solutionText, setSolutionText] = useState(initSolutionItems.join('\n'));
  const [status, setStatus] = useState<ContentStatus>(useCase.status);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackOk, setFeedbackOk] = useState(true);
  const [slugLockedToTitle, setSlugLockedToTitle] = useState(
    useCase.slug.startsWith('cas-') || useCase.slug === slugify(useCase.title)
  );
  const [isPending, startTransition] = useTransition();

  function update<K extends keyof UseCasePayload>(key: K, val: UseCasePayload[K]) {
    setPayload((prev) => {
      const next = { ...prev, [key]: val };
      if (key === 'title' && slugLockedToTitle && typeof val === 'string') {
        next.slug = slugify(val);
      }
      return next;
    });
  }

  function updateKpi(index: number, field: keyof UseCaseKpi, val: string | boolean) {
    setPayload((prev) => {
      const kpis = [...prev.kpis];
      kpis[index] = { ...kpis[index], [field]: val };
      return { ...prev, kpis };
    });
  }

  function showFeedback(msg: string, ok = true) {
    setFeedback(msg);
    setFeedbackOk(ok);
    setTimeout(() => setFeedback(null), 3500);
  }

  function handleSave() {
    const finalItems = solutionText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const finalKpis = payload.kpis.filter((k) => k.value.trim() || k.label.trim());
    const final = { ...payload, solution_items: finalItems, kpis: finalKpis };

    startTransition(async () => {
      const result = await saveUseCase(useCase.id, final);
      showFeedback(result.message, result.success);
    });
  }

  function handleStatusChange(newStatus: ContentStatus) {
    startTransition(async () => {
      const result = await setUseCaseStatus(useCase.id, newStatus);
      if (result.success) setStatus(newStatus);
      showFeedback(result.message, result.success);
    });
  }

  function handleDelete() {
    if (!confirm("Supprimer définitivement ce cas d'usage ? Action irréversible.")) return;
    startTransition(async () => {
      const result = await deleteUseCase(useCase.id);
      if (result.success) window.location.href = '/admin/use-cases';
      else showFeedback(result.message, false);
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
      {/* Colonne principale */}
      <div className="lg:col-span-8 space-y-6">

        {/* Identité */}
        <section className="bg-lin border border-perle rounded-md p-5 space-y-4">
          <h3 className="label-mark">Identité</h3>

          <Field label="Titre" required>
            <input
              type="text"
              value={payload.title}
              onChange={(e) => update('title', e.target.value)}
              className="input"
            />
          </Field>

          <Field label="Slug (URL)" hint={slugLockedToTitle ? 'Généré depuis le titre' : `/cas-usage/${payload.slug}`}>
            <input
              type="text"
              value={payload.slug}
              onChange={(e) => { setSlugLockedToTitle(false); update('slug', slugify(e.target.value)); }}
              className="input font-mono text-xs"
            />
          </Field>

          <Field label="Sous-titre">
            <input
              type="text"
              value={payload.subtitle ?? ''}
              onChange={(e) => update('subtitle', e.target.value || null)}
              className="input"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Type de cas">
              <select
                value={payload.case_type}
                onChange={(e) => update('case_type', e.target.value as 'client' | 'product')}
                className="input"
              >
                {CASE_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </Field>

            <Field label="Secteur">
              <input
                type="text"
                value={payload.sector ?? ''}
                onChange={(e) => update('sector', e.target.value || null)}
                placeholder="ex : Hôtellerie 5★"
                className="input"
              />
            </Field>
          </div>

          <Field label="Label de statut" hint='ex : "Déployé", "En cours"'>
            <input
              type="text"
              value={payload.status_label ?? ''}
              onChange={(e) => update('status_label', e.target.value || null)}
              className="input"
            />
          </Field>

          <Field label="Couleur d'accent">
            <div className="flex gap-3">
              {ACCENT_COLOR_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => update('accent_color', o.value as UseCasePayload['accent_color'])}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border font-sans text-xs transition-colors ${
                    payload.accent_color === o.value
                      ? 'border-or-fonce bg-or-pale/20 text-sepia'
                      : 'border-perle text-pierre hover:border-pierre'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${o.swatch}`} />
                  {o.label}
                </button>
              ))}
            </div>
          </Field>

          <ImageUploadField
            bucket="use-cases-images"
            value={null}
            onChange={() => {}}
            label="Image (non utilisée dans le schéma actuel)"
          />
        </section>

        {/* Contenu */}
        <section className="bg-lin border border-perle rounded-md p-5 space-y-4">
          <h3 className="label-mark">Contenu</h3>

          <Field label="Problème">
            <textarea
              value={payload.problem ?? ''}
              onChange={(e) => update('problem', e.target.value || null)}
              rows={4}
              className="input"
            />
          </Field>

          <Field label="Éléments de solution" hint="Un élément par ligne">
            <textarea
              value={solutionText}
              onChange={(e) => setSolutionText(e.target.value)}
              rows={5}
              className="input"
              placeholder="Automatisation du traitement des factures&#10;Déploiement d'un agent IA…"
            />
          </Field>
        </section>

        {/* KPIs */}
        <section className="bg-lin border border-perle rounded-md p-5">
          <h3 className="label-mark mb-4">KPIs (jusqu'à 4)</h3>
          <div className="space-y-3">
            {payload.kpis.map((kpi, i) => (
              <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-center">
                <input
                  type="text"
                  value={kpi.value}
                  onChange={(e) => updateKpi(i, 'value', e.target.value)}
                  placeholder="ex : 70%"
                  className="input"
                />
                <input
                  type="text"
                  value={kpi.label}
                  onChange={(e) => updateKpi(i, 'label', e.target.value)}
                  placeholder="Libellé du KPI"
                  className="input"
                />
                <label className="flex items-center gap-1.5 font-sans text-xs text-pierre whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={!!kpi.projected}
                    onChange={(e) => updateKpi(i, 'projected', e.target.checked)}
                    className="accent-or-fonce"
                  />
                  Proj.
                </label>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Sidebar droite */}
      <aside className="lg:col-span-4 space-y-5">

        {/* Statut */}
        <div className="bg-lin border border-perle rounded-md p-5">
          <h3 className="label-mark mb-3">Statut</h3>
          <StatusBadge status={status} />
          <div className="mt-3 space-y-2">
            {status === 'draft' && (
              <ActionBtn primary onClick={() => handleStatusChange('published')} disabled={isPending}>Publier</ActionBtn>
            )}
            {status === 'published' && (
              <ActionBtn onClick={() => handleStatusChange('draft')} disabled={isPending}>Dépublier</ActionBtn>
            )}
            {status !== 'archived' && status !== 'draft' && (
              <ActionBtn onClick={() => handleStatusChange('archived')} disabled={isPending}>Archiver</ActionBtn>
            )}
            {status === 'archived' && (
              <ActionBtn onClick={() => handleStatusChange('draft')} disabled={isPending}>Désarchiver</ActionBtn>
            )}
          </div>
        </div>

        {/* Paramètres */}
        <div className="bg-lin border border-perle rounded-md p-5 space-y-4">
          <h3 className="label-mark">Paramètres</h3>

          <Field label="Ordre d'affichage">
            <input
              type="number"
              value={payload.display_order}
              onChange={(e) => update('display_order', Number(e.target.value))}
              className="input"
            />
          </Field>

          <label className="flex items-center gap-2.5">
            <input
              type="checkbox"
              checked={payload.is_featured}
              onChange={(e) => update('is_featured', e.target.checked)}
              className="h-4 w-4 accent-or-fonce"
            />
            <span className="font-sans text-sm text-sepia">Cas mis en avant</span>
          </label>
        </div>

        {/* Sauvegarde + feedback */}
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="btn-primary w-full !py-3 disabled:opacity-50"
        >
          {isPending ? 'Enregistrement…' : 'Enregistrer'}
        </button>

        {feedback && (
          <div className={`rounded-md border p-3 font-sans text-xs ${feedbackOk ? 'border-or bg-or-pale/20 text-sepia' : 'border-sepia bg-perle/30 text-sepia'}`}>
            {feedback}
          </div>
        )}

        {/* Zone danger */}
        <details className="bg-perle/20 border border-perle rounded-md p-5 group">
          <summary className="label-mark cursor-pointer list-none">Zone danger</summary>
          <p className="mt-3 font-sans text-xs text-pierre">La suppression est définitive.</p>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="mt-3 w-full px-4 py-2 rounded-sm bg-sepia text-lin font-sans text-xs font-semibold uppercase tracking-wide-2 hover:bg-or-fonce transition-colors disabled:opacity-50"
          >
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
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={primary
        ? 'w-full px-4 py-2.5 rounded-sm bg-or text-sepia font-sans text-xs font-semibold uppercase tracking-wide-2 hover:bg-or-fonce hover:text-lin transition-colors disabled:opacity-50'
        : 'w-full px-4 py-2.5 rounded-sm border border-perle font-sans text-xs font-semibold uppercase tracking-wide-2 text-sepia hover:border-pierre hover:bg-perle/30 transition-colors disabled:opacity-50'
      }
    >
      {children}
    </button>
  );
}
