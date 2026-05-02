import { createClient } from '@/lib/supabase/server';
import type { Lead, LeadStatus } from '@/lib/supabase/types';

interface LeadsCounters {
  total: number;
  new: number;
  inProgress: number;
  archived: number;
  spam: number;
}

interface ActivityPoint {
  date: string;
  count: number;
}

interface LeadsFilters {
  status?: LeadStatus | 'all';
  search?: string;
}

/**
 * Compte les leads par statut.
 */
export async function getLeadsCounters(): Promise<LeadsCounters> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('leads').select('status');

    if (error) throw error;

    const rows = (data as unknown as Array<{ status: LeadStatus }>) ?? [];
    return {
      total: rows.length,
      new: rows.filter((r) => r.status === 'new').length,
      inProgress: rows.filter((r) => r.status === 'in-progress').length,
      archived: rows.filter((r) => r.status === 'archived').length,
      spam: rows.filter((r) => r.status === 'spam').length,
    };
  } catch (err) {
    console.error('getLeadsCounters failed:', err);
    return { total: 0, new: 0, inProgress: 0, archived: 0, spam: 0 };
  }
}

/**
 * Liste les N derniers leads.
 */
export async function getRecentLeads(limit = 5): Promise<Lead[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data as unknown as Lead[]) ?? [];
  } catch (err) {
    console.error('getRecentLeads failed:', err);
    return [];
  }
}

/**
 * Liste tous les leads, filtrables.
 */
export async function getAllLeads(filters?: LeadsFilters): Promise<Lead[]> {
  try {
    const supabase = createClient();
    let query = supabase.from('leads').select('*');

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters?.search && filters.search.trim()) {
      const s = `%${filters.search.trim()}%`;
      query = query.or(
        `full_name.ilike.${s},email.ilike.${s},company.ilike.${s},message.ilike.${s}`
      );
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return (data as unknown as Lead[]) ?? [];
  } catch (err) {
    console.error('getAllLeads failed:', err);
    return [];
  }
}

/**
 * Récupère un lead par id.
 */
export async function getLeadById(id: string): Promise<Lead | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return (data as unknown as Lead | null) ?? null;
  } catch (err) {
    console.error('getLeadById failed:', err);
    return null;
  }
}

/**
 * Activite par jour des 14 derniers jours (pour mini-graph dashboard).
 */
export async function getLeadsActivityLast14Days(): Promise<ActivityPoint[]> {
  try {
    const supabase = createClient();
    const since = new Date();
    since.setDate(since.getDate() - 14);

    const { data, error } = await supabase
      .from('leads')
      .select('created_at')
      .gte('created_at', since.toISOString());

    if (error) throw error;

    const rows = (data as unknown as Array<{ created_at: string }>) ?? [];
    const buckets: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      buckets[key] = 0;
    }
    for (const row of rows) {
      const key = row.created_at.slice(0, 10);
      if (key in buckets) buckets[key]++;
    }
    return Object.entries(buckets).map(([date, count]) => ({ date, count }));
  } catch (err) {
    console.error('getLeadsActivityLast14Days failed:', err);
    return [];
  }
}