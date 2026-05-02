import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

/**
 * Client Supabase à utiliser dans les Client Components ('use client').
 * Lit les variables NEXT_PUBLIC_* qui sont sûres à exposer.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
