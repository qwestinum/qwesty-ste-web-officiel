import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getUseCaseByIdAdmin } from '@/lib/queries/admin-content';
import { UseCaseForm } from '@/components/admin/forms/UseCaseForm';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const useCase = await getUseCaseByIdAdmin(params.id);
  return { title: useCase ? `Édition — ${useCase.title}` : "Cas introuvable" };
}

export default async function UseCaseEditPage({ params }: { params: { id: string } }) {
  const useCase = await getUseCaseByIdAdmin(params.id);
  if (!useCase) notFound();

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 lg:py-10 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <Link
          href="/admin/use-cases"
          className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-wide-2 text-pierre hover:text-sepia transition-colors"
        >
          <span aria-hidden="true">←</span> {"Tous les cas d'usage"}
        </Link>
        <div className="font-sans text-xs text-pierre font-mono">ID : {useCase.id.slice(0, 8)}…</div>
      </div>

      <UseCaseForm useCase={useCase} />
    </div>
  );
}
