'use client';

import Cal, { getCalApi } from '@calcom/embed-react';
import { useEffect } from 'react';

/**
 * Widget Cal.com inline pour la prise de rendez-vous diagnostic.
 *
 * Hauteur adaptative selon la taille de l'écran :
 *  - Mobile : 720px (évite scroll interne à l'embed)
 *  - Desktop : 760px (confortable pour mois + créneaux côte à côte)
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
    <div className="rounded-md overflow-hidden border border-perle bg-lin">
      <Cal
        calLink={calLink}
        style={{
          width: '100%',
          height: '760px',
          minHeight: '720px',
          overflow: 'hidden',
        }}
        config={{ layout: 'month_view', theme: 'light' }}
      />

      {/* Lien de secours pour ouvrir Cal.com en plein écran si l'embed coince */}
      <div className="border-t border-perle bg-perle/30 px-4 py-3 text-center">
        <a
          href={`https://cal.com/${calLink}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-xs text-pierre hover:text-or-fonce transition-colors inline-flex items-center gap-1.5"
        >
          Ouvrir le calendrier en plein écran
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}
