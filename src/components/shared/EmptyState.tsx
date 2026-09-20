interface EmptyStateProps {
  title: string;
  description?: string;
}

/**
 * État affiché lorsqu'une table Supabase est vide ou qu'aucun résultat
 * ne correspond aux filtres. Élégant et explicatif.
 */
export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="container-page py-20 text-center">
      <div className="mx-auto max-w-md">
        <div className="mx-auto mb-6 flex size-12 items-center justify-center rounded-full bg-accent/10">
          <span className="font-sans text-xl font-bold text-accent-deep">i</span>
        </div>
        <h2 className="font-sans text-2xl font-bold tracking-tight text-ink">
          {title}
        </h2>
        {description && (
          <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
