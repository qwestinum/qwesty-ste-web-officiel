'use client';

import { useTransition } from 'react';
import { createFormation } from '@/lib/actions/formations';

export function CreateFormationButton() {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        await createFormation();
      } catch (err) {
        console.error('createFormation failed', err);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="btn-primary !py-3 !px-5 disabled:opacity-50"
    >
      {isPending ? 'Création…' : '+ Nouvelle formation'}
    </button>
  );
}
