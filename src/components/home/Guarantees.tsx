const GUARANTEES = [
  {
    title: 'RGPD compliant',
    desc: 'Hébergement UE possible, gestion des données conforme.',
    icon: (
      <>
        <path d="M12 2l9 4v6c0 5-4 9-9 10-5-1-9-5-9-10V6l9-4z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
  {
    title: 'AI Act ready',
    desc: 'Conformité aux exigences européennes sur l\u2019IA.',
    icon: (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    ),
  },
  {
    title: 'Risque partagé',
    desc: 'Phase 1 diagnostic sans engagement ferme.',
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </>
    ),
  },
  {
    title: 'Audits éthiques',
    desc: 'Analyse des biais et transparence sur demande.',
    icon: (
      <>
        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
] as const;

export function Guarantees() {
  return (
    <section className="bg-perle/40 border-y border-perle py-20 md:py-24">
      <div className="container-page">

        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-16">
          <span className="label-mark">Garanties & conformité</span>
          <h2 className="mt-4 font-serif text-3xl md:text-4xl font-normal leading-tight tracking-tighter-2 text-sepia">
            Quatre engagements <em className="italic text-or-fonce">non négociables.</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {GUARANTEES.map((g) => (
            <article
              key={g.title}
              className="bg-lin border border-perle rounded-md p-6 flex gap-4 items-start"
            >
              <div className="w-11 h-11 rounded shrink-0 bg-sepia flex items-center justify-center">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FBFAF7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {g.icon}
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-base font-medium tracking-tight-1 text-sepia">
                  {g.title}
                </h3>
                <p className="mt-1 font-sans text-xs leading-relaxed text-pierre">
                  {g.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
