import { Emphasis } from '@/components/shared/Emphasis';

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
    desc: 'Conformité aux exigences européennes sur l’IA.',
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
    <section className="section-padding bg-cream" id="conformite">
      <div className="container-page">

        <div className="mx-auto mb-14 max-w-2xl text-center md:mb-16">
          <span className="eyebrow">Garanties &amp; conformité</span>
          <h2 className="mt-4 font-sans text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
            Quatre engagements <Emphasis>non négociables.</Emphasis>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {GUARANTEES.map((g) => (
            <article
              key={g.title}
              className="card-cool flex items-start gap-4 p-6"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1A6E99"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {g.icon}
                </svg>
              </div>
              <div>
                <h3 className="font-sans text-base font-bold tracking-tight text-ink">
                  {g.title}
                </h3>
                <p className="mt-1 font-sans text-xs leading-relaxed text-ink-muted">
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
