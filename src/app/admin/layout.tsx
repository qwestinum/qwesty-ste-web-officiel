import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminShell } from '@/components/admin/AdminShell';

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s · Admin Qwestinum' },
  robots: { index: false, follow: false },
};

/**
 * Layout racine de toutes les pages /admin/*.
 *
 * Vérifie deux choses :
 * 1. L'utilisateur est connecté (sinon middleware aurait déjà redirigé)
 * 2. L'utilisateur est dans la table admin_users (sinon redirect login + signout)
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Vérifie que l'utilisateur est bien admin
  const { data: adminRow } = await supabase
    .from('admin_users')
    .select('id, email, role')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!adminRow) {
    // L'utilisateur s'est connecté mais n'est pas admin → on le déconnecte
    await supabase.auth.signOut();
    redirect('/admin/login?error=not_admin');
  }

  return (
    <AdminShell userEmail={user.email ?? adminRow.email}>{children}</AdminShell>
  );
}
