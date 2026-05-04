'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { randomUUID } from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { slugify } from '@/lib/utils';
import type { ContentStatus } from '@/lib/supabase/types';

const VALID_LEVELS = [
  'fondations', 'productivite', 'direction', 'methode',
  'execution', 'conformite', 'business', 'humain',
] as const;

export async function createFormation() {
  const supabase = createClient();
  const slug = `formation-${randomUUID().slice(0, 8)}`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const table = supabase.from('formations') as any;
  const { data, error } = await table
    .insert({ slug, title: 'Nouvelle formation', status: 'draft' })
    .select('id')
    .single();

  if (error || !data) {
    console.error('createFormation error:', error);
    throw new Error('Création impossible');
  }

  revalidatePath('/admin/formations');
  redirect(`/admin/formations/${data.id}/edit`);
}

export interface FormationPayload {
  title: string;
  slug: string;
  excerpt: string | null;
  level: string | null;
  level_label: string | null;
  duration_days: number | null;
  duration_label: string | null;
  audience: string | null;
  description: string | null;
  programme: string[];
  formats: string[];
  price_label: string | null;
  is_flagship: boolean;
  display_order: number;
}

export async function saveFormation(id: string, payload: FormationPayload) {
  if (!payload.title || payload.title.trim().length < 2) {
    return { success: false, message: 'Le titre doit faire au moins 2 caractères.' };
  }
  if (!payload.slug || !/^[a-z0-9-]+$/.test(payload.slug)) {
    return { success: false, message: 'Slug invalide (minuscules, chiffres et tirets).' };
  }
  if (payload.level && !VALID_LEVELS.includes(payload.level as never)) {
    return { success: false, message: 'Niveau invalide.' };
  }

  try {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = supabase.from('formations') as any;
    const { error } = await table
      .update({
        title: payload.title.trim(),
        slug: payload.slug.trim(),
        excerpt: payload.excerpt?.trim() || null,
        level: payload.level || null,
        level_label: payload.level_label?.trim() || null,
        duration_days: payload.duration_days,
        duration_label: payload.duration_label?.trim() || null,
        audience: payload.audience?.trim() || null,
        description: payload.description?.trim() || null,
        programme: payload.programme,
        formats: payload.formats,
        price_label: payload.price_label?.trim() || null,
        is_flagship: payload.is_flagship,
        display_order: payload.display_order,
      })
      .eq('id', id);

    if (error) {
      console.error('saveFormation error:', error);
      if (error.code === '23505') return { success: false, message: 'Ce slug est déjà utilisé.' };
      return { success: false, message: 'Sauvegarde impossible.' };
    }

    revalidatePath('/admin/formations');
    revalidatePath(`/admin/formations/${id}/edit`);
    return { success: true, message: 'Formation enregistrée.' };
  } catch (err) {
    console.error('saveFormation exception:', err);
    return { success: false, message: 'Erreur serveur.' };
  }
}

export async function setFormationStatus(id: string, status: ContentStatus) {
  if (!['draft', 'published', 'archived'].includes(status)) {
    return { success: false, message: 'Statut invalide.' };
  }

  try {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = supabase.from('formations') as any;
    const { error } = await table.update({ status }).eq('id', id);
    if (error) return { success: false, message: 'Mise à jour impossible.' };

    revalidatePath('/formations');
    revalidatePath('/admin/formations');
    revalidatePath(`/admin/formations/${id}/edit`);

    return {
      success: true,
      message:
        status === 'published' ? 'Formation publiée.' :
        status === 'archived' ? 'Formation archivée.' :
        'Remise en brouillon.',
    };
  } catch (err) {
    console.error('setFormationStatus exception:', err);
    return { success: false, message: 'Erreur serveur.' };
  }
}

export async function deleteFormation(id: string) {
  try {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = supabase.from('formations') as any;
    const { error } = await table.delete().eq('id', id);
    if (error) return { success: false, message: 'Suppression impossible.' };

    revalidatePath('/formations');
    revalidatePath('/admin/formations');
    return { success: true, message: 'Formation supprimée.' };
  } catch (err) {
    console.error('deleteFormation exception:', err);
    return { success: false, message: 'Erreur serveur.' };
  }
}

export async function generateFormationSlug(title: string) {
  return slugify(title);
}
