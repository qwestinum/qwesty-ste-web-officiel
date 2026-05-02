import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Callback OAuth/magic-link.
 * Quand l'utilisateur clique sur le lien dans son email, Supabase le redirige
 * ici avec un `code` dans l'URL. On l'échange contre une session, puis on
 * redirige vers /admin (ou vers ?redirect=... si fourni).
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const redirectTo = searchParams.get('redirect') ?? '/admin';

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }

    console.error('exchangeCodeForSession error:', error);
  }

  // Si pas de code ou erreur, retour à la page login avec un message
  return NextResponse.redirect(`${origin}/admin/login?error=auth_failed`);
}
