import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CtaBanner } from '@/components/shared/CtaBanner';
import { ArticleContent } from '@/components/ressources/ArticleContent';
import { getAllArticleSlugs, getArticleBySlug } from '@/lib/queries/articles';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: 'Article introuvable' };

  return {
    title: article.seo_title ?? article.title,
    description: article.seo_description ?? article.excerpt ?? undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      type: 'article',
      publishedTime: article.published_at ?? undefined,
      authors: article.author_name ? [article.author_name] : undefined,
      images: article.cover_image_url ? [article.cover_image_url] : undefined,
    },
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  strategie: 'Stratégie',
  methode: 'Méthode',
  'retours-experience': 'Retour d\u2019expérience',
  'lucidite-ia': 'Lucidité IA',
};

export default async function ArticleDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticleBySlug(params.slug);
  if (!article) notFound();

  const date = formatDate(article.published_at);
  const categoryLabel = CATEGORY_LABELS[article.category] ?? article.category;

  return (
    <>
      <Header />
      <main>
        <header className="border-b border-hairline bg-cream">
          <div className="container-page py-14 md:py-20">
            <Link
              href="/ressources"
              className="mb-8 inline-flex items-center gap-2 font-sans text-[15px] font-bold text-ink-muted transition-colors hover:text-ink"
            >
              <span aria-hidden="true">←</span> Toutes les ressources
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="tag bg-halo text-ink">
                {categoryLabel}
              </span>
              {date && <span className="font-sans text-xs text-ink-muted">{date}</span>}
            </div>

            <h1 className="max-w-4xl font-sans text-4xl font-bold leading-display tracking-tight text-ink md:text-5xl lg:text-6xl">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="mt-7 max-w-3xl font-sans text-lg md:text-xl leading-relaxed text-ink-muted">
                {article.excerpt}
              </p>
            )}

            <div className="mt-8 flex items-center gap-4 flex-wrap">
              {article.author_name && (
                <span className="font-sans text-sm text-ink-muted">Par {article.author_name}</span>
              )}
              {article.reading_time_minutes && (
                <>
                  <span className="text-ink-muted">·</span>
                  <span className="font-sans text-sm text-ink-muted">
                    {article.reading_time_minutes} min de lecture
                  </span>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Cover */}
        {article.cover_image_url && (
          <div className="container-page py-10 md:py-12 max-w-4xl">
            <img
              src={article.cover_image_url}
              alt={article.title}
              className="w-full rounded-2xl border border-hairline shadow-soft"
            />
          </div>
        )}

        {/* Contenu Tiptap */}
        <article className="bg-white py-10 md:py-16">
          {article.content_html ? (
            <ArticleContent html={article.content_html} />
          ) : (
            <div className="container-page max-w-3xl">
              <p className="font-sans italic text-ink-muted">
                Le contenu de cet article n'est pas encore disponible.
              </p>
            </div>
          )}
        </article>

        <CtaBanner
          text="Vous voulez approfondir ce sujet pour votre organisation ?"
          ctaLabel="Échanger avec nous"
        />
      </main>
      <Footer />
    </>
  );
}
