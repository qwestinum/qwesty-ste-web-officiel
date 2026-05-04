'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export interface FlagshipModulePayload {
  module_number: number;
  title: string;
  description: string | null;
  tag: string | null;
  is_highlight: boolean;
  display_order: number;
}

export async function createFlagshipModule() {
  try {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existing = supabase.from('flagship_modules') as any;
    const { data: rows } = await existing
      .select('module_number')
      .order('module_number', { ascending: false })
      .limit(1);

    const nextNumber = ((rows?.[0]?.module_number as number) ?? 9) + 1;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = supabase.from('flagship_modules') as any;
    const { error } = await table.insert({
      module_number: nextNumber,
      title: 'Nouveau module',
      display_order: nextNumber * 10,
    });

    if (error) {
      console.error('createFlagshipModule error:', error);
      return { success: false, message: 'Création impossible.' };
    }

    revalidatePath('/formations');
    revalidatePath('/admin/flagship-modules');
    return { success: true, message: 'Module créé.' };
  } catch (err) {
    console.error('createFlagshipModule exception:', err);
    return { success: false, message: 'Erreur serveur.' };
  }
}

export async function updateFlagshipModule(id: string, payload: FlagshipModulePayload) {
  if (!payload.title || payload.title.trim().length < 2) {
    return { success: false, message: 'Le titre doit faire au moins 2 caractères.' };
  }
  if (!Number.isInteger(payload.module_number) || payload.module_number < 1) {
    return { success: false, message: 'Numéro de module invalide.' };
  }

  try {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = supabase.from('flagship_modules') as any;
    const { error } = await table
      .update({
        module_number: payload.module_number,
        title: payload.title.trim(),
        description: payload.description?.trim() || null,
        tag: payload.tag?.trim() || null,
        is_highlight: payload.is_highlight,
        display_order: payload.display_order,
      })
      .eq('id', id);

    if (error) {
      console.error('updateFlagshipModule error:', error);
      return { success: false, message: 'Mise à jour impossible.' };
    }

    revalidatePath('/formations');
    revalidatePath('/admin/flagship-modules');
    return { success: true, message: 'Module mis à jour.' };
  } catch (err) {
    console.error('updateFlagshipModule exception:', err);
    return { success: false, message: 'Erreur serveur.' };
  }
}

export async function deleteFlagshipModule(id: string) {
  try {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = supabase.from('flagship_modules') as any;
    const { error } = await table.delete().eq('id', id);
    if (error) return { success: false, message: 'Suppression impossible.' };

    revalidatePath('/formations');
    revalidatePath('/admin/flagship-modules');
    return { success: true, message: 'Module supprimé.' };
  } catch (err) {
    console.error('deleteFlagshipModule exception:', err);
    return { success: false, message: 'Erreur serveur.' };
  }
}
