import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { CtaBanner } from '@/components/shared/CtaBanner';
import { EmptyState } from '@/components/shared/EmptyState';
import { ArticleCard } from '@/components/ressources/ArticleCard';
import { getFeaturedArticle, getPublishedArticles } from '@/lib/queries/articles';

export const metadata: Metadata = {
  title: 'Ressources',
  description:
    "Analyses, méthodes et retours d'expérience sur l'IA appliquée aux organisations — sans hype, sans jargon.",
};

export const revalidate = 300;

export default async function RessourcesPage() {
  const [featured, all] = await Promise.all([
    getFeaturedArticle(),
    getPublishedArticles(),
  ]);

  // Si on a un article phare, on l'exclut du reste pour éviter le doublon
  const others = featured ? all.filter((a) => a.id !== featured.id) : all;

  return (
    <>
      <Header />
      <main>
        <PageHeader
          kicker="Articles, analyses, retours d'expérience"
          titlePrefix="Ressources &"
          titleAccent="regards"
          titleSuffix="sur l'IA."
          intro="Nos analyses, méthodes et retours d'expérience sur l'IA appliquée aux organisations. Sans hype, sans jargon, avec une seule question en tête : qu'est-ce qui fonctionne réellement ?"
        />

        {all.length === 0 ? (
          <EmptyState
            title="Le blog ouvre bientôt"
            description="Nos premiers articles sont en cours de rédaction. Revenez prochainement, ou contactez-nous pour suggérer un sujet à traiter."
          />
        ) : (
          <>
            {featured && (
              <section className="border-b border-perle py-12 md:py-16">
                <div className="container-page">
                  <ArticleCard article={featured} variant="featured" />
                </div>
              </section>
            )}

            {others.length > 0 && (
              <section className="py-16 md:py-20">
                <div className="container-page">
                  <h2 className="label-mark mb-10">
                    {featured ? 'Autres articles' : 'Articles'}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {others.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        <CtaBanner
          text="Un sujet que vous aimeriez voir traité ? Les meilleurs articles naissent souvent des questions que posent nos clients."
          ctaLabel="Suggérer un sujet"
          variant="sepia"
        />
      </main>
      <Footer />
    </>
  );
}
