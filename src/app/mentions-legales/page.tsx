import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import {
  LegalFacts,
  LegalPage,
  LegalSection,
} from '@/components/legal/LegalPage';
import { LEGAL_CONFIG, SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Mentions légales',
  description:
    "Mentions légales du site Qwestinum — éditeur, hébergeur, propriété intellectuelle et responsabilité.",
};

export const dynamic = 'force-static';

export default function MentionsLegalesPage() {
  const { companyName, legalForm, capital, siren, rcs, vatNumber, address, publicationDirector, host } =
    LEGAL_CONFIG;

  return (
    <>
      <Header />
      <main>
        <PageHeader
          kicker="Informations légales"
          titlePrefix="Mentions"
          titleAccent="légales."
          intro="Identité de l'éditeur du site, de son hébergeur, et conditions d'utilisation des contenus publiés."
        />

        <LegalPage>
          <LegalSection title="Éditeur du site">
            <LegalFacts
              facts={[
                { label: 'Dénomination', value: companyName },
                { label: 'Forme juridique', value: legalForm },
                capital ? { label: 'Capital social', value: capital } : null,
                siren ? { label: 'SIREN', value: siren } : null,
                rcs ? { label: 'RCS', value: rcs } : null,
                vatNumber ? { label: 'TVA intracommunautaire', value: vatNumber } : null,
                address ? { label: 'Siège social', value: address } : null,
                publicationDirector
                  ? { label: 'Directeur de la publication', value: publicationDirector }
                  : null,
                {
                  label: 'Email',
                  value: (
                    <a
                      href={`mailto:${SITE_CONFIG.contact.email}`}
                      className="link-editorial"
                    >
                      {SITE_CONFIG.contact.email}
                    </a>
                  ),
                },
                {
                  label: 'Téléphone',
                  value: (
                    <a
                      href={`tel:${SITE_CONFIG.contact.phone.replace(/\s/g, '')}`}
                      className="link-editorial"
                    >
                      {SITE_CONFIG.contact.phone}
                    </a>
                  ),
                },
                { label: 'Implantations', value: SITE_CONFIG.locations.join(' · ') },
              ]}
            />
          </LegalSection>

          <LegalSection title="Hébergement">
            <p>
              Le site est hébergé par{' '}
              <a
                href={host.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-editorial"
              >
                {host.name}
              </a>
              {host.address ? `, ${host.address}` : ''}.
            </p>
          </LegalSection>

          <LegalSection title="Propriété intellectuelle">
            <p>
              L&apos;ensemble des contenus de ce site — textes, articles,
              méthodes, visuels, identité graphique et code — est la propriété
              de {companyName}, sauf mention contraire explicite.
            </p>
            <p>
              Toute reproduction, représentation, adaptation ou exploitation,
              totale ou partielle, sans autorisation écrite préalable, est
              interdite. La citation d&apos;un extrait reste libre à condition
              d&apos;indiquer clairement la source et d&apos;ajouter un lien
              vers la page d&apos;origine.
            </p>
          </LegalSection>

          <LegalSection title="Responsabilité">
            <p>
              Les contenus publiés — notamment les analyses, cas d&apos;usage et
              ressources — sont fournis à titre informatif. Ils ne constituent
              ni un conseil juridique, ni un engagement contractuel, et ne
              sauraient se substituer à une analyse conduite sur votre contexte
              propre.
            </p>
            <p>
              Les chiffres présentés dans les cas d&apos;usage sont issus de
              missions réelles et anonymisées ; ceux signalés comme projections
              sont explicitement identifiés comme tels. Ils ne préjugent pas des
              résultats atteignables dans une autre organisation.
            </p>
            <p>
              Ce site peut renvoyer vers des sites tiers. {companyName}
              {' '}n&apos;exerce aucun contrôle sur leurs contenus et décline
              toute responsabilité à leur égard.
            </p>
          </LegalSection>

          <LegalSection title="Données personnelles">
            <p>
              Le traitement des données collectées via ce site — notamment le
              formulaire de contact et la prise de rendez-vous — est décrit dans
              notre{' '}
              <Link href="/confidentialite" className="link-editorial">
                politique de confidentialité
              </Link>
              .
            </p>
          </LegalSection>
        </LegalPage>
      </main>
      <Footer />
    </>
  );
}
