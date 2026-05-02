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
        <div className="mx-auto h-12 w-12 rounded-full border border-perle flex items-center justify-center mb-6">
          <span className="font-serif text-2xl italic text-pierre">i</span>
        </div>
        <h2 className="font-serif text-2xl text-sepia">{title}</h2>
        {description && (
          <p className="mt-3 font-sans text-sm text-pierre leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
