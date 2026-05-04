import { createClient } from '@/lib/supabase/server';
import type {
  FlagshipModule,
  Formation,
  Partner,
  UseCase,
} from '@/lib/supabase/types';

export async function getAllUseCasesAdmin(): Promise<UseCase[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('use_cases')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return (data as unknown as UseCase[]) ?? [];
  } catch (err) {
    console.error('getAllUseCasesAdmin failed:', err);
    return [];
  }
}

export async function getUseCaseByIdAdmin(id: string): Promise<UseCase | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('use_cases')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return (data as unknown as UseCase | null) ?? null;
  } catch (err) {
    console.error('getUseCaseByIdAdmin failed:', err);
    return null;
  }
}

export async function getAllFormationsAdmin(): Promise<Formation[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('formations')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return (data as unknown as Formation[]) ?? [];
  } catch (err) {
    console.error('getAllFormationsAdmin failed:', err);
    return [];
  }
}

export async function getFormationByIdAdmin(id: string): Promise<Formation | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('formations')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return (data as unknown as Formation | null) ?? null;
  } catch (err) {
    console.error('getFormationByIdAdmin failed:', err);
    return null;
  }
}

export async function getAllFlagshipModulesAdmin(): Promise<FlagshipModule[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('flagship_modules')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return (data as unknown as FlagshipModule[]) ?? [];
  } catch (err) {
    console.error('getAllFlagshipModulesAdmin failed:', err);
    return [];
  }
}

export async function getAllPartnersAdmin(): Promise<Partner[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return (data as unknown as Partner[]) ?? [];
  } catch (err) {
    console.error('getAllPartnersAdmin failed:', err);
    return [];
  }
}
