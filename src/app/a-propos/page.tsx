import type { Metadata } from 'next';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { CtaBanner } from '@/components/shared/CtaBanner';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'À propos',
  description:
    "L'humain derrière Qwestinum — vingt ans à déceler, corriger et automatiser les processus qui font tourner les organisations.",
};

const PRINCIPLES = [
  {
    num: '01',
    title: 'Le problème avant la solution',
    desc: "Chaque mission commence par comprendre le processus réel. L'IA n'est déployée que là où elle crée une valeur mesurable.",
  },
  {
    num: '02',
    title: 'Des livrables concrets, pas des slides',
    desc: 'Chaque engagement produit quelque chose de tangible — diagnostic documenté, prototype fonctionnel, solution en production.',
  },
  {
    num: '03',
    title: 'Le risque partagé comme engagement',
    desc: 'En Phase 1, Qwestinum absorbe le risque du diagnostic. Ce n\u2019est pas une concession — c\u2019est la preuve de la confiance dans les résultats.',
  },
  {
    num: '04',
    title: 'La mesure comme boussole',
    desc: 'Chaque solution est accompagnée d\u2019indicateurs définis dès le départ. Pas de succès sans définition préalable de ce que ça veut dire.',
  },
];

export default function AProposPage() {
  return (
    <>
      <Header />
      <main>
        <PageHeader
          kicker="À propos de Qwestinum"
          titlePrefix="L'humain derrière"
          titleAccent="l'IA."
          intro="Qwestinum est né d'une conviction construite sur vingt ans de terrain : l'intelligence artificielle ne transforme pas une organisation si elle n'est pas d'abord ancrée dans une compréhension fine de ses processus, de ses équipes et de ses contraintes réelles."
        />

        {/* Bloc identité fondateur */}
        <section className="border-b border-perle bg-perle/20">
          <div className="container-page py-14 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-center">
            <div className="md:col-span-3">
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mx-auto md:mx-0 border border-perle">
                <Image
                  src="/imad-belfaqir.png"
                  alt="Imad Belfaqir, fondateur de Qwestinum"
                  fill
                  sizes="(max-width: 768px) 128px, 160px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <div className="md:col-span-6 text-center md:text-left">
              <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight-1 text-sepia">
                Imad Belfaqir
              </h2>
              <p className="mt-2 font-sans text-base text-pierre">
                Fondateur de <span className="text-or-fonce">Qwestinum</span> · Conseil, solutions et formations en IA
              </p>
            </div>
            <div className="md:col-span-3 md:border-l md:border-perle md:pl-8">
              <div className="label-mark mb-3 text-center md:text-left">Présence</div>
              <ul className="flex flex-wrap md:flex-col gap-3 justify-center md:justify-start">
                {SITE_CONFIG.locations.map((loc) => (
                  <li key={loc} className="flex items-center gap-2.5">
                    <span className="block w-1.5 h-1.5 rounded-full bg-or" />
                    <span className="font-sans text-sm font-medium text-sepia tracking-wide-1">
                      {loc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Récit fondateur */}
        <section className="border-b border-perle">
          <div className="container-page py-20 md:py-28 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-3">
              <span className="label-mark">Le parcours</span>
            </div>
            <div className="lg:col-span-9 max-w-3xl">
              <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight tracking-tight-1 text-sepia">
                Vingt ans à déceler, corriger et automatiser les processus qui font tourner les organisations.
              </h2>
              <div className="mt-10 space-y-5 font-sans text-base md:text-lg leading-relaxed text-pierre">
                <p>
                  Depuis le premier jour de ma carrière, mon métier a été <span className="text-sepia">le processus</span>. Le déceler là où personne ne le voyait, le mettre en lumière, le corriger, le structurer, puis l'automatiser. C'est le fil rouge qui relie toutes mes expériences, du management d'équipes de développement jusqu'aux missions de conseil les plus récentes.
                </p>
                <p>
                  Dans un premier temps au sein du <span className="text-sepia">Groupe TéNOR</span>, puis en tant que consultant expert indépendant pour <span className="text-sepia">Bpifrance</span> et <span className="text-sepia">BNP Paribas Cardif</span>, j'ai piloté des équipes pluridisciplinaires sur des environnements technologiques variés — Web, Mobile, Back-end, services, banking. À chaque fois, le cœur du travail a été le même : observer comment les choses se font réellement, identifier les frictions, reconstruire ce qui ralentit.
                </p>
                <p>
                  La <span className="text-sepia">qualité</span> a toujours été mon terrain privilégié. Stratégies de test, continuous testing, programmes d'automatisation, structuration de patrimoines, déploiement de doctrines à l'échelle d'une DSI — j'ai construit des dispositifs qui ne tiennent pas sur une slide mais sur le long terme, avec des équipes qui se les approprient.
                </p>
                <p>
                  J'ai aussi <span className="text-sepia">bâti et opéré des collaborations internationales</span> — offshoring et nearshoring — en structurant les modèles opérationnels, les rituels, les interfaces et les indicateurs qui permettent à des équipes distribuées de livrer avec la même exigence qu'une équipe locale. Un exercice qui oblige à formaliser ce qui, en co-localisation, peut rester implicite.
                </p>
                <p>
                  De cette double lecture — <span className="text-sepia">la discipline du processus et la maîtrise technique</span> — est née Qwestinum. Un cabinet qui part du problème, pas de l'outil. Qui construit des solutions mesurables, intégrées, durables. Et qui utilise l'IA là où elle crée une valeur réelle, pas là où elle fait bien sur une slide.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Vision + principes */}
        <section className="grid grid-cols-1 lg:grid-cols-2 border-b border-perle">
          <div className="bg-sepia text-lin py-16 md:py-20 px-6 md:px-10 lg:px-16 relative overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, transparent 0px, transparent 30px, #D4A82C 30px, #D4A82C 31px)',
              }}
            />
            <div className="relative max-w-xl">
              <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight tracking-tight-1 text-lin">
                Pourquoi Qwestinum ?
              </h2>
              <div className="mt-7 space-y-5 font-sans text-base leading-relaxed text-perle">
                <p>
                  Parce que trop de projets IA échouent non pas par manque de technologie, mais par manque de compréhension des processus qu'ils sont censés transformer.
                </p>
                <p>
                  <span className="text-lin">L'IA ne se déploie pas dans le vide.</span> Elle s'intègre dans des organisations, des workflows, des contraintes métier et des équipes humaines. C'est précisément ce que vingt ans de terrain m'ont appris à cartographier, sécuriser et améliorer.
                </p>
                <p>
                  Qwestinum apporte cette double lecture : la rigueur du pilotage opérationnel qui sait où se cachent les risques et les frictions, combinée à la maîtrise de l'IA pour construire des solutions qui tiennent dans la durée.
                </p>
              </div>
            </div>
          </div>

          <div className="py-16 md:py-20 px-6 md:px-10 lg:px-16">
            <span className="label-mark">Principes de travail</span>
            <div className="mt-7 divide-y divide-perle">
              {PRINCIPLES.map((p) => (
                <div key={p.num} className="flex gap-5 py-6">
                  <div className="font-sans text-xs font-semibold text-or-fonce shrink-0 pt-1 tracking-wide-1">
                    {p.num}
                  </div>
                  <div>
                    <h3 className="font-serif text-base md:text-lg font-medium text-sepia tracking-tight-1">
                      {p.title}
                    </h3>
                    <p className="mt-2 font-sans text-sm leading-relaxed text-pierre">
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CtaBanner
          text="Vous voulez échanger sur votre contexte et identifier les leviers IA les plus pertinents pour votre organisation ?"
          ctaLabel="Prendre contact"
        />
      </main>
      <Footer />
    </>
  );
}
