import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { CtaBanner } from '@/components/shared/CtaBanner';
import { EmptyState } from '@/components/shared/EmptyState';
import { FormationCard } from '@/components/formations/FormationCard';
import { FlagshipProgramme } from '@/components/formations/FlagshipProgramme';
import { getFlagshipModules, getPublishedFormations } from '@/lib/queries/formations';

export const metadata: Metadata = {
  title: 'Formations',
  description:
    'Catalogue complet des formations Qwestinum — programme flagship 6 mois et formations modulaires de 1 à 3 jours, sur l\'IA appliquée aux organisations.',
};

export const revalidate = 300;

const FORMATS = [
  {
    title: 'Inter-entreprises',
    desc: 'Sessions ouvertes en petit groupe (8 à 12 participants). Idéal pour l\u2019échange entre pairs.',
  },
  {
    title: 'Intra-entreprise',
    desc: 'Session dédiée à vos équipes, adaptée à votre contexte. Possibilité de travailler sur vos cas métier réels.',
  },
  {
    title: 'Distanciel',
    desc: 'Programme en visio structuré par sessions courtes (3 à 4h) avec exercices entre les sessions.',
  },
  {
    title: 'Sur mesure',
    desc: 'Parcours entièrement construit à partir de vos enjeux. Combinaison de modules existants et de contenus dédiés.',
  },
];

export default async function FormationsPage() {
  const [formations, modules] = await Promise.all([
    getPublishedFormations(),
    getFlagshipModules(),
  ]);

  // Sépare flagship vs modulaires
  const flagshipFormations = formations.filter((f) => f.is_flagship);
  const modularFormations = formations.filter((f) => !f.is_flagship);

  return (
    <>
      <Header />
      <main>
        <PageHeader
          kicker="Catalogue des formations Qwestinum"
          titlePrefix="Des formations qui forment à"
          titleAccent="exécuter."
          intro="Chez Qwestinum, nous ne formons pas à comprendre l'IA. Nous formons des professionnels capables de piloter la transformation de leur organisation avec elle — de la stratégie jusqu'au système déployé."
        />

        {/* Philosophie */}
        <section className="border-b border-perle">
          <div className="container-page py-16 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-3">
              <span className="label-mark">Notre approche</span>
            </div>
            <div className="lg:col-span-9 max-w-3xl">
              <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight tracking-tight-1 text-sepia">
                Ce que vous apprenez est ce que vous déployez.
              </h2>
              <div className="mt-7 space-y-5 font-sans text-base md:text-lg leading-relaxed text-pierre">
                <p>
                  La plupart des formations vous expliquent ce qu'est l'IA. <span className="text-sepia">Les nôtres vous apprennent à transformer vos processus avec.</span> Chaque programme est conçu autour d'un projet réel de votre organisation — pas de cas fictifs, pas de simulation.
                </p>
                <p>
                  Nos parcours sont ancrés dans la méthode <span className="text-sepia">Process First</span> : on part du problème métier, on cartographie les frictions, on évalue la valeur, et on construit uniquement ce qui a du sens. Zéro hype, zéro bullshit, zéro livrable qui reste dans un tiroir.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Programme flagship */}
        {modules.length > 0 && <FlagshipProgramme modules={modules} />}

        {/* Formations modulaires */}
        <section className="py-20 md:py-28">
          <div className="container-page">
            <div className="max-w-2xl mb-14">
              <span className="label-mark">Formations modulaires</span>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl font-normal leading-tight tracking-tighter-2 text-sepia">
                Des formats <em className="italic text-or-fonce">courts, ciblés, actionnables.</em>
              </h2>
              <p className="mt-5 font-sans text-base md:text-lg leading-relaxed text-pierre">
                Pour les équipes qui ne peuvent pas s'engager sur un programme de 6 mois mais qui veulent monter en compétences sur un sujet précis. Disponibles en inter-entreprises, en intra ou en distanciel.
              </p>
            </div>

            {modularFormations.length === 0 ? (
              <EmptyState
                title="Le catalogue modulaire est en construction"
                description="Les formations modulaires seront publiées prochainement. Contactez-nous pour discuter d'une formation sur mesure."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {modularFormations.map((f) => (
                  <FormationCard key={f.id} formation={f} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Formats */}
        <section className="bg-perle/30 border-y border-perle py-20 md:py-24">
          <div className="container-page">
            <div className="max-w-2xl mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight tracking-tight-1 text-sepia">
                Trois formats pour s'adapter à votre organisation.
              </h2>
              <p className="mt-4 font-sans text-base leading-relaxed text-pierre">
                Toutes nos formations sont disponibles en inter, intra ou distanciel — avec adaptation possible à votre contexte métier.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {FORMATS.map((format) => (
                <article
                  key={format.title}
                  className="bg-lin border border-perle rounded-md p-6"
                >
                  <h3 className="font-serif text-base font-medium tracking-tight-1 text-sepia">
                    {format.title}
                  </h3>
                  <p className="mt-2 font-sans text-xs leading-relaxed text-pierre">
                    {format.desc}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <CtaBanner
          text="Vous voulez recevoir le catalogue complet avec tarifs, dates et possibilités de financement ?"
          ctaLabel="Recevoir le catalogue"
        />
      </main>
      <Footer />
    </>
  );
}
