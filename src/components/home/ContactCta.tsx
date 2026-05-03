import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';

export function ContactCta() {
  return (
    <section
      id="contact"
      className="bg-sepia text-lin py-24 md:py-32 relative overflow-hidden"
    >
      {/* Texture diagonale très discrète */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent 0px, transparent 32px, #D4A82C 32px, #D4A82C 33px)',
        }}
      />

      <div className="container-page relative">
        <div className="max-w-3xl mx-auto text-center">

          <h2 className="font-serif text-4xl md:text-6xl font-normal leading-tight-extra tracking-tighter-2 text-lin">
            Passez de l'idée à <em className="italic text-or">l'impact.</em>
          </h2>

          <p className="mt-8 max-w-2xl mx-auto font-sans text-lg leading-relaxed text-perle">
            Parlez-nous de vos objectifs. Nous proposons un diagnostic IA gratuit de 30 minutes pour identifier 2 à 3 cas d'usage à fort impact dans votre organisation.
          </p>

          <div className="mt-12">
            <Link
              href="/contact#diagnostic"
              className="inline-flex items-center gap-2 rounded-sm bg-or px-9 py-5 font-sans text-xs font-semibold uppercase tracking-wide-2 text-sepia transition-all hover:bg-or-pale hover:-translate-y-0.5"
            >
              Réserver un créneau
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="mt-16 pt-10 border-t border-pierre/30 flex flex-wrap justify-center items-center gap-x-10 gap-y-3">
            {SITE_CONFIG.locations.map((loc) => (
              <div
                key={loc}
                className="flex items-center gap-2.5"
              >
                <span className="block w-1.5 h-1.5 rounded-full bg-or" />
                <span className="font-sans text-sm font-medium tracking-wide-1 text-perle">
                  {loc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
