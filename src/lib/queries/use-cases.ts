import { createClient } from '@/lib/supabase/server';
import type { UseCase } from '@/lib/supabase/types';

/**
 * Liste tous les cas d'usage publiés.
 */
export async function getPublishedUseCases(): Promise<UseCase[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('use_cases')
      .select('*')
      .eq('status', 'published')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return (data ?? []) as UseCase[];
  } catch (err) {
    console.error('getPublishedUseCases failed:', err);
    return [];
  }
}

/**
 * Récupère un cas d'usage par slug.
 */
export async function getUseCaseBySlug(slug: string): Promise<UseCase | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('use_cases')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error) throw error;
    return (data as UseCase | null) ?? null;
  } catch (err) {
    console.error('getUseCaseBySlug failed:', err);
    return null;
  }
}

/**
 * Liste tous les slugs (pour generateStaticParams).
 */
export async function getAllUseCaseSlugs(): Promise<string[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('use_cases')
      .select('slug')
      .eq('status', 'published');

    if (error) throw error;
    return ((data ?? []) as Array<{ slug: string }>).map((row) => row.slug);
  } catch (err) {
    console.error('getAllUseCaseSlugs failed:', err);
    return [];
  }
}
