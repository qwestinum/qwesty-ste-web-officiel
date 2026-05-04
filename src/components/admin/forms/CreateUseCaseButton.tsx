'use client';

import { useTransition } from 'react';
import { createUseCase } from '@/lib/actions/use-cases';

export function CreateUseCaseButton() {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        await createUseCase();
      } catch (err) {
        console.error('createUseCase failed', err);
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
      {isPending ? 'Création…' : "+ Nouveau cas d'usage"}
    </button>
  );
}
