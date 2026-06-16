'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export interface LoginFormState {
  success: boolean;
  message: string;
}

/**
 * Connexion email + mot de passe.
 *
 * Vérification basique du format email + appel Supabase signInWithPassword.
 * En cas de succès, la session est posée dans les cookies (client serveur)
 * et on redirige vers /admin.
 *
 * NOTE : on ne vérifie PAS ici si l'email est dans admin_users.
 * Cette vérification se fait dans le layout /admin (un compte Supabase valide
 * sans entrée admin_users est déconnecté et renvoyé vers le login).
 */
export async function signIn(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const email = (formData.get('email') as string | null)?.trim().toLowerCase() ?? '';
  const password = (formData.get('password') as string | null) ?? '';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      success: false,
      message: 'Veuillez saisir une adresse email valide.',
    };
  }

  if (!password) {
    return {
      success: false,
      message: 'Veuillez saisir votre mot de passe.',
    };
  }

  let shouldRedirect = false;

  try {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error('signIn error:', error);
      return {
        success: false,
        message: 'Email ou mot de passe incorrect.',
      };
    }

    shouldRedirect = true;
  } catch (err) {
    console.error('signIn exception:', err);
    return {
      success: false,
      message: 'Une erreur est survenue. Réessayez dans quelques instants.',
    };
  }

  // redirect() doit être appelé en dehors du try/catch : il lève une
  // exception NEXT_REDIRECT que le catch ne doit pas intercepter.
  if (shouldRedirect) {
    redirect('/admin');
  }

  return { success: false, message: '' };
}
