import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CtaBanner } from '@/components/shared/CtaBanner';
import { getUseCaseBySlug } from '@/lib/queries/use-cases';
import type { UseCaseKpi } from '@/lib/supabase/types';

// Les requêtes publiques passent par le client Supabase serveur, qui lit
// `cookies()` : la route ne peut donc pas être rendue statiquement. En ISR,
// cet appel est fatal (pas de repli vers le dynamique) et la page renvoyait
// une 500. Même directive que /ressources/[slug].
export const dynamic = 'force-dynamic';


export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const useCase = await getUseCaseBySlug(params.slug);
  if (!useCase) return { title: 'Cas introuvable' };
  return {
    title: useCase.title,
    description: useCase.subtitle ?? undefined,
  };
}

export default async function CasDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const useCase = await getUseCaseBySlug(params.slug);
  if (!useCase) notFound();

  // Casts via unknown pour Json -> types métier (TypeScript strict)
  const solutionItems = Array.isArray(useCase.solution_items)
    ? (useCase.solution_items as unknown as string[]).filter(
        (s) => typeof s === 'string'
      )
    : [];

  const kpis = Array.isArray(useCase.kpis)
    ? (useCase.kpis as unknown as UseCaseKpi[]).filter(
        (k) => k && typeof k === 'object' && typeof k.value === 'string'
      )
    : [];

  return (
    <>
      <Header />
      <main>
        {/* Header du cas */}
        <header className="border-b border-hairline bg-cream">
          <div className="container-page py-14 md:py-20">
            <Link
              href="/cas-usage"
              className="mb-8 inline-flex items-center gap-2 font-sans text-[15px] font-bold text-ink-muted transition-colors hover:text-ink"
            >
              <span aria-hidden="true">←</span> Tous les cas d'usage
            </Link>

            <div className="flex flex-wrap gap-2 mb-6">
              {useCase.sector && (
                <span className="tag bg-halo text-ink">
                  {useCase.sector}
                </span>
              )}
              {useCase.status_label && (
                <span className="tag border border-hairline text-ink-muted">
                  {useCase.status_label}
                </span>
              )}
              {useCase.case_type === 'product' && (
                <span className="tag bg-ink text-cream">
                  Solution propriétaire
                </span>
              )}
            </div>

            <h1 className="max-w-4xl font-sans text-4xl font-bold leading-display tracking-tight text-ink md:text-5xl lg:text-6xl">
              {useCase.title}
            </h1>

            {useCase.subtitle && (
              <p className="mt-7 max-w-3xl font-sans text-lg md:text-xl leading-relaxed text-ink-muted">
                {useCase.subtitle}
              </p>
            )}
          </div>
        </header>

        {/* Contenu : problème + solution */}
        <section className="section-padding bg-white">
          <div className="container-page max-w-4xl">

            {useCase.problem && (
              <div className="mb-14">
                <span className="eyebrow">Le problème</span>
                <p className="mt-4 font-sans text-lg md:text-xl leading-relaxed text-ink">
                  {useCase.problem}
                </p>
              </div>
            )}

            {solutionItems.length > 0 && (
              <div className="mb-14">
                <span className="eyebrow">La solution déployée</span>
                <ul className="mt-6 space-y-4">
                  {solutionItems.map((item, i) => (
                    <li key={i} className="flex gap-4 font-sans text-base md:text-lg leading-relaxed text-ink">
                      <span className="mt-3 block size-1.5 shrink-0 rounded-full bg-sun" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* KPI en bandeau */}
        {kpis.length > 0 && (
          <section className="section-padding bg-cream">
            <div className="container-page">
              <span className="eyebrow">Résultats mesurés</span>
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {kpis.map((kpi, i) => (
                  <div key={i} className="card-warm p-6">
                    <div className="font-sans text-4xl font-bold leading-none tracking-tight text-accent-deep md:text-5xl">
                      {kpi.value}
                    </div>
                    <div className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">
                      {kpi.label}
                    </div>
                    {kpi.projected && (
                      <div className="mt-2 font-sans text-[11px] italic text-ink-muted">
                        projection
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <CtaBanner
          text="Vous avez un cas comparable ? Échangeons en 30 minutes."
          ctaLabel="Réserver un diagnostic"
        />
      </main>
      <Footer />
    </>
  );
}
