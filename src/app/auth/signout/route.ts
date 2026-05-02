import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Déconnecte l'utilisateur et redirige vers /admin/login.
 */
export async function POST(request: Request) {
  const { origin } = new URL(request.url);
  const supabase = createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(`${origin}/admin/login`, { status: 302 });
}

export async function GET(request: Request) {
  // Permet aussi la déconnexion via lien GET (pratique pour bouton simple)
  return POST(request);
}
