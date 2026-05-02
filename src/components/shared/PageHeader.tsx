interface PageHeaderProps {
  kicker: string;
  titlePrefix?: string;
  titleAccent: string;
  titleSuffix?: string;
  intro?: string;
}

/**
 * En-tête éditorial réutilisable pour toutes les pages publiques.
 * Cohérent avec le hero de l'accueil mais en version plus contenue.
 */
export function PageHeader({
  kicker,
  titlePrefix,
  titleAccent,
  titleSuffix,
  intro,
}: PageHeaderProps) {
  return (
    <header className="border-b border-perle">
      <div className="container-page py-16 md:py-20">
        <span className="label-mark">{kicker}</span>
        <h1 className="mt-5 max-w-4xl font-serif text-5xl md:text-6xl lg:text-7xl font-normal leading-tight-extra tracking-tighter-2 text-sepia">
          {titlePrefix && <>{titlePrefix} </>}
          <em className="italic text-or-fonce">{titleAccent}</em>
          {titleSuffix && <> {titleSuffix}</>}
        </h1>
        {intro && (
          <p className="mt-7 max-w-2xl font-sans text-lg md:text-xl leading-relaxed text-pierre">
            {intro}
          </p>
        )}
      </div>
    </header>
  );
}
