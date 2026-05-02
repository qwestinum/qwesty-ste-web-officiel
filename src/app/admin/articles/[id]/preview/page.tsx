import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleByIdAdmin } from '@/lib/queries/articles-admin';
import { tiptapJsonToSafeHtml } from '@/lib/tiptap/render';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const CATEGORY_LABELS: Record<string, string> = {
  strategie: 'Stratégie',
  methode: 'Méthode',
  'retours-experience': "Retour d'expérience",
  'lucidite-ia': 'Lucidité IA',
};

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const article = await getArticleByIdAdmin(params.id);
  return { title: article ? `Aperçu — ${article.title}` : 'Aperçu' };
}

export default async function ArticlePreviewPage({ params }: { params: { id: string } }) {
  const article = await getArticleByIdAdmin(params.id);
  if (!article) notFound();

  const html = tiptapJsonToSafeHtml(article.content);
  const isEmpty = !html || html.trim() === '<p></p>' || html.trim() === '';

  return (
    <div>
      {/* Bandeau d'aperçu */}
      <div className="bg-or-pale/40 border-b-2 border-or-fonce px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="font-sans text-xs">
            <span className="font-semibold uppercase tracking-wide-2 text-or-fonce mr-2">
              Mode aperçu
            </span>
            <span className="text-sepia">
              Cet article est en {article.status === 'published' ? 'ligne' : 'brouillon'}.
              {article.status !== 'published' && " Il n'est pas visible publiquement."}
            </span>
          </div>
          <Link
            href={`/admin/articles/${article.id}/edit`}
            className="font-sans text-xs font-semibold uppercase tracking-wide-2 text-or-fonce hover:text-sepia transition-colors"
          >
            ← Retour à l'édition
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <header className="mb-10 md:mb-14">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="font-sans text-[10px] font-semibold uppercase tracking-wide-2 px-2.5 py-1 rounded-sm bg-or-pale/40 text-or-fonce">
              {CATEGORY_LABELS[article.category] ?? article.category}
            </span>
            {article.published_at && (
              <span className="font-sans text-xs text-pierre">
                Publié en {formatDate(article.published_at)}
              </span>
            )}
            {article.reading_time_minutes && article.reading_time_minutes > 0 && (
              <span className="font-sans text-xs text-pierre">
                · {article.reading_time_minutes} min de lecture
              </span>
            )}
          </div>

          <h1 className="font-serif text-4xl md:text-5xl font-medium text-sepia tracking-tight-1 leading-tight">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="mt-5 font-sans text-lg text-pierre leading-relaxed">
              {article.excerpt}
            </p>
          )}

          {article.author_name && (
            <p className="mt-6 font-sans text-sm text-pierre">
              Par <span className="text-sepia font-medium">{article.author_name}</span>
            </p>
          )}
        </header>

        {article.cover_image_url && (
          <figure className="mb-12 -mx-4 sm:mx-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.cover_image_url}
              alt=""
              className="w-full h-auto rounded-md"
            />
          </figure>
        )}

        {isEmpty ? (
          <div className="bg-perle/30 border border-perle rounded-md p-12 text-center">
            <p className="font-sans text-sm text-pierre">
              L'article ne contient pas encore de contenu.
            </p>
            <Link
              href={`/admin/articles/${article.id}/edit`}
              className="mt-3 inline-block font-sans text-xs font-semibold uppercase tracking-wide-2 text-or-fonce hover:text-sepia transition-colors"
            >
              Commencer la rédaction →
            </Link>
          </div>
        ) : (
          <div
            className="prose-qwesty"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </article>
    </div>
  );
}
