import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LogoSymbol } from '@/components/brand/Logo';

export const metadata: Metadata = {
  title: 'À propos',
  description:
    "QWESTINUM accompagne les organisations qui veulent industrialiser leur usage de l'IA sans renoncer à la rigueur de leurs opérations. Process First : l'IA suit le processus.",
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
    <>
      <Header />

      <main>
        {/* HERO — avec logo symbole en exergue */}
        <section className="bg-cream pb-12 pt-16 md:pb-16 md:pt-24">
          <div className="container-page max-w-4xl">
            <div className="mb-6 flex items-start gap-6 md:gap-8">
              <LogoSymbol className="size-20 shrink-0 md:size-24" />
              <div className="pt-2">
                <span className="eyebrow">Notre maison</span>
              </div>
            </div>

            <h1 className="font-sans text-4xl font-bold leading-display tracking-tight text-ink md:text-5xl lg:text-6xl">
              Une maison fondée sur le process,
              <br />
              ouverte sur l&apos;Europe et la Méditerranée.
            </h1>
            <p className="mt-6 max-w-3xl font-sans text-lg leading-relaxed text-ink-muted md:text-xl">
              QWESTINUM accompagne les organisations qui veulent industrialiser
              leur usage de l&apos;IA sans renoncer à la rigueur de leurs
              opérations. Nous traitons l&apos;IA comme une discipline
              d&apos;ingénierie : structurée, mesurée, intégrée au processus.
            </p>
          </div>
        </section>

        {/* SECTION 1 — FONDATION avec photo Imad */}
        <section className="section-padding border-y border-hairline bg-white">
          <div className="container-page max-w-4xl">
            <span className="eyebrow">Notre fondation</span>
            <h2 className="mb-10 mt-3 font-sans text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
              Process, qualité, data.
            </h2>

            <div className="flex flex-col md:flex-row gap-8 md:gap-10">
              {/* Photo en cercle */}
              <div className="shrink-0 mx-auto md:mx-0">
                <div className="relative size-40 overflow-hidden rounded-full border-2 border-sun shadow-lift md:size-48">
                  <Image
                    src="/imad-belfaqir.png"
                    alt="Imad Belfaqir, fondateur de Qwestinum"
                    fill
                    sizes="(max-width: 768px) 160px, 192px"
                    className="object-cover"
                    priority
                  />
                </div>
                <p className="mt-3 text-center font-sans text-xs text-ink-muted md:text-left">
                  <span className="block font-bold text-ink">Imad Belfaqir</span>
                  <span className="block">Fondateur</span>
                </p>
              </div>

              {/* Prose */}
              <div className="flex-1 space-y-6 font-sans text-base leading-relaxed text-ink md:text-lg">
                <p>
                  QWESTINUM ne s&apos;est pas construite sur une mode. Avant
                  l&apos;IA générative, avant les agents, avant les LLM, son
                  fondateur{' '}
                  <strong className="font-bold">Imad Belfaqir</strong> a passé
                  près de vingt ans dans la conduite de programmes complexes pour
                  de grands groupes : pilotage de projets internationaux, qualité
                  logicielle, gouvernance de la donnée, coordination
                  d&apos;équipes décentralisées entre Europe et Maghreb.
                </p>

                <p>
                  C&apos;est dans cette pratique des modèles d&apos;
                  <strong className="font-bold">offshoring et de nearshoring</strong>{' '}
                  — ces équilibres délicats où la qualité d&apos;exécution doit
                  traverser plusieurs fuseaux, plusieurs cultures, plusieurs
                  niveaux d&apos;exigence — qu&apos;a mûri la conviction qui
                  structure aujourd&apos;hui notre maison :{' '}
                  <strong className="font-bold text-accent-deep">
                    le processus précède la technologie
                  </strong>
                  .
                </p>

                <p>
                  Cet héritage est notre matière première. Nous n&apos;arrivons
                  pas avec une réponse technologique en quête d&apos;un problème.
                  Nous partons du processus existant — sa réalité, ses
                  irritants, ses contraintes réglementaires — et nous y faisons
                  entrer l&apos;IA seulement là où elle apporte une valeur
                  démontrable.
                </p>

                <p className="italic text-ink-muted">
                  C&apos;est ce que nous appelons{' '}
                  <strong className="not-italic font-bold text-ink">Process First</strong>{' '}
                  : l&apos;intelligence artificielle suit le processus, jamais
                  l&apos;inverse.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2 — GÉOGRAPHIE */}
        <section className="section-padding bg-cream">
          <div className="container-page">
            <div className="max-w-3xl">
              <span className="eyebrow">Notre géographie</span>
              <h2 className="mb-6 mt-3 font-sans text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
                Une présence multi-pays, des partenaires solides.
              </h2>
              <p className="mb-12 font-sans text-base leading-relaxed text-ink-muted md:text-lg">
                Pour servir des clients européens avec exigence, nous opérons
                depuis quatre villes complémentaires. Chaque site joue un rôle
                distinct dans notre chaîne de valeur, articulée autour de
                partenariats de confiance noués avec des acteurs locaux qualifiés
                — fruit direct de l&apos;expérience de notre fondateur dans les
                modèles distribués.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {CITIES.map((city) => (
                <article
                  key={city.name}
                  className="card-cool flex flex-col p-6 md:p-7"
                >
                  <h3 className="font-sans text-2xl font-bold leading-none tracking-tight text-ink">
                    {city.name}
                  </h3>
                  <p className="mt-2 font-sans text-[11px] font-bold uppercase tracking-eyebrow text-accent-deep">
                    {city.role}
                  </p>
                  <p className="mt-4 font-sans text-sm leading-relaxed text-ink-muted">
                    {city.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3 — MÉTIERS */}
        <section className="section-padding border-y border-hairline bg-white">
          <div className="container-page">
            <div className="max-w-3xl">
              <span className="eyebrow">Nos métiers</span>
              <h2 className="mb-6 mt-3 font-sans text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
                Conseil, solutions, formations, support.
              </h2>
              <p className="mb-12 font-sans text-base leading-relaxed text-ink-muted md:text-lg">
                QWESTINUM n&apos;est pas un cabinet de conseil pur, ni un éditeur
                de solutions, ni un organisme de formation. Nous sommes les trois
                — parce que la transformation par l&apos;IA exige les trois, dans
                le bon ordre.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
              {SERVICES.map((service, idx) => (
                <article
                  key={service.title}
                  className="card-warm flex gap-5 p-6 md:p-7"
                >
                  <div className="w-10 shrink-0 font-sans text-3xl font-bold leading-none tracking-tight text-accent-deep">
                    0{idx + 1}
                  </div>
                  <div>
                    <h3 className="font-sans text-xl font-bold tracking-tight text-ink">
                      {service.title}
                    </h3>
                    <p className="mt-2 font-sans text-sm leading-relaxed text-ink-muted">
                      {service.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4 — SIGNATURE */}
        <section className="section-padding bg-cream">
          <div className="container-page max-w-4xl">
            <span className="eyebrow">Notre approche</span>
            <h2 className="mb-8 mt-3 font-sans text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
              Pas de POC dans un tiroir.
            </h2>

            <div className="space-y-5 font-sans text-base leading-relaxed text-ink md:text-lg">
              <p>
                Nous ne livrons pas de « POC qui finissent dans un tiroir ». Nous
                engageons des solutions opérationnelles, mesurables, intégrées à
                vos processus réels. Cette discipline a un nom —{' '}
                <strong className="font-bold">Process First</strong> — et un
                coût en temps de cadrage qui se rentabilise sur la durée.
              </p>

              <p className="text-ink-muted">
                <strong className="font-bold text-ink">
                  Notre engagement de transparence
                </strong>{' '}
                : à chaque mission, nous quantifions ce que l&apos;IA peut faire,
                ce qu&apos;elle ne peut pas faire encore, et ce qui restera
                durablement du ressort humain.
              </p>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="section-padding relative overflow-hidden bg-white">
          <div className="container-page relative">
            <div className="relative mx-auto max-w-4xl">
              <div
                aria-hidden="true"
                className="halo-radial pointer-events-none absolute -inset-x-16 -inset-y-14"
              />
              <div className="card-warm relative rounded-3xl p-8 text-center sm:p-10 lg:p-14">
                <h2 className="font-sans text-3xl font-bold leading-display tracking-tight text-ink sm:text-4xl">
                  Une question, un projet,
                  <br />
                  un cadrage à explorer ?
                </h2>
                <p className="mx-auto mt-5 max-w-2xl font-sans text-base leading-relaxed text-ink-muted md:text-lg">
                  Nos consultants répondent sous 24h ouvrées. Si votre besoin appelle
                  un échange direct, nous proposons un diagnostic IA structuré
                  d&apos;une heure, sans engagement.
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link href="/contact#diagnostic" className="btn-primary w-full sm:w-auto">
                    Diagnostic IA — réserver une heure
                    <span aria-hidden="true">→</span>
                  </Link>
                  <Link href="/contact#formulaire" className="btn-secondary w-full sm:w-auto">
                    Nous écrire
                  </Link>
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
