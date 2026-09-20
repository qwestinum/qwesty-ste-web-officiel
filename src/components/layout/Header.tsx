'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LogoHorizontal } from '@/components/brand/Logo';
import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';

/**
 * Header sticky avec navigation principale.
 * Chrome repris de la charte ORQA : fond crème translucide + flou,
 * filet de 1px, ombre douce qui apparaît au scroll.
 * (Sticky plutôt que fixed : même rendu, sans décaler chaque page.)
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
        'sticky top-0 z-50 w-full border-b border-hairline bg-cream/90 backdrop-blur-md transition-shadow duration-300',
        scrolled ? 'shadow-soft' : 'shadow-none'
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
        <Link href="/" aria-label="Accueil Qwestinum">
          <LogoHorizontal />
        </Link>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-[15px] font-semibold text-ink-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/contact#diagnostic" className="btn-primary btn-compact">
            Diagnostic gratuit
          </Link>
        </nav>

        {/* Burger mobile */}
        <button
          type="button"
          className="-mr-2 inline-flex size-10 items-center justify-center rounded-lg text-ink transition-colors hover:bg-ink/[0.04] md:hidden"
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
        <div className="border-t border-hairline bg-cream md:hidden">
          <nav className="container-page flex flex-col gap-2 py-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="border-b border-hairline py-3 font-sans text-base font-semibold text-ink last:border-0"
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
