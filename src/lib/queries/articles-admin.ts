import { createClient } from '@/lib/supabase/server';
import type { Article, ArticleCategory, ContentStatus } from '@/lib/supabase/types';

interface ArticlesFilters {
  status?: ContentStatus | 'all';
  category?: ArticleCategory | 'all';
  search?: string;
}

/**
 * Liste tous les articles (toutes statuts) — pour l'admin uniquement.
 * RLS Supabase garantit que seul un admin peut lire les drafts.
 */
export async function getAllArticlesAdmin(filters?: ArticlesFilters): Promise<Article[]> {
  try {
    const supabase = createClient();
    let query = supabase.from('articles').select('*');

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }
    if (filters?.search && filters.search.trim()) {
      const s = `%${filters.search.trim()}%`;
      query = query.or(`title.ilike.${s},excerpt.ilike.${s},slug.ilike.${s}`);
    }

    const { data, error } = await query.order('updated_at', { ascending: false });
    if (error) throw error;
    return (data as unknown as Article[]) ?? [];
  } catch (err) {
    console.error('getAllArticlesAdmin failed:', err);
    return [];
  }
}

/**
 * Récupère un article par id (pour l'édition admin, peu importe le statut).
 */
export async function getArticleByIdAdmin(id: string): Promise<Article | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return (data as unknown as Article | null) ?? null;
  } catch (err) {
    console.error('getArticleByIdAdmin failed:', err);
    return null;
  }
}

/**
 * Compte les articles par statut pour le badge sidebar et stats.
 */
export async function getArticlesCounters(): Promise<{
  total: number;
  drafts: number;
  published: number;
  archived: number;
}> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('articles').select('status');
    if (error) throw error;

    const rows = (data as unknown as Array<{ status: ContentStatus }>) ?? [];
    return {
      total: rows.length,
      drafts: rows.filter((r) => r.status === 'draft').length,
      published: rows.filter((r) => r.status === 'published').length,
      archived: rows.filter((r) => r.status === 'archived').length,
    };
  } catch (err) {
    console.error('getArticlesCounters failed:', err);
    return { total: 0, drafts: 0, published: 0, archived: 0 };
  }
}
