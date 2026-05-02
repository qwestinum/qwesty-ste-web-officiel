'use client';

import { getCalApi } from '@calcom/embed-react';
import { useEffect } from 'react';

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
        'cal-brand': '#D4A82C',
        'cal-text': '#2A2724',
        'cal-text-emphasis': '#2A2724',
        'cal-text-muted': '#807D75',
        'cal-bg': '#F4F0E8',
        'cal-bg-emphasis': '#D8D2C2',
        'cal-border': '#D8D2C2',
        'cal-border-emphasis': '#807D75',
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
      <div className="bg-perle/30 border border-perle rounded-md p-8 text-center">
        <p className="font-sans text-sm text-pierre mb-4">
          La prise de rendez-vous en ligne n'est pas encore configurée.
        </p>
        <a
          href="mailto:contact@qwestinum.com?subject=Diagnostic%20IA%20gratuit"
          className="btn-primary"
        >
          Demander un créneau par email
          <span aria-hidden="true">→</span>
        </a>
      </div>
    );
  }

  return (
    <div className="bg-perle/20 border border-perle rounded-md p-8 md:p-12">
      <div className="font-serif text-2xl md:text-3xl font-medium tracking-tight-1 text-sepia">
        Diagnostic IA <em className="italic text-or-fonce">· 30 minutes</em>
      </div>
      <p className="mt-3 font-sans text-base leading-relaxed text-pierre max-w-md">
        Réservez un créneau dans notre agenda. Visioconférence, sans engagement, sans préparation à fournir.
      </p>

      <div className="mt-8 flex items-center gap-4 flex-wrap">
        <button
          type="button"
          data-cal-link={calLink}
          data-cal-namespace=""
          data-cal-config='{"layout":"month_view","theme":"light"}'
          className="inline-flex items-center gap-2 rounded-sm bg-or px-7 py-4 font-sans text-xs font-semibold uppercase tracking-wide-2 text-sepia transition-all hover:bg-or-pale hover:-translate-y-0.5"
        >
          Réserver mon créneau
          <span aria-hidden="true">→</span>
        </button>
        <a
          href={`https://cal.com/${calLink}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-xs text-pierre hover:text-or-fonce transition-colors"
        >
          ou ouvrir dans un nouvel onglet
        </a>
      </div>

      <ul className="mt-10 pt-8 border-t border-perle grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          'Sans engagement',
          'Visio incluse',
          'Compte-rendu sous 48 h',
        ].map((item) => (
          <li
            key={item}
            className="flex items-center gap-2.5 font-sans text-sm text-sepia"
          >
            <span className="block w-1.5 h-1.5 rounded-full bg-or shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
