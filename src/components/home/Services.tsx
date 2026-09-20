import Link from 'next/link';
import { Emphasis } from '@/components/shared/Emphasis';

const SERVICES = [
  {
    number: '01',
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
    number: '02',
    title: 'Solutions sur mesure',
    summary:
      "Concevez et déployez des agents intelligents, des modèles prédictifs et des automatisations intégrées à vos outils existants.",
    items: [
      'Agents conversationnels (chat & voice)',
      'Automatisation & intégration CRM/ERP',
      'Analyse prédictive & décisionnelle',
      'Architectures multi-agents',
    ],
    cta: { href: '/cas-usage', label: 'Voir les cas d’usage' },
  },
  {
    number: '03',
    title: 'Formations',
    summary:
      'Montez en compétences pour utiliser, piloter et diffuser l’IA en interne — du niveau débutant à avancé.',
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
    <section className="section-padding bg-white" id="services">
      <div className="container-page">

        <div className="mb-16 max-w-3xl md:mb-20">
          <span className="eyebrow">Nos services</span>
          <h2 className="mt-4 font-sans text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Trois offres complémentaires pour passer de la vision à la{' '}
            <Emphasis>valeur réelle.</Emphasis>
          </h2>
          <p className="mt-6 font-sans text-lg leading-relaxed text-ink-muted">
            Sans perdre de temps, sans perdre de budget, avec des livrables
            concrets à chaque étape.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
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
    <article className="card-cool group flex flex-col p-7 transition-shadow duration-200 hover:shadow-lift sm:p-8">
      <div className="font-sans text-sm font-bold tracking-wide text-accent-deep">
        {service.number}
      </div>

      <h3 className="mt-3 font-sans text-2xl font-bold leading-snug tracking-tight text-ink">
        {service.title}
      </h3>

      <p className="mt-4 font-sans text-sm leading-relaxed text-ink-muted">
        {service.summary}
      </p>

      <ul className="mt-6 flex-1 space-y-2.5">
        {service.items.map((item) => (
          <li
            key={item}
            className="flex gap-3 font-sans text-sm leading-relaxed text-ink"
          >
            <span className="mt-[0.45rem] block size-1.5 shrink-0 rounded-full bg-sun" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 border-t border-hairline pt-5">
        <Link
          href={service.cta.href}
          className="btn-link text-[15px]"
        >
          {service.cta.label}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
