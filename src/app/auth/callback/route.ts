import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { EmailOtpType } from '@supabase/supabase-js';

/**
 * Callback OAuth/magic-link.
 *
 * Gère les deux flows possibles :
 *
 * 1. PKCE flow (recommandé) — URL contient ?code=...
 *    Échange via supabase.auth.exchangeCodeForSession(code)
 *
 * 2. OTP flow (legacy / certains templates email) — URL contient ?token_hash=...&type=...
 *    Échange via supabase.auth.verifyOtp({ token_hash, type })
 *
 * Si aucun des deux n'est présent, redirection vers /admin/login avec une erreur.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const redirectTo = searchParams.get('redirect') ?? '/admin';

  const supabase = createClient();

  // Flow PKCE
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
    console.error('exchangeCodeForSession error:', error);
  }

  // Flow OTP (token_hash + type)
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (!error) {
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
    console.error('verifyOtp error:', error);
  }

  return NextResponse.redirect(`${origin}/admin/login?error=auth_failed`);
}