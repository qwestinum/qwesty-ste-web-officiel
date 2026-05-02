import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './types';

/**
 * Client Supabase à utiliser dans les Server Components, Server Actions
 * et Route Handlers. Gère automatiquement les cookies de session.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Le `setAll` peut échouer dans un Server Component pur (lecture seule).
            // Ce n'est pas critique : les middleware/Route Handlers gèreront la mise à jour.
          }
        },
      },
    }
  );
}