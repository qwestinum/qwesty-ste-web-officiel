import type { Partner } from '@/lib/supabase/types';

interface PartnersBandProps {
  partners: Partner[];
}

/**
 * Bandeau de partenaires technologiques.
 * - Lit la table partners depuis Supabase
 * - Affiche soit le SVG inline, soit le nom seul si pas de logo
 * - Filtre uniquement les partenaires actifs (déjà filtré côté query)
 */
export function PartnersBand({ partners }: PartnersBandProps) {
  if (partners.length === 0) return null;

  return (
    <section
      className="border-y border-perle bg-perle/20 py-10 md:py-12"
      aria-label="Partenaires technologiques"
    >
      <div className="container-page">
        <div className="text-center mb-8 md:mb-10">
          <span className="label-mark">Technologies & partenaires</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-10 md:gap-x-14 gap-y-6">
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
    <span className="font-serif text-lg md:text-xl font-medium text-pierre opacity-60 hover:opacity-100 transition-opacity">
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
