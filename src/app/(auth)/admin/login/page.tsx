import type { Metadata } from 'next';
import { LogoSymbol } from '@/components/brand/Logo';
import { LoginForm } from '@/components/admin/LoginForm';

export const metadata: Metadata = {
  title: 'Connexion admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-static';

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-lin flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">

          <div className="text-center mb-12">
            <LogoSymbol className="w-14 h-14 mx-auto" />
            <h1 className="mt-6 font-serif text-3xl font-medium text-sepia tracking-tight-1">
              Espace administrateur
            </h1>
            <p className="mt-3 font-sans text-sm text-pierre">
              Saisissez votre email pour recevoir un lien de connexion sécurisé.
            </p>
          </div>

          <div className="bg-perle/30 border border-perle rounded-md p-7 md:p-8">
            <LoginForm />
          </div>

          <p className="mt-8 text-center font-sans text-xs text-pierre">
            Cette page est réservée aux administrateurs Qwestinum.
            <br />
            <a href="/" className="link-editorial">Retour au site public</a>
          </p>

        </div>
      </div>
    </main>
  );
}
