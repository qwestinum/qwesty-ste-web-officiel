'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LogoSymbol } from '@/components/brand/Logo';
import { cn } from '@/lib/utils';

interface AdminShellProps {
  userEmail: string;
  children: React.ReactNode;
}

const ADMIN_NAV = [
  {
    section: 'Pilotage',
    items: [
      { href: '/admin', label: 'Tableau de bord', icon: 'home' },
    ],
  },
  {
    section: 'Contenu',
    items: [
      { href: '/admin/leads', label: 'Leads', icon: 'mail' },
      { href: '/admin/articles', label: 'Articles', icon: 'edit' },
      // À venir au Lot 6
      { href: '/admin/use-cases', label: "Cas d'usage", icon: 'briefcase', disabled: true },
      { href: '/admin/formations', label: 'Formations', icon: 'academic', disabled: true },
    ],
  },
];

export function AdminShell({ userEmail, children }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-lin">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-perle bg-perle/20">
        <SidebarContent pathname={pathname} userEmail={userEmail} />
      </aside>

      {/* Sidebar mobile (drawer) */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-sepia/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-64 bg-lin border-r border-perle flex flex-col">
            <SidebarContent
              pathname={pathname}
              userEmail={userEmail}
              onLinkClick={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* Contenu principal */}
      <div className="lg:pl-64">
        <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-14 px-4 border-b border-perle bg-lin">
          <Link href="/admin" className="flex items-center gap-2">
            <LogoSymbol className="w-7 h-7" />
            <span className="font-serif text-base text-sepia">Admin</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Ouvrir le menu"
            className="p-2 -mr-2 text-sepia"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="7" x2="21" y2="7" />
              <line x1="3" y1="17" x2="21" y2="17" />
            </svg>
          </button>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({
  pathname,
  userEmail,
  onLinkClick,
}: {
  pathname: string;
  userEmail: string;
  onLinkClick?: () => void;
}) {
  return (
    <>
      <div className="h-16 px-5 flex items-center gap-3 border-b border-perle">
        <LogoSymbol className="w-8 h-8 shrink-0" />
        <div className="min-w-0">
          <div className="font-serif text-base font-medium text-sepia tracking-tight-1 truncate">
            Qwestinum
          </div>
          <div className="font-sans text-[10px] uppercase tracking-wide-2 text-pierre">
            Administration
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3">
        {ADMIN_NAV.map((section) => (
          <div key={section.section} className="mb-7">
            <h3 className="px-3 mb-2 font-sans text-[10px] font-semibold uppercase tracking-wide-2 text-pierre">
              {section.section}
            </h3>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active =
                  item.href === '/admin'
                    ? pathname === '/admin'
                    : pathname.startsWith(item.href);
                const isDisabled = 'disabled' in item && item.disabled;

                if (isDisabled) {
                  return (
                    <li key={item.href}>
                      <span
                        className="flex items-center gap-3 px-3 py-2 rounded-sm font-sans text-sm text-pierre/40 cursor-not-allowed select-none"
                        title="Bientôt disponible"
                      >
                        <NavIcon name={item.icon} />
                        <span>{item.label}</span>
                        <span className="ml-auto text-[9px] uppercase tracking-wide-2 text-pierre/40">
                          bientôt
                        </span>
                      </span>
                    </li>
                  );
                }

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onLinkClick}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-sm font-sans text-sm transition-colors',
                        active
                          ? 'bg-or-pale/30 text-sepia font-medium'
                          : 'text-sepia hover:bg-perle/40'
                      )}
                    >
                      <NavIcon name={item.icon} active={active} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-perle">
        <div className="font-sans text-xs text-pierre mb-1">Connecté</div>
        <div className="font-sans text-sm text-sepia truncate mb-3" title={userEmail}>
          {userEmail}
        </div>
        <form action="/auth/signout" method="POST">
          <button
            type="submit"
            className="w-full text-left font-sans text-xs uppercase tracking-wide-2 text-pierre hover:text-or-fonce transition-colors flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Se déconnecter
          </button>
        </form>
      </div>
    </>
  );
}

function NavIcon({ name, active = false }: { name: string; active?: boolean }) {
  const className = cn(
    'shrink-0 transition-colors',
    active ? 'text-or-fonce' : 'text-pierre'
  );
  const props = {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
  };

  switch (name) {
    case 'home':
      return (
        <svg {...props}>
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case 'mail':
      return (
        <svg {...props}>
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22 6 12 13 2 6" />
        </svg>
      );
    case 'edit':
      return (
        <svg {...props}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4z" />
        </svg>
      );
    case 'briefcase':
      return (
        <svg {...props}>
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
        </svg>
      );
    case 'academic':
      return (
        <svg {...props}>
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
  }
}
