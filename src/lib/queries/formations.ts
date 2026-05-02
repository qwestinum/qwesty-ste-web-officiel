import { createClient } from '@/lib/supabase/server';
import type { FlagshipModule, Formation } from '@/lib/supabase/types';

/**
 * Liste toutes les formations publiées (modulaires + flagship), triées par display_order.
 */
export async function getPublishedFormations(): Promise<Formation[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('formations')
      .select('*')
      .eq('status', 'published')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return (data ?? []) as Formation[];
  } catch (err) {
    console.error('getPublishedFormations failed:', err);
    return [];
  }
}

/**
 * Récupère une formation par slug.
 */
export async function getFormationBySlug(slug: string): Promise<Formation | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('formations')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error) throw error;
    return (data as Formation | null) ?? null;
  } catch (err) {
    console.error('getFormationBySlug failed:', err);
    return null;
  }
}

/**
 * Liste tous les slugs de formations (pour generateStaticParams).
 */
export async function getAllFormationSlugs(): Promise<string[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('formations')
      .select('slug')
      .eq('status', 'published');

    if (error) throw error;
    return ((data ?? []) as Array<{ slug: string }>).map((row) => row.slug);
  } catch (err) {
    console.error('getAllFormationSlugs failed:', err);
    return [];
  }
}

/**
 * Liste les 9 modules du programme flagship, ordonnés.
 */
export async function getFlagshipModules(): Promise<FlagshipModule[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('flagship_modules')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return (data ?? []) as FlagshipModule[];
  } catch (err) {
    console.error('getFlagshipModules failed:', err);
    return [];
  }
}
