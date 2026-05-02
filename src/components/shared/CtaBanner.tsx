import Link from 'next/link';

interface CtaBannerProps {
  text: string;
  ctaLabel: string;
  ctaHref?: string;
  variant?: 'light' | 'sepia';
}

/**
 * Bannière CTA réutilisable en bas des pages.
 * - Variant 'light' : fond ivoire avec or pâle (pour pages standard)
 * - Variant 'sepia' : fond sombre avec or vif (pour mise en avant forte)
 */
export function CtaBanner({
  text,
  ctaLabel,
  ctaHref = '/#contact',
  variant = 'light',
}: CtaBannerProps) {
  if (variant === 'sepia') {
    return (
      <section className="bg-sepia text-lin py-20 md:py-24 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent 0px, transparent 32px, #D4A82C 32px, #D4A82C 33px)',
          }}
        />
        <div className="container-page relative text-center">
          <p className="max-w-2xl mx-auto font-serif text-2xl md:text-3xl font-normal leading-tight tracking-tight-1 text-lin">
            {text}
          </p>
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 rounded-sm bg-or px-9 py-5 mt-8 font-sans text-xs font-semibold uppercase tracking-wide-2 text-sepia transition-all hover:bg-or-pale hover:-translate-y-0.5"
          >
            {ctaLabel}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-perle/40 border-y border-perle py-16 md:py-20">
      <div className="container-page text-center">
        <p className="max-w-2xl mx-auto font-serif text-2xl md:text-3xl font-normal leading-tight tracking-tight-1 text-sepia">
          {text}
        </p>
        <Link href={ctaHref} className="btn-primary mt-8">
          {ctaLabel}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
