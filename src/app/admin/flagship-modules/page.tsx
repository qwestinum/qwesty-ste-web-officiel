import type { Metadata } from 'next';
import { getAllFlagshipModulesAdmin } from '@/lib/queries/admin-content';
import { FlagshipModulesManager } from '@/components/admin/forms/FlagshipModulesManager';

export const metadata: Metadata = { title: 'Modules Flagship' };
export const dynamic = 'force-dynamic';

export default async function FlagshipModulesPage() {
  const modules = await getAllFlagshipModulesAdmin();

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 lg:py-10 max-w-4xl mx-auto">
      <header className="mb-8">
        <span className="label-mark">Configuration</span>
        <h1 className="mt-2 font-serif text-3xl md:text-4xl font-medium text-sepia tracking-tight-1">
          Modules Flagship
        </h1>
        <p className="mt-2 font-sans text-sm text-pierre">
          Modules du programme phare affichés sur la page Formations.
        </p>
      </header>

      <FlagshipModulesManager modules={modules} />
    </div>
  );
}
