'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { randomUUID } from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { slugify } from '@/lib/utils';
import type { ContentStatus, UseCaseKpi } from '@/lib/supabase/types';

const VALID_CASE_TYPES = ['client', 'product'] as const;
const VALID_ACCENT_COLORS = ['or', 'sepia', 'pierre', 'or-pale'] as const;

export async function createUseCase() {
  const supabase = createClient();
  const slug = `cas-${randomUUID().slice(0, 8)}`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const table = supabase.from('use_cases') as any;
  const { data, error } = await table
    .insert({ slug, title: 'Nouveau cas', status: 'draft', case_type: 'client', accent_color: 'or' })
    .select('id')
    .single();

  if (error || !data) {
    console.error('createUseCase error:', error);
    throw new Error('Création impossible');
  }

  revalidatePath('/admin/use-cases');
  redirect(`/admin/use-cases/${data.id}/edit`);
}

export interface UseCasePayload {
  title: string;
  slug: string;
  subtitle: string | null;
  case_type: 'client' | 'product';
  sector: string | null;
  status_label: string | null;
  accent_color: 'or' | 'sepia' | 'pierre' | 'or-pale';
  problem: string | null;
  solution_items: string[];
  kpis: UseCaseKpi[];
  is_featured: boolean;
  display_order: number;
}

export async function saveUseCase(id: string, payload: UseCasePayload) {
  if (!payload.title || payload.title.trim().length < 2) {
    return { success: false, message: 'Le titre doit faire au moins 2 caractères.' };
  }
  if (!payload.slug || !/^[a-z0-9-]+$/.test(payload.slug)) {
    return { success: false, message: 'Slug invalide (minuscules, chiffres et tirets).' };
  }
  if (!VALID_CASE_TYPES.includes(payload.case_type)) {
    return { success: false, message: 'Type de cas invalide.' };
  }
  if (!VALID_ACCENT_COLORS.includes(payload.accent_color)) {
    return { success: false, message: "Couleur d'accent invalide." };
  }

  try {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = supabase.from('use_cases') as any;
    const { error } = await table
      .update({
        title: payload.title.trim(),
        slug: payload.slug.trim(),
        subtitle: payload.subtitle?.trim() || null,
        case_type: payload.case_type,
        sector: payload.sector?.trim() || null,
        status_label: payload.status_label?.trim() || null,
        accent_color: payload.accent_color,
        problem: payload.problem?.trim() || null,
        solution_items: payload.solution_items,
        kpis: payload.kpis,
        is_featured: payload.is_featured,
        display_order: payload.display_order,
      })
      .eq('id', id);

    if (error) {
      console.error('saveUseCase error:', error);
      if (error.code === '23505') return { success: false, message: 'Ce slug est déjà utilisé.' };
      return { success: false, message: 'Sauvegarde impossible.' };
    }

    revalidatePath('/admin/use-cases');
    revalidatePath(`/admin/use-cases/${id}/edit`);
    return { success: true, message: "Cas d'usage enregistré." };
  } catch (err) {
    console.error('saveUseCase exception:', err);
    return { success: false, message: 'Erreur serveur.' };
  }
}

export async function setUseCaseStatus(id: string, status: ContentStatus) {
  if (!['draft', 'published', 'archived'].includes(status)) {
    return { success: false, message: 'Statut invalide.' };
  }

  try {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = supabase.from('use_cases') as any;
    const { error } = await table.update({ status }).eq('id', id);
    if (error) return { success: false, message: 'Mise à jour impossible.' };

    revalidatePath('/');
    revalidatePath('/cas-usage');
    revalidatePath('/admin/use-cases');
    revalidatePath(`/admin/use-cases/${id}/edit`);

    return {
      success: true,
      message:
        status === 'published' ? 'Cas publié.' :
        status === 'archived' ? 'Cas archivé.' :
        'Remis en brouillon.',
    };
  } catch (err) {
    console.error('setUseCaseStatus exception:', err);
    return { success: false, message: 'Erreur serveur.' };
  }
}

export async function deleteUseCase(id: string) {
  try {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = supabase.from('use_cases') as any;
    const { error } = await table.delete().eq('id', id);
    if (error) return { success: false, message: 'Suppression impossible.' };

    revalidatePath('/cas-usage');
    revalidatePath('/admin/use-cases');
    return { success: true, message: 'Cas supprimé.' };
  } catch (err) {
    console.error('deleteUseCase exception:', err);
    return { success: false, message: 'Erreur serveur.' };
  }
}

export async function generateUseCaseSlug(title: string) {
  return slugify(title);
}
