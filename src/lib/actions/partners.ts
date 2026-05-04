'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export interface PartnerPayload {
  name: string;
  logo_url: string | null;
  logo_svg: string | null;
  website_url: string | null;
  description: string | null;
  display_order: number;
  is_active: boolean;
}

export async function createPartner() {
  try {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = supabase.from('partners') as any;
    const { data, error } = await table
      .insert({ name: 'Nouveau partenaire', is_active: false, display_order: 999 })
      .select('id')
      .single();

    if (error || !data) {
      console.error('createPartner error:', error);
      return { success: false, message: 'Création impossible.', id: null };
    }

    revalidatePath('/admin/partners');
    return { success: true, message: 'Partenaire créé.', id: data.id as string };
  } catch (err) {
    console.error('createPartner exception:', err);
    return { success: false, message: 'Erreur serveur.', id: null };
  }
}

export async function updatePartner(id: string, payload: PartnerPayload) {
  if (!payload.name || payload.name.trim().length < 1) {
    return { success: false, message: 'Le nom est requis.' };
  }

  try {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = supabase.from('partners') as any;
    const { error } = await table
      .update({
        name: payload.name.trim(),
        logo_url: payload.logo_url?.trim() || null,
        logo_svg: payload.logo_svg?.trim() || null,
        website_url: payload.website_url?.trim() || null,
        description: payload.description?.trim() || null,
        display_order: payload.display_order,
        is_active: payload.is_active,
      })
      .eq('id', id);

    if (error) {
      console.error('updatePartner error:', error);
      return { success: false, message: 'Mise à jour impossible.' };
    }

    revalidatePath('/');
    revalidatePath('/admin/partners');
    return { success: true, message: 'Partenaire mis à jour.' };
  } catch (err) {
    console.error('updatePartner exception:', err);
    return { success: false, message: 'Erreur serveur.' };
  }
}

export async function deletePartner(id: string) {
  try {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = supabase.from('partners') as any;
    const { error } = await table.delete().eq('id', id);
    if (error) return { success: false, message: 'Suppression impossible.' };

    revalidatePath('/');
    revalidatePath('/admin/partners');
    return { success: true, message: 'Partenaire supprimé.' };
  } catch (err) {
    console.error('deletePartner exception:', err);
    return { success: false, message: 'Erreur serveur.' };
  }
}
