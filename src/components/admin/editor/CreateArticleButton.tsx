'use client';

import { useTransition } from 'react';
import { createArticle } from '@/lib/actions/articles';

export function CreateArticleButton() {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        await createArticle();
      } catch (err) {
        console.error('createArticle failed', err);
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
      {isPending ? 'Création…' : (
        <>
          + Nouvel article
        </>
      )}
    </button>
  );
}
