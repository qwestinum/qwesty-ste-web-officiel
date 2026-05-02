'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { sendMagicLink, type LoginFormState } from '@/lib/actions/auth';

const initialState: LoginFormState = {
  success: false,
  message: '',
};

export function LoginForm() {
  const [state, formAction] = useFormState(sendMagicLink, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="block font-sans text-xs font-medium uppercase tracking-wide-2 text-pierre mb-2"
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
          className="w-full bg-lin border border-perle rounded-md px-4 py-3 font-sans text-base text-sepia placeholder:text-pierre/50 focus:outline-none focus:border-or-fonce focus:ring-2 focus:ring-or/20 transition-colors"
        />
      </div>

      <SubmitButton />

      {state.message && (
        <div
          role={state.success ? 'status' : 'alert'}
          aria-live="polite"
          className={`mt-4 rounded-md border-2 p-4 font-sans text-sm ${
            state.success
              ? 'border-or bg-or-pale/20 text-sepia'
              : 'border-or-fonce bg-or-pale/10 text-sepia'
          }`}
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
          <span>Envoi en cours…</span>
        </>
      ) : (
        <>
          Recevoir le lien de connexion
          <span aria-hidden="true">→</span>
        </>
      )}
    </button>
  );
}
