/**
 * Composants Logo Qwestinum — SVG inline pour pouvoir piloter les couleurs
 * via les classes Tailwind. La constellation reste fidèle au brand book.
 *
 * Déclinaison charte ORQA : la marque est monochrome encre (comme le
 * logotype ORQA, #001C41), le nœud central portant la seule touche de
 * couleur — l'accent en clair, le jaune « sun » en inversé.
 */

import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  inverted?: boolean;
}

/**
 * Symbole seul — favicon, marqueurs, app icons.
 * Inversé : constellation crème sur fond encre.
 */
export function LogoSymbol({ className, inverted = false }: LogoProps) {
  const structure = inverted ? '#FBF9F5' : '#0A1F4B';
  const core = inverted ? '#FBD171' : '#2B9FD8';

  return (
    <svg
      viewBox="0 0 200 200"
      className={cn('shrink-0', className)}
      role="img"
      aria-label="Qwestinum"
    >
      <line x1="100" y1="100" x2="74" y2="50" stroke={structure} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="100" y1="100" x2="118" y2="44" stroke={structure} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="100" y1="100" x2="156" y2="78" stroke={structure} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="100" y1="100" x2="58" y2="106" stroke={structure} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="100" y1="100" x2="156" y2="124" stroke={structure} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="100" y1="100" x2="86" y2="160" stroke={structure} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="100" cy="100" r="20" fill={core} />
      <circle cx="74" cy="50" r="11" fill={structure} />
      <circle cx="118" cy="44" r="9" fill={structure} />
      <circle cx="156" cy="78" r="11" fill={structure} />
      <circle cx="58" cy="106" r="11" fill={structure} />
      <circle cx="156" cy="124" r="9" fill={structure} />
      <circle cx="86" cy="160" r="13" fill={structure} />
    </svg>
  );
}

/**
 * Logo horizontal complet — symbole + wordmark.
 * Utilisé dans les headers de site, les signatures.
 */
export function LogoHorizontal({ className, inverted = false }: LogoProps) {
  const textColor = inverted ? 'text-cream' : 'text-ink';

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <LogoSymbol inverted={inverted} className="h-9 w-9 md:h-10 md:w-10" />
      <span
        className={cn(
          'font-sans text-xl font-bold tracking-wide-1 md:text-2xl',
          textColor
        )}
      >
        QWEST<span className="font-normal">i</span>NUM
      </span>
    </div>
  );
}

/**
 * Logo vertical complet — symbole + wordmark + tagline.
 * Pour les hero, splash screens, présentations.
 */
export function LogoVertical({ className, inverted = false }: LogoProps) {
  const textColor = inverted ? 'text-cream' : 'text-ink';
  const taglineColor = inverted ? 'text-cream/70' : 'text-ink-muted';

  return (
    <div className={cn('flex flex-col items-center gap-7', className)}>
      <LogoSymbol inverted={inverted} className="h-44 w-44" />
      <div className="text-center">
        <div
          className={cn(
            'font-sans text-4xl font-bold tracking-wide-1 md:text-5xl',
            textColor
          )}
        >
          QWEST<span className="font-normal">i</span>NUM
        </div>
        <div
          className={cn(
            'mt-3 font-sans text-xs font-semibold uppercase tracking-wide-3',
            taglineColor
          )}
        >
          Process · AI · Transformation
        </div>
      </div>
    </div>
  );
}
