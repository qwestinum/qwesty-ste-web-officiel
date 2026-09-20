import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import {
  LegalList,
  LegalPage,
  LegalSection,
} from '@/components/legal/LegalPage';
import { LEGAL_CONFIG, SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description:
    "Comment Qwestinum collecte et traite les données personnelles via ce site — données collectées, finalités, sous-traitants et exercice de vos droits.",
};

export const dynamic = 'force-static';

export default function ConfidentialitePage() {
  const { companyName, legalForm, capital, siren, address, processors, retention } =
    LEGAL_CONFIG;
  const email = SITE_CONFIG.contact.email;

  const identity = [legalForm, capital && `au capital de ${capital}`, address, siren && `SIREN ${siren}`]
    .filter(Boolean)
    .join(', ');

  return (
    <>
      <Header />
      <main>
        <PageHeader
          kicker="Protection des données"
          titlePrefix="Politique de"
          titleAccent="confidentialité."
          intro="Comment nous collectons et traitons vos données personnelles sur ce site, conformément au RGPD et à la loi Informatique et Libertés."
        />

        <LegalPage>
          <LegalSection title="Responsable de traitement">
            <p>
              {companyName}
              {identity ? `, ${identity}` : ''}, agit en qualité de responsable
              de traitement pour les données collectées via ce site.
            </p>
            <p>
              Pour toute question relative à vos données :{' '}
              <a href={`mailto:${email}`} className="link-editorial">
                {email}
              </a>
              .
            </p>
          </LegalSection>

          <LegalSection title="Données collectées via ce site">
            <p>
              Ce site est volontairement sobre dans sa collecte. Nous ne traitons
              que ce que vous nous transmettez délibérément :
            </p>
            <LegalList
              items={[
                <>
                  <strong className="font-bold text-ink">
                    Formulaire de contact
                  </strong>{' '}
                  — nom complet, adresse email, et le contenu de votre message.
                  L&apos;entreprise, le téléphone et le sujet de la demande sont
                  facultatifs.
                </>,
                <>
                  <strong className="font-bold text-ink">
                    Prise de rendez-vous
                  </strong>{' '}
                  — si vous réservez un créneau, les informations que vous
                  communiquez au module Cal.com intégré à la page contact.
                </>,
                <>
                  <strong className="font-bold text-ink">
                    Données techniques de l&apos;envoi
                  </strong>{' '}
                  — une empreinte cryptographique tronquée de votre adresse IP
                  (et non l&apos;adresse elle-même) ainsi que votre navigateur,
                  conservés à seule fin de lutter contre les envois automatisés.
                </>,
              ]}
            />
            <p>
              Ce site ne comporte <strong className="font-bold text-ink">aucun
              outil de mesure d&apos;audience</strong>, aucun cookie publicitaire
              et aucun profilage. Aucune bannière de consentement n&apos;est donc
              nécessaire.
            </p>
          </LegalSection>

          <LegalSection title="Finalités et bases légales">
            <LegalList
              items={[
                <>
                  Répondre à votre demande et, le cas échéant, organiser un
                  échange ou un diagnostic —{' '}
                  <em className="italic">consentement</em>, recueilli via la case
                  à cocher du formulaire, et mesure précontractuelle.
                </>,
                <>
                  Protéger le formulaire contre les envois automatisés —{' '}
                  <em className="italic">intérêt légitime</em>.
                </>,
              ]}
            />
          </LegalSection>

          <LegalSection title="Destinataires et sous-traitants">
            <p>
              Vos données sont traitées par {companyName} et par ses
              sous-traitants techniques, dans la stricte limite des finalités
              ci-dessus. Elles ne sont ni vendues, ni cédées, ni utilisées à des
              fins publicitaires.
            </p>
            <LegalList
              items={processors.map((p) => (
                <>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-editorial"
                  >
                    {p.name}
                  </a>{' '}
                  — {p.role}.
                </>
              ))}
            />
            <p>
              Certains de ces prestataires peuvent être établis hors de
              l&apos;Union européenne ; les transferts éventuels sont alors
              encadrés par des garanties appropriées, notamment les clauses
              contractuelles types de la Commission européenne.
            </p>
          </LegalSection>

          <LegalSection title="Durée de conservation">
            <p>
              Les demandes de contact sont conservées {retention}, puis
              supprimées. Vous pouvez en demander l&apos;effacement à tout
              moment, sans attendre ce délai.
            </p>
          </LegalSection>

          <LegalSection title="Cookies">
            <p>
              La consultation du site ne dépose aucun cookie de suivi. Seuls des
              cookies strictement nécessaires à l&apos;authentification sont
              utilisés dans l&apos;espace d&apos;administration, réservé à
              l&apos;équipe {companyName}.
            </p>
            <p>
              Si vous ouvrez le module de prise de rendez-vous, Cal.com est
              susceptible de déposer ses propres cookies, régis par sa politique
              de confidentialité.
            </p>
          </LegalSection>

          <LegalSection title="Vos droits">
            <p>
              Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès,
              de rectification, d&apos;effacement, de limitation,
              d&apos;opposition et de portabilité de vos données. Vous pouvez
              également retirer votre consentement à tout moment, sans que cela
              remette en cause la licéité des traitements déjà effectués.
            </p>
            <p>
              Ces droits s&apos;exercent en écrivant à{' '}
              <a href={`mailto:${email}`} className="link-editorial">
                {email}
              </a>
              . Vous avez par ailleurs le droit d&apos;introduire une réclamation
              auprès de la CNIL —{' '}
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="link-editorial"
              >
                www.cnil.fr
              </a>
              .
            </p>
          </LegalSection>

          <LegalSection title="Mentions légales">
            <p>
              L&apos;identité de l&apos;éditeur du site et de son hébergeur
              figure sur la page{' '}
              <Link href="/mentions-legales" className="link-editorial">
                mentions légales
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
