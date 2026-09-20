import { Emphasis } from '@/components/shared/Emphasis';

const STEPS = [
  {
    num: '01',
    title: 'Découverte',
    desc: 'Objectifs métiers, données disponibles, contraintes et succès attendus. On pose le cadre et les indicateurs.',
  },
  {
    num: '02',
    title: 'Prototype',
    desc: "Preuve de concept rapide pour valider les capacités et l'expérience utilisateur avant d'investir plus largement.",
  },
  {
    num: '03',
    title: 'Déploiement',
    desc: 'Intégration sécurisée à vos systèmes, préparation à l’échelle, performances et observabilité.',
  },
  {
    num: '04',
    title: 'Amélioration continue',
    desc: 'Itérations, supervision humaine, qualité des données, réduction des coûts, montée en charge.',
  },
] as const;

/**
 * Le parcours en quatre temps.
 * L'ancienne inversion sombre est abandonnée : la charte ORQA ne connaît
 * que l'alternance crème / blanc. La mise en avant passe ici par les
 * cartes « chaudes » (ivoire + filet jaune).
 */
export function Approach() {
  return (
    <section className="section-padding bg-cream" id="methode">
      <div className="container-page">
        <div className="mb-14 max-w-3xl md:mb-20">
          <span className="eyebrow">Notre méthode</span>
          <h2 className="mt-4 font-sans text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Process First — le problème avant la <Emphasis>technologie.</Emphasis>
          </h2>
          <p className="mt-6 font-sans text-lg leading-relaxed text-ink-muted">
            Parce que 90 % des projets IA échouent non par manque de technologie,
            mais par manque de compréhension des processus qu&apos;ils sont censés
            transformer.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div key={step.num} className="card-warm h-full p-7 sm:p-8">
              <div className="font-sans text-4xl font-bold leading-none tracking-tight text-accent-deep">
                {step.num}
              </div>
              <h3 className="mt-6 font-sans text-xl font-bold tracking-tight text-ink">
                {step.title}
              </h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
