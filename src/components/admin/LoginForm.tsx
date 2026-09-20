'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { signIn, type LoginFormState } from '@/lib/actions/auth';

const initialState: LoginFormState = {
  success: false,
  message: '',
};

export function LoginForm() {
  const [state, formAction] = useFormState(signIn, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="block font-sans text-xs font-semibold uppercase tracking-wide-2 text-ink-muted mb-2"
        >
          Email administrateur
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          autoComplete="email"
          autoFocus
          placeholder="vous@qwestinum.fr"
          className="w-full bg-white border border-hairline rounded-xl px-4 py-3 font-sans text-base text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-accent-deep focus:ring-2 focus:ring-accent/20 transition-colors"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block font-sans text-xs font-semibold uppercase tracking-wide-2 text-ink-muted mb-2"
        >
          Mot de passe
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="w-full bg-white border border-hairline rounded-xl px-4 py-3 font-sans text-base text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-accent-deep focus:ring-2 focus:ring-accent/20 transition-colors"
        />
      </div>

      <SubmitButton />

      {state.message && (
        <div
          role="alert"
          aria-live="polite"
          className="mt-4 rounded-xl border-2 border-accent-deep bg-sun/10 p-4 font-sans text-sm text-ink"
        >
          {state.message}
        </div>
      )}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary w-full !py-4 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
            <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span>Connexion en cours…</span>
        </>
      ) : (
        <>
          Se connecter
          <span aria-hidden="true">→</span>
        </>
      )}
    </button>
  );
}
