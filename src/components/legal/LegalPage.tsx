import { LEGAL_CONFIG } from '@/lib/constants';

/**
 * Mise en page commune aux pages légales : colonne de lecture étroite,
 * titres en Carlito bold, filets de séparation. Volontairement sobre —
 * on est sur du texte de référence, pas sur une page de conversion.
 */
export function LegalPage({ children }: { children: React.ReactNode }) {
  return (
    <section className="section-padding bg-white">
      <div className="container-page max-w-3xl">
        <p className="eyebrow">
          Dernière mise à jour — {LEGAL_CONFIG.lastUpdated}
        </p>
        <div className="mt-10 space-y-12">{children}</div>
      </div>
    </section>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-hairline pt-10 first:border-0 first:pt-0">
      <h2 className="font-sans text-2xl font-bold tracking-tight text-ink">
        {title}
      </h2>
      <div className="mt-5 space-y-4 font-sans text-base leading-relaxed text-ink-muted">
        {children}
      </div>
    </section>
  );
}

/** Liste à puces jaunes, cohérente avec le reste du site. */
export function LegalList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 leading-relaxed">
          <span className="mt-[0.5rem] block size-1.5 shrink-0 rounded-full bg-sun" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Paire libellé / valeur, pour les blocs d'identification. */
export function LegalFacts({
  facts,
}: {
  facts: Array<{ label: string; value: React.ReactNode } | null>;
}) {
  const shown = facts.filter(Boolean) as Array<{
    label: string;
    value: React.ReactNode;
  }>;

  return (
    <dl className="card-warm divide-y divide-sun/30 p-0">
      {shown.map((f) => (
        <div key={f.label} className="flex flex-col gap-1 p-5 sm:flex-row sm:gap-6">
          <dt className="eyebrow shrink-0 sm:w-44 sm:pt-0.5">{f.label}</dt>
          <dd className="font-sans text-base text-ink">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}
