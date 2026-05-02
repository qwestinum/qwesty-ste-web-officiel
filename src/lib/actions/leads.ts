'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { LeadStatus } from '@/lib/supabase/types';

const VALID_STATUSES: LeadStatus[] = ['new', 'in-progress', 'archived', 'spam'];

/**
 * Met à jour le statut d'un lead.
 */
export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  if (!VALID_STATUSES.includes(status)) {
    return { success: false, message: 'Statut invalide.' };
  }

  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('leads')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update({ status } as any)
      .eq('id', leadId);

    if (error) {
      console.error('updateLeadStatus error:', error);
      return { success: false, message: 'Mise à jour impossible.' };
    }

    revalidatePath('/admin');
    revalidatePath('/admin/leads');
    revalidatePath(`/admin/leads/${leadId}`);
    return { success: true, message: 'Statut mis à jour.' };
  } catch (err) {
    console.error('updateLeadStatus exception:', err);
    return { success: false, message: 'Erreur serveur.' };
  }
}

/**
 * Met à jour les notes d'un lead.
 */
export async function updateLeadNotes(leadId: string, notes: string) {
  if (notes.length > 5000) {
    return { success: false, message: 'Notes trop longues (5000 max).' };
  }

  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('leads')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update({ notes: notes.trim() || null } as any)
      .eq('id', leadId);

    if (error) {
      console.error('updateLeadNotes error:', error);
      return { success: false, message: 'Mise à jour impossible.' };
    }

    revalidatePath(`/admin/leads/${leadId}`);
    return { success: true, message: 'Notes enregistrées.' };
  } catch (err) {
    console.error('updateLeadNotes exception:', err);
    return { success: false, message: 'Erreur serveur.' };
  }
}
