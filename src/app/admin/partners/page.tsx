import type { Metadata } from 'next';
import { getAllPartnersAdmin } from '@/lib/queries/admin-content';
import { PartnersManager } from '@/components/admin/forms/PartnersManager';

export const metadata: Metadata = { title: 'Partenaires' };
export const dynamic = 'force-dynamic';

export default async function PartnersPage() {
  const partners = await getAllPartnersAdmin();

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 lg:py-10 max-w-4xl mx-auto">
      <header className="mb-8">
        <span className="label-mark">Configuration</span>
        <h1 className="mt-2 font-serif text-3xl md:text-4xl font-medium text-sepia tracking-tight-1">
          Partenaires
        </h1>
        <p className="mt-2 font-sans text-sm text-pierre">
          Logos et liens affichés dans la bande partenaires de la homepage.
        </p>
      </header>

      <PartnersManager partners={partners} />
    </div>
  );
}
