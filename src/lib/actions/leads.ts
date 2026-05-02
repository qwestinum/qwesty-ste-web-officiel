'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { LeadStatus } from '@/lib/supabase/types';

const VALID_STATUSES: LeadStatus[] = ['new', 'in-progress', 'archived', 'spam'];

/**
 * Met à jour le statut d'un lead.
 *
 * NOTE typage : on caste `from('leads')` en any pour contourner le bug
 * de @supabase/ssr qui type les UPDATE/INSERT comme `never` quand le
 * type Database est manuel. La validation reste assurée côté serveur (whitelist
 * VALID_STATUSES) et côté DB (CHECK constraint sur status).
 */
export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  if (!VALID_STATUSES.includes(status)) {
    return { success: false, message: 'Statut invalide.' };
  }

  try {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = supabase.from('leads') as any;
    const { error } = await table
      .update({ status })
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = supabase.from('leads') as any;
    const { error } = await table
      .update({ notes: notes.trim() || null })
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