import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { ContactForm } from '@/components/contact/ContactForm';
import { CalEmbed } from '@/components/contact/CalEmbed';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Prenez rendez-vous pour un diagnostic IA gratuit de 30 minutes ou écrivez-nous pour toute autre demande.',
};

export const dynamic = 'force-static';

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <PageHeader
          kicker="Parlons de votre projet"
          titlePrefix="De l'idée à"
          titleAccent="l'échange."
          intro="Deux façons d'entrer en contact : réservez directement un diagnostic gratuit de 30 minutes, ou écrivez-nous pour toute autre demande. Nous répondons sous 24 h ouvrées."
        />

        {/* Diagnostic gratuit avec Cal.com */}
        <section id="diagnostic" className="py-16 md:py-20 border-b border-perle">
          <div className="container-page max-w-4xl">
            <div className="mb-10 text-center">
              <span className="label-mark">Diagnostic gratuit</span>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl font-medium leading-tight tracking-tight-1 text-sepia">
                30 minutes pour identifier <em className="italic text-or-fonce">vos leviers IA.</em>
              </h2>
            </div>

            <CalEmbed />
          </div>
        </section>

        {/* Formulaire de contact général */}
        <section id="formulaire" className="py-16 md:py-20 bg-perle/30 border-b border-perle">
          <div className="container-page">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">

              <div className="lg:col-span-4">
                <span className="label-mark">Autres demandes</span>
                <h2 className="mt-4 font-serif text-3xl md:text-4xl font-medium leading-tight tracking-tight-1 text-sepia">
                  Une demande plus longue ? <em className="italic text-or-fonce">Écrivez-nous.</em>
                </h2>
                <p className="mt-5 font-sans text-base leading-relaxed text-pierre">
                  Catalogue de formations, RFP, partenariat, prise de parole, demande presse… Le formulaire est le bon canal pour les sujets qui demandent du contexte.
                </p>

                <div className="mt-10 space-y-4 pt-8 border-t border-perle">
                  <div>
                    <div className="label-mark mb-1">Email direct</div>
                    <a
                      href={`mailto:${SITE_CONFIG.contact.email}`}
                      className="font-sans text-sepia hover:text-or-fonce transition-colors"
                    >
                      {SITE_CONFIG.contact.email}
                    </a>
                  </div>
                  <div>
                    <div className="label-mark mb-1">Téléphone</div>
                    <a
                      href={`tel:${SITE_CONFIG.contact.phone.replace(/\s/g, '')}`}
                      className="font-sans text-sepia hover:text-or-fonce transition-colors"
                    >
                      {SITE_CONFIG.contact.phone}
                    </a>
                  </div>
                  <div>
                    <div className="label-mark mb-1">Présence</div>
                    <p className="font-sans text-sm text-pierre">
                      {SITE_CONFIG.locations.join(' · ')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8">
                <div className="bg-lin border border-perle rounded-md p-7 md:p-10">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
