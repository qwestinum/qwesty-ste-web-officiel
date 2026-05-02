'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { randomUUID } from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { tiptapJsonToSafeHtml } from '@/lib/tiptap/render';
import { calculateReadingTime, slugify } from '@/lib/utils';
import type { ArticleCategory, ContentStatus, Json } from '@/lib/supabase/types';

const VALID_CATEGORIES: ArticleCategory[] = [
  'strategie', 'methode', 'retours-experience', 'lucidite-ia',
];

// ----------------------------------------------------------------
// CREATE — création d'un brouillon vide puis redirection vers édition
// ----------------------------------------------------------------
export async function createArticle() {
  const supabase = createClient();
  const slug = `brouillon-${randomUUID().slice(0, 8)}`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const table = supabase.from('articles') as any;
  const { data, error } = await table
    .insert({
      slug,
      title: 'Nouveau brouillon',
      status: 'draft',
      category: 'strategie',
    })
    .select('id')
    .single();

  if (error || !data) {
    console.error('createArticle error:', error);
    throw new Error('Création impossible');
  }

  revalidatePath('/admin/articles');
  redirect(`/admin/articles/${data.id}/edit`);
}

// ----------------------------------------------------------------
// SAVE METADATA — sauvegarde des champs hors contenu (titre, slug, catégorie, etc.)
// ----------------------------------------------------------------
export interface ArticleMetaPayload {
  title: string;
  slug: string;
  excerpt: string | null;
  category: ArticleCategory;
  cover_image_url: string | null;
  author_name: string | null;
  seo_title: string | null;
  seo_description: string | null;
  is_featured: boolean;
}

export async function saveArticleMeta(id: string, payload: ArticleMetaPayload) {
  // Validation
  if (!payload.title || payload.title.trim().length < 3) {
    return { success: false, message: 'Le titre doit faire au moins 3 caractères.' };
  }
  if (!payload.slug || !/^[a-z0-9-]+$/.test(payload.slug)) {
    return {
      success: false,
      message: 'Slug invalide (uniquement minuscules, chiffres et tirets).',
    };
  }
  if (!VALID_CATEGORIES.includes(payload.category)) {
    return { success: false, message: 'Catégorie invalide.' };
  }

  try {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = supabase.from('articles') as any;
    const { error } = await table
      .update({
        title: payload.title.trim(),
        slug: payload.slug.trim(),
        excerpt: payload.excerpt?.trim() || null,
        category: payload.category,
        cover_image_url: payload.cover_image_url?.trim() || null,
        author_name: payload.author_name?.trim() || null,
        seo_title: payload.seo_title?.trim() || null,
        seo_description: payload.seo_description?.trim() || null,
        is_featured: payload.is_featured,
      })
      .eq('id', id);

    if (error) {
      console.error('saveArticleMeta error:', error);
      if (error.code === '23505') {
        return { success: false, message: 'Ce slug est déjà utilisé.' };
      }
      return { success: false, message: 'Sauvegarde impossible.' };
    }

    revalidatePath('/admin/articles');
    revalidatePath(`/admin/articles/${id}/edit`);
    return { success: true, message: 'Métadonnées enregistrées.' };
  } catch (err) {
    console.error('saveArticleMeta exception:', err);
    return { success: false, message: 'Erreur serveur.' };
  }
}

// ----------------------------------------------------------------
// SAVE CONTENT — auto-save du contenu Tiptap
// ----------------------------------------------------------------
export async function saveArticleContent(id: string, content: Json) {
  try {
    const supabase = createClient();
    const html = tiptapJsonToSafeHtml(content);
    const readingTime = calculateReadingTime(html);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = supabase.from('articles') as any;
    const { error } = await table
      .update({
        content,
        content_html: html,
        reading_time_minutes: readingTime,
      })
      .eq('id', id);

    if (error) {
      console.error('saveArticleContent error:', error);
      return { success: false, message: 'Sauvegarde du contenu impossible.' };
    }

    return { success: true, message: 'Contenu enregistré.' };
  } catch (err) {
    console.error('saveArticleContent exception:', err);
    return { success: false, message: 'Erreur serveur.' };
  }
}

// ----------------------------------------------------------------
// PUBLISH / UNPUBLISH / ARCHIVE / DELETE
// ----------------------------------------------------------------
export async function setArticleStatus(id: string, status: ContentStatus) {
  if (!['draft', 'published', 'archived'].includes(status)) {
    return { success: false, message: 'Statut invalide.' };
  }

  try {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = supabase.from('articles') as any;

    const updates: Record<string, unknown> = { status };
    // Si on publie pour la première fois (ou re-publication), met à jour published_at
    if (status === 'published') {
      updates.published_at = new Date().toISOString();
    }

    const { error } = await table.update(updates).eq('id', id);
    if (error) {
      console.error('setArticleStatus error:', error);
      return { success: false, message: 'Mise à jour du statut impossible.' };
    }

    // Invalide le cache du site public + admin
    revalidatePath('/');
    revalidatePath('/ressources');
    revalidatePath(`/ressources/${id}`);
    revalidatePath('/admin/articles');
    revalidatePath(`/admin/articles/${id}/edit`);

    return {
      success: true,
      message: status === 'published' ? 'Article publié.' :
               status === 'archived' ? 'Article archivé.' :
               'Article remis en brouillon.',
    };
  } catch (err) {
    console.error('setArticleStatus exception:', err);
    return { success: false, message: 'Erreur serveur.' };
  }
}

export async function deleteArticle(id: string) {
  try {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = supabase.from('articles') as any;
    const { error } = await table.delete().eq('id', id);

    if (error) {
      console.error('deleteArticle error:', error);
      return { success: false, message: 'Suppression impossible.' };
    }

    revalidatePath('/ressources');
    revalidatePath('/admin/articles');
    return { success: true, message: 'Article supprimé.' };
  } catch (err) {
    console.error('deleteArticle exception:', err);
    return { success: false, message: 'Erreur serveur.' };
  }
}

// ----------------------------------------------------------------
// UPLOAD IMAGE — upload vers Supabase Storage
// ----------------------------------------------------------------
export async function uploadArticleImage(formData: FormData): Promise<{
  success: boolean;
  url?: string;
  message: string;
}> {
  const file = formData.get('file');

  if (!file || !(file instanceof File)) {
    return { success: false, message: 'Aucun fichier fourni.' };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { success: false, message: 'Fichier trop volumineux (5 Mo max).' };
  }
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
      message: 'Type de fichier non supporté (JPEG, PNG, WebP, GIF uniquement).',
    };
  }

  try {
    const supabase = createClient();
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const fileName = `${randomUUID()}.${ext}`;
    const filePath = `${new Date().getFullYear()}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('articles-images')
      .upload(filePath, file, {
        cacheControl: '31536000',
        upsert: false,
      });

    if (uploadError) {
      console.error('uploadArticleImage upload error:', uploadError);
      return { success: false, message: "Échec de l'upload : " + uploadError.message };
    }

    const { data } = supabase.storage
      .from('articles-images')
      .getPublicUrl(filePath);

    return { success: true, url: data.publicUrl, message: 'Image uploadée.' };
  } catch (err) {
    console.error('uploadArticleImage exception:', err);
    return { success: false, message: 'Erreur serveur.' };
  }
}

// ----------------------------------------------------------------
// HELPER — slugify utilitaire pour les pages clientes
// ----------------------------------------------------------------
export async function generateSlugFromTitle(title: string) {
  return slugify(title);
}
