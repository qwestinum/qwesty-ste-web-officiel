import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CtaBanner } from '@/components/shared/CtaBanner';
import { getAllUseCaseSlugs, getUseCaseBySlug } from '@/lib/queries/use-cases';
import type { UseCaseKpi } from '@/lib/supabase/types';

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getAllUseCaseSlugs();
  return slugs.map((slug) => ({ slug }));
}

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

  const solutionItems = Array.isArray(useCase.solution_items)
    ? (useCase.solution_items as string[]).filter((s) => typeof s === 'string')
    : [];
  const kpis = Array.isArray(useCase.kpis)
    ? (useCase.kpis as UseCaseKpi[]).filter((k) => k && typeof k.value === 'string')
    : [];

  return (
    <>
      <Header />
      <main>
        {/* Header du cas */}
        <header className="border-b border-perle">
          <div className="container-page py-14 md:py-20">
            <Link
              href="/cas-usage"
              className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-wide-2 text-pierre hover:text-sepia transition-colors mb-8"
            >
              <span aria-hidden="true">←</span> Tous les cas d'usage
            </Link>

            <div className="flex flex-wrap gap-2 mb-6">
              {useCase.sector && (
                <span className="font-sans text-[10px] font-semibold uppercase tracking-wide-2 px-2.5 py-1 rounded-sm bg-or-pale/40 text-or-fonce">
                  {useCase.sector}
                </span>
              )}
              {useCase.status_label && (
                <span className="font-sans text-[10px] font-semibold uppercase tracking-wide-2 px-2.5 py-1 rounded-sm border border-perle text-pierre">
                  {useCase.status_label}
                </span>
              )}
              {useCase.case_type === 'product' && (
                <span className="font-sans text-[10px] font-semibold uppercase tracking-wide-2 px-2.5 py-1 rounded-sm bg-sepia text-lin">
                  Solution propriétaire
                </span>
              )}
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal leading-tight-extra tracking-tighter-2 text-sepia max-w-4xl">
              {useCase.title}
            </h1>

            {useCase.subtitle && (
              <p className="mt-7 max-w-3xl font-sans text-lg md:text-xl leading-relaxed text-pierre">
                {useCase.subtitle}
              </p>
            )}
          </div>
        </header>

        {/* Contenu : problème + solution */}
        <section className="py-16 md:py-20">
          <div className="container-page max-w-4xl">

            {useCase.problem && (
              <div className="mb-14">
                <span className="label-mark">Le problème</span>
                <p className="mt-4 font-sans text-lg md:text-xl leading-relaxed text-sepia">
                  {useCase.problem}
                </p>
              </div>
            )}

            {solutionItems.length > 0 && (
              <div className="mb-14">
                <span className="label-mark">La solution déployée</span>
                <ul className="mt-6 space-y-4">
                  {solutionItems.map((item, i) => (
                    <li key={i} className="flex gap-4 font-sans text-base md:text-lg leading-relaxed text-sepia">
                      <span className="block w-1.5 h-1.5 rounded-full bg-or mt-3 shrink-0" />
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
          <section className="bg-sepia text-lin py-16 md:py-20 relative overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, transparent 0px, transparent 30px, #D4A82C 30px, #D4A82C 31px)',
              }}
            />
            <div className="container-page relative">
              <span className="font-sans text-xs font-semibold uppercase tracking-wide-2 text-or">
                Résultats mesurés
              </span>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {kpis.map((kpi, i) => (
                  <div key={i}>
                    <div className="font-serif text-4xl md:text-5xl font-medium leading-tight-extra tracking-tighter-2 text-or">
                      {kpi.value}
                    </div>
                    <div className="mt-3 font-sans text-sm leading-relaxed text-perle">
                      {kpi.label}
                    </div>
                    {kpi.projected && (
                      <div className="mt-2 font-sans text-[11px] italic text-pierre">
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
