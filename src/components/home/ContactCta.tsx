import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';
import { Emphasis } from '@/components/shared/Emphasis';

/**
 * CTA final. L'ancienne inversion sombre laisse place au bloc « chaud »
 * de la charte ORQA : grande carte ivoire cerclée de jaune, posée sur le
 * crème, avec un halo radial derrière.
 */
export function ContactCta() {
  return (
    <section id="contact" className="relative overflow-hidden bg-cream section-padding">
      <div className="container-page relative">
        <div className="relative mx-auto max-w-4xl">
          <div
            aria-hidden="true"
            className="halo-radial pointer-events-none absolute -inset-x-16 -inset-y-16"
          />

          <div className="card-warm relative rounded-3xl p-8 text-center sm:p-10 lg:p-14">
            <h2 className="font-sans text-3xl font-bold leading-display tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Passez de l&apos;idée à <Emphasis>l&apos;impact.</Emphasis>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl font-sans text-lg leading-relaxed text-ink-muted">
              Parlez-nous de vos objectifs. Nous proposons un diagnostic IA
              gratuit de 30 minutes pour identifier 2 à 3 cas d&apos;usage à fort
              impact dans votre organisation.
            </p>

            <div className="mt-9">
              <Link href="/contact#diagnostic" className="btn-primary w-full sm:w-auto">
                Réserver un créneau
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 border-t border-sun/40 pt-8">
              {SITE_CONFIG.locations.map((loc) => (
                <div key={loc} className="flex items-center gap-2.5">
                  <span className="dot-sun" />
                  <span className="font-sans text-sm font-bold tracking-wide-1 text-ink-muted">
                    {loc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
