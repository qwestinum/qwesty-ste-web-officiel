import Link from 'next/link';
import { LogoHorizontal } from '@/components/brand/Logo';
import { FOOTER_LINKS, SITE_CONFIG } from '@/lib/constants';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-perle bg-lin">
      <div className="container-page py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">

          {/* Marque + contact */}
          <div className="md:col-span-4">
            <LogoHorizontal />
            <p className="mt-5 max-w-sm font-sans text-sm leading-relaxed text-pierre">
              {SITE_CONFIG.description}
            </p>
            <div className="mt-6 space-y-1 font-sans text-sm">
              <a
                href={`mailto:${SITE_CONFIG.contact.email}`}
                className="block text-sepia hover:text-or-fonce transition-colors"
              >
                {SITE_CONFIG.contact.email}
              </a>
              <a
                href={`tel:${SITE_CONFIG.contact.phone.replace(/\s/g, '')}`}
                className="block text-pierre"
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
          <div className="md:col-span-2">
            <FooterColumn title="Conformité" links={FOOTER_LINKS.conformite} />
          </div>
        </div>

        {/* Footer bottom */}
        <div className="mt-14 pt-8 border-t border-perle flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="font-sans text-xs text-pierre">
            © {year} Qwestinum · Tous droits réservés
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <ComplianceBadge label="RGPD" />
            <ComplianceBadge label="AI Act ready" />
            <ComplianceBadge label="Hébergement UE" />
          </div>

          <div className="font-sans text-xs text-pierre">
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
      <h4 className="label-mark mb-4">{title}</h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="font-sans text-sm text-pierre hover:text-or-fonce transition-colors"
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
      <span className="block w-1.5 h-1.5 rounded-full bg-or" />
      <span className="font-sans text-xs text-pierre tracking-wide-1">{label}</span>
    </div>
  );
}
