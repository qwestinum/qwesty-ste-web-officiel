import Link from 'next/link';

const SERVICES = [
  {
    number: 'I',
    title: 'Audit & Consulting',
    summary:
      "Évaluez votre maturité IA, identifiez les cas d'usage à fort ROI et sécurisez vos choix techniques et organisationnels.",
    items: [
      'Audit de maturité & cartographie des processus',
      'Feuille de route 6 à 24 mois',
      'Études de faisabilité & ROI prévisionnel',
      'Gouvernance, RGPD & éthique',
    ],
    cta: { href: '/#contact', label: 'Demander un audit' },
  },
  {
    number: 'II',
    title: 'Solutions sur mesure',
    summary:
      "Concevez et déployez des agents intelligents, des modèles prédictifs et des automatisations intégrées à vos outils existants.",
    items: [
      'Agents conversationnels (chat & voice)',
      'Automatisation & intégration CRM/ERP',
      'Analyse prédictive & décisionnelle',
      'Architectures multi-agents',
    ],
    cta: { href: '/cas-usage', label: 'Voir les cas d\u2019usage' },
  },
  {
    number: 'III',
    title: 'Formations',
    summary:
      'Montez en compétences pour utiliser, piloter et diffuser l\u2019IA en interne — du niveau débutant à avancé.',
    items: [
      'Programme flagship 6 mois — Executive',
      'Formations modulaires (1 à 3 jours)',
      'Inter, intra, distanciel, sur mesure',
      'IA responsable & conformité',
    ],
    cta: { href: '/formations', label: 'Voir les formations' },
  },
] as const;

export function Services() {
  return (
    <section className="py-20 md:py-28" id="services">
      <div className="container-page">

        <div className="max-w-3xl mb-16 md:mb-20">
          <span className="label-mark">Nos services</span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl font-normal leading-tight tracking-tighter-2 text-sepia">
            Trois offres complémentaires pour passer de la vision à la <em className="italic text-or-fonce">valeur réelle.</em>
          </h2>
          <p className="mt-6 font-sans text-lg leading-relaxed text-pierre">
            Sans perdre de temps, sans perdre de budget, avec des livrables concrets à chaque étape.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-perle">
          {SERVICES.map((service) => (
            <ServiceCard key={service.number} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: typeof SERVICES[number] }) {
  return (
    <article className="bg-lin p-8 md:p-10 flex flex-col group transition-colors duration-300 hover:bg-perle/30">
      <div className="font-serif italic text-lg text-or-fonce mb-3">{service.number}.</div>

      <h3 className="font-serif text-2xl md:text-3xl font-medium leading-tight tracking-tight-1 text-sepia">
        {service.title}
      </h3>

      <p className="mt-4 font-sans text-sm leading-relaxed text-pierre">
        {service.summary}
      </p>

      <ul className="mt-6 space-y-2.5 flex-1">
        {service.items.map((item) => (
          <li
            key={item}
            className="flex gap-3 font-sans text-sm text-sepia leading-relaxed"
          >
            <span className="block w-1 h-1 rounded-full bg-or mt-2 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <Link
        href={service.cta.href}
        className="mt-8 pt-5 border-t border-perle font-sans text-xs font-semibold uppercase tracking-wide-2 text-or-fonce hover:text-sepia transition-colors inline-flex items-center gap-2"
      >
        {service.cta.label}
        <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
