import Link from 'next/link';
import { LogoSymbol } from '@/components/brand/Logo';
import { Emphasis } from '@/components/shared/Emphasis';

interface HeroCounter {
  value: string;
  label: string;
}

interface HeroProps {
  counters: HeroCounter[];
}

/**
 * Hero — structure de la charte ORQA : accroche à puce dégradée, titre
 * bold avec mot souligné au pinceau, chapeau, double CTA, puis la
 * constellation posée sur un halo radial.
 *
 * Les apparitions passent par `animate-fade-up` + `[animation-delay]`
 * (CSS pur, comme ORQA) : plus de framer-motion ici, donc plus de JS
 * client sur le premier écran.
 */
export function Hero({ counters }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="container-page grid items-center gap-12 pb-20 pt-12 md:pt-16 lg:grid-cols-[1fr_0.9fr] lg:pb-28">

        {/* Colonne gauche — texte */}
        <div>
          <p className="flex items-start gap-2.5 animate-fade-up font-sans text-base leading-snug text-ink-muted [text-wrap:balance]">
            <span className="dot-sun mt-1.5" />
            Conseil · Solutions · Formations en IA
          </p>

          <h1 className="mt-6 animate-fade-up font-sans text-[2.75rem] font-bold leading-display tracking-tight text-ink [animation-delay:50ms] sm:text-6xl lg:text-[4.25rem]">
            De l&apos;idée à <Emphasis>l&apos;impact.</Emphasis>
          </h1>

          <p className="mt-6 max-w-xl animate-fade-up font-sans text-xl leading-relaxed text-ink-muted [animation-delay:100ms]">
            Qwestinum conçoit et déploie des solutions d&apos;intelligence
            artificielle qui transforment réellement les organisations — sans
            hype, sans jargon, avec des résultats mesurables.
          </p>

          <div className="mt-9 flex animate-fade-up flex-col gap-4 [animation-delay:150ms] sm:flex-row sm:items-center sm:gap-7">
            <Link href="/#contact" className="btn-primary w-full sm:w-auto">
              Diagnostic IA gratuit
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="/cas-usage" className="btn-link">
              Voir nos cas d&apos;usage
            </Link>
          </div>

          {/* Compteurs */}
          <div className="mt-14 grid animate-fade-up grid-cols-2 gap-6 border-t border-hairline pt-10 [animation-delay:200ms] sm:grid-cols-4 sm:gap-4">
            {counters.map((counter) => (
              <div key={counter.label}>
                <div className="font-sans text-3xl font-bold leading-none tracking-tight text-ink md:text-4xl">
                  {counter.value}
                </div>
                <div className="mt-2 font-sans text-xs uppercase tracking-wide-1 text-ink-muted">
                  {counter.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Colonne droite — constellation sur halo */}
        <div className="relative mx-auto hidden w-full max-w-md animate-fade-up items-center justify-center [animation-delay:250ms] lg:flex lg:max-w-none">
          <div
            aria-hidden="true"
            className="halo-radial pointer-events-none absolute -inset-x-10 -inset-y-12"
          />
          <LogoSymbol className="relative h-80 w-80 xl:h-96 xl:w-96" />
        </div>
      </div>
    </section>
  );
}
