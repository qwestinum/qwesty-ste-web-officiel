import Link from 'next/link';

interface CtaBannerProps {
  text: string;
  ctaLabel: string;
  ctaHref?: string;
  variant?: 'light' | 'emphasis';
}

/**
 * Bannière CTA réutilisable en bas des pages.
 * - `light`    : bandeau blanc sobre, filets en haut et en bas
 * - `emphasis` : grande carte ivoire cerclée de jaune sur halo
 *
 * (L'ancienne variante sombre `sepia` a disparu avec l'adoption de la
 * charte ORQA, qui ne comporte aucune inversion.)
 */
export function CtaBanner({
  text,
  ctaLabel,
  ctaHref = '/#contact',
  variant = 'light',
}: CtaBannerProps) {
  if (variant === 'emphasis') {
    return (
      <section className="relative overflow-hidden bg-cream py-20 md:py-24">
        <div className="container-page relative">
          <div className="relative mx-auto max-w-4xl">
            <div
              aria-hidden="true"
              className="halo-radial pointer-events-none absolute -inset-x-16 -inset-y-14"
            />
            <div className="card-warm relative rounded-3xl p-8 text-center sm:p-10 lg:p-12">
              <p className="mx-auto max-w-2xl font-sans text-2xl font-bold leading-snug tracking-tight text-ink md:text-3xl">
                {text}
              </p>
              <Link href={ctaHref} className="btn-primary mt-8 w-full sm:w-auto">
                {ctaLabel}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-y border-hairline bg-white py-16 md:py-20">
      <div className="container-page text-center">
        <p className="mx-auto max-w-2xl font-sans text-2xl font-bold leading-snug tracking-tight text-ink md:text-3xl">
          {text}
        </p>
        <Link href={ctaHref} className="btn-primary mt-8 w-full sm:w-auto">
          {ctaLabel}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
