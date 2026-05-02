'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LogoHorizontal } from '@/components/brand/Logo';
import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';

/**
 * Header sticky avec navigation principale.
 * - Devient légèrement opaque + bordure au scroll
 * - Mobile : burger menu
 * - CTA "Diagnostic gratuit" en or → /contact#diagnostic
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'border-b border-perle/60 bg-lin/80 backdrop-blur-md'
          : 'bg-transparent'
      )}
    >
      <div className="container-page flex h-16 md:h-20 items-center justify-between">
        <Link href="/" aria-label="Accueil Qwestinum">
          <LogoHorizontal />
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-sm font-medium text-pierre transition-colors hover:text-sepia"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/contact#diagnostic" className="btn-primary !py-3 !px-5">
            Diagnostic gratuit
          </Link>
        </nav>

        {/* Burger mobile */}
        <button
          type="button"
          className="md:hidden p-2 -mr-2 text-sepia"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          aria-expanded={mobileOpen}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <>
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Menu mobile déroulant */}
      {mobileOpen && (
        <div className="md:hidden border-t border-perle/60 bg-lin">
          <nav className="container-page py-6 flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 font-sans text-base text-sepia border-b border-perle/40 last:border-0"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact#diagnostic"
              onClick={() => setMobileOpen(false)}
              className="btn-primary mt-4 w-full"
            >
              Diagnostic gratuit
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
