'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useRef } from 'react';
import { submitLead, type LeadFormState } from '@/lib/actions/contact';

const SUBJECTS = [
  { value: 'general', label: 'Demande générale' },
  { value: 'diagnostic', label: 'Diagnostic IA gratuit' },
  { value: 'formation', label: 'Formations' },
  { value: 'partnership', label: 'Partenariat' },
  { value: 'press', label: 'Presse / Média' },
  { value: 'other', label: 'Autre' },
];

const initialState: LeadFormState = {
  success: false,
  message: '',
};

export function ContactForm() {
  const [state, formAction] = useFormState(submitLead, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // Reset le formulaire quand un envoi a réussi
  useEffect(() => {
    if (state.success && formRef.current) {
      formRef.current.reset();
    }
  }, [state.success]);

  // Scroll vers le haut du formulaire quand il y a des erreurs ou un succès
  useEffect(() => {
    if (state.message && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [state.message, state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6" noValidate>

      {/* Honeypot anti-spam — caché en CSS, rempli par bots */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <label htmlFor="website">Ne pas remplir</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Bloc d'erreurs en haut quand il y en a */}
      {state.message && !state.success && (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-xl border border-danger/40 bg-danger/5 p-4 font-sans text-sm text-ink"
        >
          <p className="font-bold">{state.message}</p>
          {state.errors && Object.keys(state.errors).length > 0 && (
            <ul className="ml-4 mt-2 list-disc space-y-1 text-ink">
              {Object.entries(state.errors).map(([field, msg]) => (
                <li key={field}>{msg}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field
          label="Nom complet"
          name="full_name"
          required
          error={state.errors?.full_name}
          minLength={2}
          maxLength={120}
        />
        <Field
          label="Email professionnel"
          name="email"
          type="email"
          required
          error={state.errors?.email}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Entreprise" name="company" />
        <Field label="Téléphone" name="phone" type="tel" />
      </div>

      <div>
        <label
          htmlFor="subject"
          className="eyebrow mb-2 block"
        >
          Sujet
        </label>
        <select
          id="subject"
          name="subject"
          defaultValue="general"
          className="input"
        >
          {SUBJECTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="eyebrow mb-2 block"
        >
          Votre message <span className="text-danger">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          minLength={10}
          maxLength={4000}
          placeholder="Présentez-nous votre contexte, vos enjeux, votre objectif (au moins 10 caractères)…"
          className={`input ${state.errors?.message ? 'border-danger' : ''}`}
        />
        {state.errors?.message && (
          <p className="mt-2 font-sans text-xs text-danger">{state.errors.message}</p>
        )}
        <p className="mt-1 font-sans text-[11px] text-ink-muted">
          Minimum 10 caractères
        </p>
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="consent"
            name="consent"
            required
            className="mt-1 size-4 shrink-0 accent-accent-deep"
          />
          <label htmlFor="consent" className="font-sans text-xs leading-relaxed text-ink-muted">
            J'accepte que mes données soient utilisées par Qwestinum pour me recontacter au sujet de ma demande, conformément à la <a href="/confidentialite" className="link-editorial">politique de confidentialité</a>. <span className="text-danger">*</span>
          </label>
        </div>
        {state.errors?.consent && (
          <p className="ml-7 mt-2 font-sans text-xs text-danger">{state.errors.consent}</p>
        )}
      </div>

      <SubmitButton />

      {/* Message de succès */}
      {state.success && state.message && (
        <div
          role="status"
          aria-live="polite"
          className="mt-4 rounded-xl border border-success/40 bg-success/5 p-4 font-sans text-sm font-bold text-ink"
        >
          {state.message}
        </div>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required = false,
  error,
  minLength,
  maxLength,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  minLength?: number;
  maxLength?: number;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="eyebrow mb-2 block"
      >
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        className={`input ${error ? 'border-danger' : ''}`}
      />
      {error && <p className="mt-2 font-sans text-xs text-danger">{error}</p>}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary"
    >
      {pending ? (
        <>
          <svg
            className="size-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
            <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span>Envoi en cours…</span>
        </>
      ) : (
        <>
          Envoyer le message
          <span aria-hidden="true">→</span>
        </>
      )}
    </button>
  );
}
