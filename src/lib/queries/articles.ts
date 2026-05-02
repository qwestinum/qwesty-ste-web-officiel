import { createClient } from '@/lib/supabase/server';
import type { Article } from '@/lib/supabase/types';

/**
 * Liste tous les articles publiés, triés par date de publication descendante.
 */
export async function getPublishedArticles(): Promise<Article[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false, nullsFirst: false });

    if (error) throw error;
    return (data ?? []) as Article[];
  } catch (err) {
    console.error('getPublishedArticles failed:', err);
    return [];
  }
}

/**
 * Récupère l'article phare (is_featured = true) le plus récent, s'il existe.
 */
export async function getFeaturedArticle(): Promise<Article | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .eq('is_featured', true)
      .order('published_at', { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return (data as Article | null) ?? null;
  } catch (err) {
    console.error('getFeaturedArticle failed:', err);
    return null;
  }
}

/**
 * Récupère un article par son slug, uniquement s'il est publié.
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error) throw error;
    return (data as Article | null) ?? null;
  } catch (err) {
    console.error('getArticleBySlug failed:', err);
    return null;
  }
}

/**
 * Liste tous les slugs publiés (pour generateStaticParams).
 */
export async function getAllArticleSlugs(): Promise<string[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('articles')
      .select('slug')
      .eq('status', 'published');

    if (error) throw error;
    return ((data ?? []) as Array<{ slug: string }>).map((row) => row.slug);
  } catch (err) {
    console.error('getAllArticleSlugs failed:', err);
    return [];
  }
}
