import Image from 'next/image';
import { Emphasis } from '@/components/shared/Emphasis';

const ITEMS = [
  {
    src: '/visuals/orchestrateur.svg',
    label: 'Orchestrateur',
    title: 'Une entreprise virtuelle composée d\'agents.',
    description:
      "Cinq départements, dix-sept agents, un orchestrateur qui les coordonne. Chaque agent a son périmètre, ses entrées-sorties, son seuil de validation humaine.",
  },
  {
    src: '/visuals/dashboard.svg',
    label: 'Dashboard',
    title: 'Mesurer ce qui compte vraiment.',
    description:
      "Throughput par heure, coût par tâche, taux de validation humaine, file d'attente. Pas de vanity metrics : les indicateurs qui pilotent une production IA en conditions réelles.",
  },
  {
    src: '/visuals/validation.svg',
    label: 'Validation',
    title: 'L\'humain reste aux commandes.',
    description:
      "Chaque processus inclut des points de validation humaine configurables. L'IA accélère, mais l'humain décide où il y a un risque, un enjeu, une responsabilité.",
  },
];

export function Showcase() {
  return (
    <section className="section-padding bg-cream">
      <div className="container-page">
        {/* En-tête section */}
        <div className="mb-14 max-w-3xl md:mb-16">
          <span className="eyebrow">Ce que nous construisons</span>
          <h2 className="mt-4 font-sans text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Des plateformes pensées <Emphasis>comme une entreprise.</Emphasis>
          </h2>
          <p className="mt-6 max-w-2xl font-sans text-lg leading-relaxed text-ink-muted">
            Pas un chatbot greffé sur un site. Pas un POC qui finit dans un tiroir.
            Une infrastructure d&apos;agents, mesurée, supervisée, qui exécute vos
            processus avec l&apos;humain dans la boucle.
          </p>
        </div>

        {/* Grille 3 visuels */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {ITEMS.map((item) => (
            <article key={item.label} className="group flex flex-col">
              {/* Visuel */}
              <div className="relative mb-5 aspect-[4/3] w-full overflow-hidden rounded-2xl border border-hairline bg-white shadow-soft transition-shadow duration-200 group-hover:shadow-lift">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 400px"
                  className="object-cover object-top"
                />
              </div>

              {/* Texte */}
              <div>
                <span className="eyebrow">{item.label}</span>
                <h3 className="mt-2 font-sans text-xl font-bold leading-snug tracking-tight text-ink md:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
