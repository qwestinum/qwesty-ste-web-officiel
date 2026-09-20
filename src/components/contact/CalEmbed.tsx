'use client';

import { getCalApi } from '@calcom/embed-react';
import { useEffect } from 'react';
import { SITE_CONFIG } from '@/lib/constants';

/**
 * Bouton qui déclenche une modale plein écran Cal.com.
 *
 * Pattern recommandé par Cal.com pour les espaces contraints :
 * la modale prend tout l'écran et gère parfaitement le picker de créneaux.
 */
export function CalEmbed() {
  const calLink = process.env.NEXT_PUBLIC_CAL_USERNAME;

  useEffect(() => {
    (async function () {
      const cal = await getCalApi();

      const calColors = {
        'cal-brand': '#2B9FD8',
        'cal-text': '#0A1F4B',
        'cal-text-emphasis': '#0A1F4B',
        'cal-text-muted': '#4A5670',
        'cal-bg': '#FFFFFF',
        'cal-bg-emphasis': '#FBF9F5',
        'cal-border': '#E4E7EE',
        'cal-border-emphasis': '#4A5670',
      };

      cal('ui', {
        theme: 'light',
        cssVarsPerTheme: {
          light: calColors,
          dark: calColors,
        },
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
    })();
  }, []);

  if (!calLink) {
    return (
      <div className="card-cool p-8 text-center">
        <p className="mb-4 font-sans text-sm text-ink-muted">
          La prise de rendez-vous en ligne n'est pas encore configurée.
        </p>
        <a
          href={`mailto:${SITE_CONFIG.contact.email}?subject=Diagnostic%20IA%20gratuit`}
          className="btn-primary"
        >
          Demander un créneau par email
          <span aria-hidden="true">→</span>
        </a>
      </div>
    );
  }

  return (
    <div className="card-warm rounded-3xl p-8 md:p-12">
      <div className="font-sans text-2xl font-bold tracking-tight text-ink md:text-3xl">
        Diagnostic IA <span className="text-accent-deep">· 30 minutes</span>
      </div>
      <p className="mt-3 max-w-md font-sans text-base leading-relaxed text-ink-muted">
        Réservez un créneau dans notre agenda. Visioconférence, sans engagement, sans préparation à fournir.
      </p>

      <div className="mt-8 flex items-center gap-4 flex-wrap">
        <button
          type="button"
          data-cal-link={calLink}
          data-cal-namespace=""
          data-cal-config='{"layout":"month_view","theme":"light"}'
          className="btn-primary"
        >
          Réserver mon créneau
          <span aria-hidden="true">→</span>
        </button>
        <a
          href={`https://cal.com/${calLink}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-sm text-ink-muted underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-ink"
        >
          ou ouvrir dans un nouvel onglet
        </a>
      </div>

      <ul className="mt-10 grid grid-cols-1 gap-3 border-t border-sun/40 pt-8 sm:grid-cols-3">
        {[
          'Sans engagement',
          'Visio incluse',
          'Compte-rendu sous 48 h',
        ].map((item) => (
          <li
            key={item}
            className="flex items-center gap-2.5 font-sans text-sm text-ink"
          >
            <span className="block size-1.5 shrink-0 rounded-full bg-sun" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
