'use server';

import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

export interface LoginFormState {
  success: boolean;
  message: string;
}

/**
 * Envoie un magic link à l'email saisi.
 * Vérification basique du format email + appel Supabase.
 *
 * NOTE : on ne vérifie PAS ici si l'email est dans admin_users.
 * La vérification se fait au callback (l'utilisateur peut se créer un compte
 * Supabase mais ne pourra pas accéder à /admin sans entrée dans admin_users).
 */
export async function sendMagicLink(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const email = (formData.get('email') as string | null)?.trim().toLowerCase() ?? '';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      success: false,
      message: 'Veuillez saisir une adresse email valide.',
    };
  }

  try {
    const supabase = createClient();

    // Construit l'URL de redirection après clic sur le lien
    const headersList = headers();
    const host = headersList.get('host') ?? '';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;
    const redirectTo = `${siteUrl}/auth/callback`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: true,
      },
    });

    if (error) {
      console.error('sendMagicLink error:', error);
      return {
        success: false,
        message: "Impossible d'envoyer le lien. Réessayez ou contactez l'administrateur.",
      };
    }

    return {
      success: true,
      message: `Un lien de connexion a été envoyé à ${email}. Vérifiez votre boîte mail (et vos spams).`,
    };
  } catch (err) {
    console.error('sendMagicLink exception:', err);
    return {
      success: false,
      message: "Une erreur est survenue. Réessayez dans quelques instants.",
    };
  }
}
