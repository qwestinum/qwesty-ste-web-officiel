import { Fraunces, Inter } from 'next/font/google';

/**
 * Fraunces — serif éditoriale moderne pour les titres et le display.
 */
export const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-fraunces',
});

/**
 * Inter — sans-serif neutre pour le corps et l'UI.
 */
export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-inter',
});
