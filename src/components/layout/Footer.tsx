import Link from 'next/link';
import { LogoHorizontal } from '@/components/brand/Logo';
import { FOOTER_LINKS, SITE_CONFIG } from '@/lib/constants';

/**
 * Pied de page — fond dédié `footer` (#E9EDEB) comme sur la charte ORQA,
 * ce qui le détache du crème du corps sans passer par une inversion sombre.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline bg-footer">
      <div className="container-page py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">

          {/* Marque + contact */}
          <div className="md:col-span-6">
            <LogoHorizontal />
            <p className="mt-5 max-w-sm font-sans text-sm leading-relaxed text-ink-muted">
              {SITE_CONFIG.description}
            </p>
            <div className="mt-6 space-y-1 font-sans text-sm">
              <a
                href={`mailto:${SITE_CONFIG.contact.email}`}
                className="block font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:decoration-accent-deep"
              >
                {SITE_CONFIG.contact.email}
              </a>
              <a
                href={`tel:${SITE_CONFIG.contact.phone.replace(/\s/g, '')}`}
                className="block text-ink-muted"
              >
                {SITE_CONFIG.contact.phone}
              </a>
            </div>
          </div>

          {/* Colonnes de liens */}
          <div className="md:col-span-2">
            <FooterColumn title="Services" links={FOOTER_LINKS.services} />
          </div>
          <div className="md:col-span-2">
            <FooterColumn title="Entreprise" links={FOOTER_LINKS.entreprise} />
          </div>
          <div className="md:col-span-2">
            <FooterColumn title="Ressources" links={FOOTER_LINKS.ressources} />
          </div>
        </div>

        {/* Footer bottom */}
        <div className="mt-14 flex flex-col gap-6 border-t border-hairline pt-8 md:flex-row md:items-center md:justify-between">
          <div className="font-sans text-xs text-ink-muted">
            © {year} Qwestinum · Tous droits réservés
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <ComplianceBadge label="RGPD" />
            <ComplianceBadge label="AI Act ready" />
            <ComplianceBadge label="Hébergement UE" />
          </div>

          <div className="font-sans text-xs text-ink-muted">
            {SITE_CONFIG.locations.join(' · ')}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ readonly href: string; readonly label: string }>;
}) {
  return (
    <div>
      <h4 className="eyebrow mb-4">{title}</h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="font-sans text-sm text-ink-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ComplianceBadge({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="dot-sun" />
      <span className="font-sans text-xs text-ink-muted tracking-wide-1">{label}</span>
    </div>
  );
}
