import { LogoVertical } from '@/components/brand/Logo';
import { createClient } from '@/lib/supabase/server';
import { SITE_CONFIG } from '@/lib/constants';

/**
 * Page d'accueil du Lot 1.
 *
 * Cette version "diagnostic" sert uniquement à valider que l'infrastructure
 * fonctionne :
 *  - Polices Fraunces + Inter chargent bien
 *  - Palette Tailwind (lin, sepia, or, perle) s'applique
 *  - Connexion Supabase établie (compte les partenaires)
 *  - Composant Logo s'affiche correctement
 *
 * Elle sera remplacée par la vraie page d'accueil au Lot 2.
 */
export default async function HomePage() {
  // Test de la connexion Supabase : on récupère le nombre de partenaires
  let partnersCount: number | null = null;
  let supabaseStatus: 'ok' | 'no-env' | 'error' = 'ok';
  let errorMessage: string | null = null;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    supabaseStatus = 'no-env';
  } else {
    try {
      const supabase = createClient();
      const { count, error } = await supabase
        .from('partners')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      partnersCount = count;
    } catch (err) {
      supabaseStatus = 'error';
      errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
    }
  }

  return (
    <main className="min-h-screen bg-lin">
      {/* HERO */}
      <section className="container-page flex min-h-screen flex-col items-center justify-center py-20 text-center">
        <LogoVertical />

        <div className="mt-16 max-w-xl">
          <h1 className="font-serif text-5xl md:text-6xl font-normal leading-tight-extra tracking-tighter-2 text-sepia">
            De l'idée à <em className="text-or-fonce italic">l'impact.</em>
          </h1>
          <p className="mt-6 font-sans text-base md:text-lg leading-relaxed text-pierre">
            {SITE_CONFIG.description}
          </p>
        </div>

        {/* Diagnostic du Lot 1 */}
        <div className="mt-20 w-full max-w-2xl rounded-md border border-perle bg-lin p-8 text-left">
          <div className="label-mark mb-4">Diagnostic du Lot 1</div>
          <h2 className="font-serif text-2xl font-medium tracking-tight-1 text-sepia">
            Stack opérationnelle
          </h2>
          <ul className="mt-6 space-y-3 font-sans text-sm">
            <li className="flex items-center justify-between border-b border-perle pb-3">
              <span className="text-sepia">Next.js 14 + TypeScript</span>
              <StatusPill status="ok">Actif</StatusPill>
            </li>
            <li className="flex items-center justify-between border-b border-perle pb-3">
              <span className="text-sepia">Tailwind CSS + palette perle &amp; or</span>
              <StatusPill status="ok">Actif</StatusPill>
            </li>
            <li className="flex items-center justify-between border-b border-perle pb-3">
              <span className="text-sepia">Polices Fraunces + Inter</span>
              <StatusPill status="ok">Actif</StatusPill>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-sepia">Connexion Supabase</span>
              {supabaseStatus === 'ok' && (
                <StatusPill status="ok">{partnersCount} partenaires</StatusPill>
              )}
              {supabaseStatus === 'no-env' && (
                <StatusPill status="warn">Variables .env manquantes</StatusPill>
              )}
              {supabaseStatus === 'error' && (
                <StatusPill status="error">Erreur</StatusPill>
              )}
            </li>
          </ul>

          {errorMessage && (
            <p className="mt-4 rounded-sm border border-pierre/20 bg-perle/30 p-3 text-xs text-pierre">
              {errorMessage}
            </p>
          )}

          <p className="mt-6 text-xs text-pierre">
            Une fois le diagnostic vert, on passe au Lot 2 (page d'accueil premium).
          </p>
        </div>
      </section>
    </main>
  );
}

function StatusPill({
  children,
  status,
}: {
  children: React.ReactNode;
  status: 'ok' | 'warn' | 'error';
}) {
  const styles =
    status === 'ok'
      ? 'bg-or-pale/40 text-or-fonce'
      : status === 'warn'
        ? 'bg-perle text-sepia'
        : 'bg-sepia text-lin';
  return (
    <span
      className={`rounded-sm px-2 py-1 font-sans text-xs font-medium tracking-wide-1 ${styles}`}
    >
      {children}
    </span>
  );
}
