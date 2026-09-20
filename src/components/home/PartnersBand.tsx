import type { Partner } from '@/lib/supabase/types';

interface PartnersBandProps {
  partners: Partner[];
}

/**
 * Bandeau de partenaires technologiques.
 * - Lit la table partners depuis Supabase
 * - Affiche le nom seul (pas de logo stocké à ce jour)
 * - Filtre uniquement les partenaires actifs (déjà filtré côté query)
 */
export function PartnersBand({ partners }: PartnersBandProps) {
  if (partners.length === 0) return null;

  return (
    <section
      className="border-y border-hairline bg-white py-10 md:py-12"
      aria-label="Partenaires technologiques"
    >
      <div className="container-page">
        <div className="mb-8 text-center md:mb-10">
          <span className="eyebrow">Technologies &amp; partenaires</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-14">
          {partners.map((partner) => (
            <PartnerLogo key={partner.id} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnerLogo({ partner }: { partner: Partner }) {
  const content = (
    <span className="font-sans text-lg font-bold text-ink-muted opacity-60 transition-opacity hover:opacity-100 md:text-xl">
      {partner.name}
    </span>
  );

  if (partner.website_url) {
    return (
      <a
        href={partner.website_url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={partner.name}
      >
        {content}
      </a>
    );
  }

  return <div>{content}</div>;
}
