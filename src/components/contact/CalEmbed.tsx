'use client';

import { useEffect } from 'react';

/**
 * Widget Cal.com inline pour la prise de rendez-vous diagnostic.
 *
 * Configuration : l'URL Cal.com est lue depuis NEXT_PUBLIC_CAL_USERNAME (ex: "qwestinum/diagnostic-30min").
 * Si la variable n'est pas définie, on affiche un placeholder avec un lien direct mailto.
 *
 * Côté Cal.com :
 *   1. Crée un compte sur cal.com (gratuit pour 1 utilisateur)
 *   2. Crée un type de rendez-vous "Diagnostic IA — 30 min"
 *   3. Récupère le slug (ex: "qwestinum/diagnostic-30min")
 *   4. Ajoute NEXT_PUBLIC_CAL_USERNAME=qwestinum/diagnostic-30min dans Vercel
 */
export function CalEmbed() {
  const calLink = process.env.NEXT_PUBLIC_CAL_USERNAME;

  useEffect(() => {
    if (!calLink) return;

    // Charge le script d'embed Cal.com une seule fois
    if (!(window as unknown as { Cal?: unknown }).Cal) {
      const script = document.createElement('script');
      script.src = 'https://app.cal.com/embed/embed.js';
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        const cal = (window as unknown as {
          Cal?: ((command: string, ...args: unknown[]) => void) & {
            ns?: Record<string, (command: string, ...args: unknown[]) => void>;
          };
        }).Cal;

        if (cal) {
          cal('init', { origin: 'https://cal.com' });
          cal('inline', {
            elementOrSelector: '#cal-embed',
            calLink,
            layout: 'month_view',
            config: { theme: 'light' },
          });
          cal('ui', {
            theme: 'light',
            cssVarsPerTheme: {
              light: {
                'cal-brand': '#D4A82C',
                'cal-text': '#2A2724',
                'cal-text-emphasis': '#2A2724',
                'cal-text-muted': '#807D75',
                'cal-bg': '#F4F0E8',
                'cal-bg-emphasis': '#D8D2C2',
                'cal-border': '#D8D2C2',
                'cal-border-emphasis': '#807D75',
              },
            },
            hideEventTypeDetails: false,
            layout: 'month_view',
          });
        }
      };
    }
  }, [calLink]);

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
    <div
      id="cal-embed"
      className="min-h-[640px] bg-lin rounded-md overflow-hidden border border-perle"
      aria-label="Calendrier de réservation Cal.com"
    />
  );
}
