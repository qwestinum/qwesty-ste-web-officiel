import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'À propos',
  description: 'QWESTINUM accompagne les organisations qui veulent industrialiser leur usage de l\'IA sans renoncer à la rigueur de leurs opérations. Process First : l\'IA suit le processus.',
};

export const dynamic = 'force-dynamic';

const CITIES = [
  {
    name: 'Paris',
    role: 'Commercial & stratégie',
    description:
      "Point de contact privilégié des comités de direction et DSI. C'est ici que se discutent les cadrages stratégiques, les engagements contractuels et les feuilles de route à l'échelle Groupe.",
  },
  {
    name: 'Vienne',
    role: 'Développement Europe centrale',
    description:
      "Notre antenne pour les marchés germanophones et l'Europe centrale. Une porte d'entrée vers les organisations DACH et les écosystèmes industriels de la région.",
  },
  {
    name: 'Casablanca',
    role: 'Développement & opérations',
    description:
      "Centre névralgique de production. C'est ici que sont conçus, développés et industrialisés nos orchestrateurs, agents et plateformes — au plus près d'un écosystème technologique mature et de talents data spécialisés.",
  },
  {
    name: 'Tunis',
    role: 'Développement & opérations',
    description:
      "Pôle de production complémentaire en spécialités data et IA, qui renforce notre capacité d'exécution sur les projets multi-environnements et les déploiements à fort volume.",
  },
] as const;

const SERVICES = [
  {
    title: 'Conseil & cadrage',
    description:
      "Diagnostic IA gratuit, audit de processus, identification des cas d'usage à fort ROI, dossier de décision pour les comités de direction.",
  },
  {
    title: 'Solutions sur mesure',
    description:
      "Conception et déploiement d'orchestrateurs métier, d'agents conversationnels spécialisés, de plateformes d'automatisation intégrées à votre SI existant.",
  },
  {
    title: 'Formations',
    description:
      "Sessions d'acculturation pour les dirigeants, programmes techniques pour les équipes IT, ateliers de mise en pratique pour les métiers.",
  },
  {
    title: 'Support post-déploiement',
    description:
      "Maintenance évolutive, supervision des agents en production, accompagnement à la montée en compétence interne.",
  },
] as const;

export default function AboutPage() {
  return (
    <main>
      {/* HERO */}
      <section className="px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-12 md:pb-16">
        <div className="max-w-4xl mx-auto">
          <span className="label-mark">Notre maison</span>
          <h1 className="mt-3 font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-sepia tracking-tight-1 leading-tight">
            Une maison fondée sur le process,
            <br />
            ouverte sur l&apos;Europe et la Méditerranée.
          </h1>
          <p className="mt-6 font-sans text-lg md:text-xl text-pierre leading-relaxed max-w-3xl">
            QWESTINUM accompagne les organisations qui veulent industrialiser leur
            usage de l&apos;IA sans renoncer à la rigueur de leurs opérations. Nous
            traitons l&apos;IA comme une discipline d&apos;ingénierie : structurée,
            mesurée, intégrée au processus.
          </p>
        </div>
      </section>

      {/* SECTION 1 — FONDATION */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-20 bg-perle/20 border-y border-perle">
        <div className="max-w-4xl mx-auto">
          <span className="label-mark">Notre fondation</span>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl font-medium text-sepia tracking-tight-1 leading-tight mb-8">
            Process, qualité, data.
          </h2>

          <div className="space-y-6 font-sans text-base md:text-lg text-sepia leading-relaxed">
            <p>
              QWESTINUM ne s&apos;est pas construite sur une mode. Avant l&apos;IA
              générative, avant les agents, avant les LLM, son fondateur{' '}
              <strong className="font-medium">Imad Belfaqir</strong> a passé près de
              vingt ans dans la conduite de programmes complexes pour de grands
              groupes : pilotage de projets internationaux, qualité logicielle,
              gouvernance de la donnée, coordination d&apos;équipes décentralisées
              entre Europe et Maghreb.
            </p>

            <p>
              C&apos;est dans cette pratique des modèles d&apos;
              <strong className="font-medium">offshoring et de nearshoring</strong>{' '}
              — ces équilibres délicats où la qualité d&apos;exécution doit
              traverser plusieurs fuseaux, plusieurs cultures, plusieurs niveaux
              d&apos;exigence — qu&apos;a mûri la conviction qui structure
              aujourd&apos;hui notre maison :{' '}
              <em className="text-or-fonce not-italic font-medium">
                le processus précède la technologie
              </em>
              .
            </p>

            <p>
              Cet héritage est notre matière première. Nous n&apos;arrivons pas
              avec une réponse technologique en quête d&apos;un problème. Nous
              partons du processus existant — sa réalité, ses irritants, ses
              contraintes réglementaires — et nous y faisons entrer l&apos;IA
              seulement là où elle apporte une valeur démontrable.
            </p>

            <p className="text-pierre italic">
              C&apos;est ce que nous appelons{' '}
              <strong className="not-italic text-sepia">Process First</strong> :
              l&apos;intelligence artificielle suit le processus, jamais
              l&apos;inverse.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2 — GÉOGRAPHIE */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <span className="label-mark">Notre géographie</span>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl font-medium text-sepia tracking-tight-1 leading-tight mb-6">
              Une présence multi-pays, des partenaires solides.
            </h2>
            <p className="font-sans text-base md:text-lg text-pierre leading-relaxed mb-12">
              Pour servir des clients européens avec exigence, nous opérons depuis
              quatre villes complémentaires. Chaque site joue un rôle distinct dans
              notre chaîne de valeur, articulée autour de partenariats de confiance
              noués avec des acteurs locaux qualifiés — fruit direct de
              l&apos;expérience de notre fondateur dans les modèles distribués.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {CITIES.map((city) => (
              <article
                key={city.name}
                className="bg-lin border border-perle rounded-md p-6 md:p-7 flex flex-col"
              >
                <h3 className="font-serif text-2xl font-medium text-sepia tracking-tight-1 leading-none">
                  {city.name}
                </h3>
                <p className="mt-2 font-sans text-[11px] font-semibold uppercase tracking-wide-2 text-or-fonce">
                  {city.role}
                </p>
                <p className="mt-4 font-sans text-sm text-pierre leading-relaxed">
                  {city.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — MÉTIERS */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-perle/20 border-y border-perle">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <span className="label-mark">Nos métiers</span>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl font-medium text-sepia tracking-tight-1 leading-tight mb-6">
              Conseil, solutions, formations, support.
            </h2>
            <p className="font-sans text-base md:text-lg text-pierre leading-relaxed mb-12">
              QWESTINUM n&apos;est pas un cabinet de conseil pur, ni un éditeur de
              solutions, ni un organisme de formation. Nous sommes les trois —
              parce que la transformation par l&apos;IA exige les trois, dans le
              bon ordre.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            {SERVICES.map((service, idx) => (
              <article
                key={service.title}
                className="bg-lin border border-perle rounded-md p-6 md:p-7 flex gap-5"
              >
                <div className="font-serif text-3xl font-medium text-or-fonce/40 leading-none shrink-0 w-10">
                  0{idx + 1}
                </div>
                <div>
                  <h3 className="font-serif text-xl font-medium text-sepia tracking-tight-1">
                    {service.title}
                  </h3>
                  <p className="mt-2 font-sans text-sm text-pierre leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — SIGNATURE */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <span className="label-mark">Notre approche</span>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl font-medium text-sepia tracking-tight-1 leading-tight mb-8">
            Pas de POC dans un tiroir.
          </h2>

          <div className="space-y-5 font-sans text-base md:text-lg text-sepia leading-relaxed">
            <p>
              Nous ne livrons pas de « POC qui finissent dans un tiroir ». Nous
              engageons des solutions opérationnelles, mesurables, intégrées à vos
              processus réels. Cette discipline a un nom —{' '}
              <strong className="font-medium">Process First</strong> — et un coût
              en temps de cadrage qui se rentabilise sur la durée.
            </p>

            <p className="text-pierre">
              <strong className="text-sepia font-medium">
                Notre engagement de transparence
              </strong>{' '}
              : à chaque mission, nous quantifions ce que l&apos;IA peut faire, ce
              qu&apos;elle ne peut pas faire encore, et ce qui restera durablement
              du ressort humain.
            </p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-sepia">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-lin tracking-tight-1 leading-tight">
            Une question, un projet,
            <br />
            un cadrage à explorer ?
          </h2>
          <p className="mt-5 font-sans text-base md:text-lg text-perle leading-relaxed max-w-2xl mx-auto">
            Nos consultants répondent sous 24h ouvrées. Si votre besoin appelle un
            échange direct, nous proposons un diagnostic IA structuré d&apos;une
            heure, sans engagement.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`https://cal.com/${process.env.NEXT_PUBLIC_CAL_USERNAME ?? 'qwestinum/diagnostic'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !py-4 !px-7"
            >
              Diagnostic IA — réserver une heure
              <span aria-hidden="true">→</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-sm border border-perle/30 text-perle font-sans text-xs font-semibold uppercase tracking-wide-2 hover:bg-lin/5 hover:border-perle/60 transition-colors"
            >
              Nous écrire
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
