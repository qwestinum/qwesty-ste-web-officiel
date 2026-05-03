import Image from 'next/image';

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
    <section className="py-20 md:py-28 border-b border-perle bg-lin">
      <div className="container-page">
        {/* En-tête section */}
        <div className="max-w-3xl mb-14 md:mb-16">
          <span className="label-mark">Ce que nous construisons</span>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl font-medium leading-tight tracking-tight-1 text-sepia">
            Des plateformes pensées <em className="italic text-or-fonce">comme une entreprise.</em>
          </h2>
          <p className="mt-6 font-sans text-lg leading-relaxed text-pierre max-w-2xl">
            Pas un chatbot greffé sur un site. Pas un POC qui finit dans un tiroir.
            Une infrastructure d'agents, mesurée, supervisée, qui exécute vos
            processus avec l'humain dans la boucle.
          </p>
        </div>

        {/* Grille 3 visuels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {ITEMS.map((item) => (
            <article
              key={item.label}
              className="group flex flex-col"
            >
              {/* Visuel */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md border border-perle bg-perle/30 mb-5 transition-shadow group-hover:shadow-md">
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
                <span className="label-mark">{item.label}</span>
                <h3 className="mt-2 font-serif text-xl md:text-2xl font-medium leading-tight tracking-tight-1 text-sepia">
                  {item.title}
                </h3>
                <p className="mt-3 font-sans text-sm leading-relaxed text-pierre">
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
