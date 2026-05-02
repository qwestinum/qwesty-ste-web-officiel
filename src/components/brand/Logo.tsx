/**
 * Composants Logo Qwestinum — SVG inline pour pouvoir piloter les couleurs
 * via les classes Tailwind. La constellation reste fidèle au brand book.
 */

import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  inverted?: boolean;
}

/**
 * Symbole seul — favicon, marqueurs, app icons.
 * Inversé : satellites blancs sur fond sombre.
 */
export function LogoSymbol({ className, inverted = false }: LogoProps) {
  const stroke = inverted ? '#FBFAF7' : '#2A2724';
  const dotDark = inverted ? '#FBFAF7' : '#2A2724';
  const dotGold = '#D4A82C';

  return (
    <svg
      viewBox="0 0 200 200"
      className={cn('shrink-0', className)}
      role="img"
      aria-label="Qwestinum"
    >
      <line x1="100" y1="100" x2="74" y2="50" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="100" y1="100" x2="118" y2="44" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="100" y1="100" x2="156" y2="78" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="100" y1="100" x2="58" y2="106" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="100" y1="100" x2="156" y2="124" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="100" y1="100" x2="86" y2="160" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="100" cy="100" r="20" fill={dotGold} />
      <circle cx="74" cy="50" r="11" fill={dotDark} />
      <circle cx="118" cy="44" r="9" fill={dotGold} />
      <circle cx="156" cy="78" r="11" fill={dotDark} />
      <circle cx="58" cy="106" r="11" fill={dotGold} />
      <circle cx="156" cy="124" r="9" fill={dotDark} />
      <circle cx="86" cy="160" r="13" fill={dotGold} />
    </svg>
  );
}

/**
 * Logo horizontal complet — symbole + wordmark.
 * Utilisé dans les headers de site, les signatures.
 */
export function LogoHorizontal({ className, inverted = false }: LogoProps) {
  const textColor = inverted ? 'text-lin' : 'text-sepia';

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <LogoSymbol inverted={inverted} className="h-9 w-9 md:h-10 md:w-10" />
      <span
        className={cn(
          'font-sans text-xl md:text-2xl font-medium tracking-wide-1',
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
  const textColor = inverted ? 'text-lin' : 'text-sepia';
  const taglineColor = inverted ? 'text-perle' : 'text-pierre';

  return (
    <div className={cn('flex flex-col items-center gap-7', className)}>
      <LogoSymbol inverted={inverted} className="h-44 w-44" />
      <div className="text-center">
        <div
          className={cn(
            'font-sans text-4xl md:text-5xl font-medium tracking-wide-1',
            textColor
          )}
        >
          QWEST<span className="font-normal">i</span>NUM
        </div>
        <div
          className={cn(
            'mt-3 font-sans text-xs font-medium uppercase tracking-wide-3',
            taglineColor
          )}
        >
          Process · AI · Transformation
        </div>
      </div>
    </div>
  );
}
