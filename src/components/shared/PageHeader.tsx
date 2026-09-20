import { Emphasis } from '@/components/shared/Emphasis';

interface PageHeaderProps {
  kicker: string;
  titlePrefix?: string;
  titleAccent: string;
  titleSuffix?: string;
  intro?: string;
}

/**
 * En-tête réutilisable pour toutes les pages publiques.
 * Même grammaire que le hero de l'accueil — sur-titre, titre bold avec
 * mot souligné au pinceau, chapeau — en version plus contenue.
 */
export function PageHeader({
  kicker,
  titlePrefix,
  titleAccent,
  titleSuffix,
  intro,
}: PageHeaderProps) {
  return (
    <header className="border-b border-hairline bg-cream">
      <div className="container-page py-16 md:py-20">
        <span className="eyebrow">{kicker}</span>
        <h1 className="mt-5 max-w-4xl font-sans text-[2.5rem] font-bold leading-display tracking-tight text-ink sm:text-5xl lg:text-6xl">
          {titlePrefix && <>{titlePrefix} </>}
          <Emphasis>{titleAccent}</Emphasis>
          {titleSuffix && <> {titleSuffix}</>}
        </h1>
        {intro && (
          <p className="mt-7 max-w-2xl font-sans text-lg leading-relaxed text-ink-muted md:text-xl">
            {intro}
          </p>
        )}
      </div>
    </header>
  );
}
