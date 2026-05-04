import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getFormationByIdAdmin } from '@/lib/queries/admin-content';
import { FormationForm } from '@/components/admin/forms/FormationForm';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const formation = await getFormationByIdAdmin(params.id);
  return { title: formation ? `Édition — ${formation.title}` : 'Formation introuvable' };
}

export default async function FormationEditPage({ params }: { params: { id: string } }) {
  const formation = await getFormationByIdAdmin(params.id);
  if (!formation) notFound();

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 lg:py-10 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <Link
          href="/admin/formations"
          className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-wide-2 text-pierre hover:text-sepia transition-colors"
        >
          <span aria-hidden="true">←</span> Toutes les formations
        </Link>
        <div className="font-sans text-xs text-pierre font-mono">ID : {formation.id.slice(0, 8)}…</div>
      </div>

      <FormationForm formation={formation} />
    </div>
  );
}
