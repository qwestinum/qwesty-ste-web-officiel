import { createClient } from '@/lib/supabase/server';
import type { Article, Partner, UseCaseKpi } from '@/lib/supabase/types';

/**
 * Récupère tous les partenaires actifs ordonnés par display_order.
 */
export async function getActivePartners(): Promise<Partner[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return (data ?? []) as Partner[];
  } catch (err) {
    console.error('getActivePartners failed:', err);
    return [];
  }
}

/**
 * Récupère les N derniers articles publiés.
 */
export async function getLatestArticles(limit = 3): Promise<Article[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false, nullsFirst: false })
      .limit(limit);

    if (error) throw error;
    return (data ?? []) as Article[];
  } catch (err) {
    console.error('getLatestArticles failed:', err);
    return [];
  }
}

/**
 * Agrège les KPI les plus marquants depuis les cas d'usage publiés.
 * Limite à 4 KPI maximum pour la grille de la page d'accueil.
 */
export async function getHomeKpis(): Promise<UseCaseKpi[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('use_cases')
      .select('kpis')
      .eq('status', 'published')
      .order('display_order', { ascending: true });

    if (error) throw error;

    // On caste explicitement la forme du retour (sélection partielle)
    const rows = (data ?? []) as Array<{ kpis: unknown }>;

    const flat: UseCaseKpi[] = [];
    for (const row of rows) {
      const kpis = row.kpis;
      if (Array.isArray(kpis)) {
        for (const k of kpis) {
          if (
            k &&
            typeof k === 'object' &&
            typeof (k as UseCaseKpi).value === 'string' &&
            typeof (k as UseCaseKpi).label === 'string'
          ) {
            flat.push(k as UseCaseKpi);
          }
        }
      }
      if (flat.length >= 4) break;
    }
    return flat.slice(0, 4);
  } catch (err) {
    console.error('getHomeKpis failed:', err);
    return [];
  }
}

/**
 * Récupère les compteurs hero depuis site_settings.
 * Fallback sur des valeurs par défaut si la clé n'existe pas.
 */
export async function getHeroCounters(): Promise<Array<{ value: string; label: string }>> {
  const fallback = [
    { value: '20+', label: "Ans d'expérience" },
    { value: '5', label: 'Cas déployés' },
    { value: '3', label: 'Capitales' },
    { value: '100%', label: 'RGPD compliant' },
  ];

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'hero_counters')
      .maybeSingle();

    if (error) throw error;

    // Cast explicite (sélection partielle)
    const row = data as { value: unknown } | null;
    const value = row?.value;

    if (Array.isArray(value)) {
      const counters = value.filter(
        (v): v is { value: string; label: string } =>
          !!v &&
          typeof v === 'object' &&
          typeof (v as { value: unknown }).value === 'string' &&
          typeof (v as { label: unknown }).label === 'string'
      );
      return counters.length > 0 ? counters.slice(0, 4) : fallback;
    }

    return fallback;
  } catch (err) {
    console.error('getHeroCounters failed:', err);
    return fallback;
  }
}