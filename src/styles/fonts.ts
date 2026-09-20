import { Carlito, Fraunces } from 'next/font/google';

/**
 * Carlito — sans-serif unique de l'interface et des titres.
 * Police de la charte ORQA (métriquement compatible Calibri).
 * Attention : Carlito n'existe qu'en 400 et 700. `font-medium` (500)
 * et `font-semibold` (600) sont donc rendus en 400 et 700.
 */
export const carlito = Carlito({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-carlito',
});

/**
 * Fraunces — serif éditoriale, réservée au contenu long (/ressources).
 * Différenciateur Qwestinum : la charte est celle d'ORQA, la voix
 * éditoriale reste celle de Qwestinum.
 */
export const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-fraunces',
});
