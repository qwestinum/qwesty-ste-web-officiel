import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { CtaBanner } from '@/components/shared/CtaBanner';
import { EmptyState } from '@/components/shared/EmptyState';
import { UseCaseCard } from '@/components/cas/UseCaseCard';
import { getPublishedUseCases } from '@/lib/queries/use-cases';

export const metadata: Metadata = {
  title: "Cas d'usage",
  description:
    "Missions consulting et solutions produit déployées par Qwestinum — cas clients anonymisés et solutions propriétaires.",
};

export const revalidate = 300;

export default async function CasUsagePage() {
  const cases = await getPublishedUseCases();

  // Sépare missions clients vs produits propriétaires
  const clientCases = cases.filter((c) => c.case_type === 'client');
  const productCases = cases.filter((c) => c.case_type === 'product');

  return (
    <>
      <Header />
      <main>
        <PageHeader
          kicker="Missions clients & solutions produit"
          titlePrefix="Nos"
          titleAccent="cas concrets."
          intro="Missions de conseil réalisées et solutions propriétaires déployées par Qwestinum. Tous les cas clients sont anonymisés ; les solutions produit sont disponibles à la mise en œuvre."
        />

        {cases.length === 0 ? (
          <EmptyState
            title="Les cas seront bientôt publiés"
            description="Nous documentons actuellement nos missions et solutions propriétaires. Revenez prochainement, ou contactez-nous pour discuter de votre projet."
          />
        ) : (
          <>
            {/* Missions clients */}
            {clientCases.length > 0 && (
              <section className="py-16 md:py-20">
                <div className="container-page">
                  <div className="mb-10">
                    <span className="label-mark">Missions clients</span>
                    <h2 className="mt-3 font-serif text-3xl md:text-4xl font-medium leading-tight tracking-tight-1 text-sepia">
                      Cas anonymisés, KPI mesurés.
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {clientCases.map((c) => (
                      <UseCaseCard key={c.id} useCase={c} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Solutions produit */}
            {productCases.length > 0 && (
              <section className="bg-perle/30 border-y border-perle py-16 md:py-20">
                <div className="container-page">
                  <div className="mb-10">
                    <span className="label-mark">Solutions propriétaires</span>
                    <h2 className="mt-3 font-serif text-3xl md:text-4xl font-medium leading-tight tracking-tight-1 text-sepia">
                      Produits Qwestinum disponibles.
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {productCases.map((c) => (
                      <UseCaseCard key={c.id} useCase={c} />
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        <CtaBanner
          text="Vous reconnaissez un cas similaire au vôtre ? Le diagnostic IA gratuit de 30 minutes permet d'identifier les leviers d'automatisation dans votre organisation."
          ctaLabel="Réserver un diagnostic"
        />
      </main>
      <Footer />
    </>
  );
}
