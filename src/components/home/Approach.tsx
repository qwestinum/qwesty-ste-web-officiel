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
    desc: 'Intégration sécurisée à vos systèmes, préparation à l\u2019échelle, performances et observabilité.',
  },
  {
    num: '04',
    title: 'Amélioration continue',
    desc: 'Itérations, supervision humaine, qualité des données, réduction des coûts, montée en charge.',
  },
] as const;

export function Approach() {
  return (
    <section className="bg-sepia text-lin py-20 md:py-28 relative overflow-hidden">

      {/* Texture diagonale très subtile en fond */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent 0px, transparent 30px, #D4A82C 30px, #D4A82C 31px)',
        }}
      />

      <div className="container-page relative">
        <div className="max-w-3xl mb-14 md:mb-20">
          <span className="font-sans text-xs font-medium uppercase tracking-wide-2 text-or">
            Notre méthode
          </span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl font-normal leading-tight tracking-tighter-2 text-lin">
            Process First — le problème avant la <em className="italic text-or">technologie.</em>
          </h2>
          <p className="mt-6 font-sans text-lg leading-relaxed text-perle">
            Parce que 90% des projets IA échouent non par manque de technologie, mais par manque de compréhension des processus qu'ils sont censés transformer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-pierre/30">
          {STEPS.map((step) => (
            <div key={step.num} className="bg-sepia p-8 md:p-10">
              <div className="font-serif text-5xl font-medium tracking-tighter-2 text-or leading-none">
                {step.num}
              </div>
              <h3 className="mt-6 font-serif text-xl font-medium tracking-tight-1 text-lin">
                {step.title}
              </h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-perle">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
