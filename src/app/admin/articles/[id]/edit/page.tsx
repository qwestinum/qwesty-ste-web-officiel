import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleByIdAdmin } from '@/lib/queries/articles-admin';
import { TiptapEditor } from '@/components/admin/editor/TiptapEditor';
import { ArticleMetaForm } from '@/components/admin/editor/ArticleMetaForm';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const article = await getArticleByIdAdmin(params.id);
  return { title: article ? `Édition — ${article.title}` : 'Article introuvable' };
}

export default async function ArticleEditPage({ params }: { params: { id: string } }) {
  const article = await getArticleByIdAdmin(params.id);
  if (!article) notFound();

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 lg:py-10 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <Link
          href="/admin/articles"
          className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-wide-2 text-pierre hover:text-sepia transition-colors"
        >
          <span aria-hidden="true">←</span> Tous les articles
        </Link>

        <div className="font-sans text-xs text-pierre font-mono">
          ID : {article.id.slice(0, 8)}…
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

        {/* Éditeur principal */}
        <div className="lg:col-span-8">
          <TiptapEditor articleId={article.id} initialContent={article.content} />
        </div>

        {/* Sidebar métadonnées */}
        <aside className="lg:col-span-4">
          <ArticleMetaForm article={article} />
        </aside>
      </div>
    </div>
  );
}
