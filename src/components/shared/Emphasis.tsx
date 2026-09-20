import { cn } from '@/lib/utils';

/**
 * Mot mis en avant dans un titre — le soulignement tracé de la charte ORQA :
 * un coup de pinceau jaune posé DERRIÈRE le mot (`isolate` + `-z-10`).
 *
 * Seule adaptation Qwestinum : le mot est en `accent-deep` (5.35:1) et non
 * en `accent` (2.83:1, sous le seuil). La signature visuelle est identique,
 * le contraste passe.
 */
export function Emphasis({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'relative isolate inline-block whitespace-nowrap text-accent-deep',
        className
      )}
    >
      {children}
      <svg
        className="pointer-events-none absolute -bottom-[0.14em] -left-[3%] -z-10 h-[0.42em] w-[106%]"
        viewBox="0 0 300 24"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          fill="#FBD171"
          d="M3 13.5C22 9.8 58 7.4 104 6.6c52-.9 104 .2 150 1.4 17 .5 31 1.1 41 2.2 3 .3 4.4 2 3.2 3.9-1 1.5-3.4 2.3-7 2.5-38 1.7-86 2.6-136 3.7-44 1-86 2.3-128 4-9.4.4-15.6.1-18.8-.9-4.3-1.4-5.2-4.8-.4-8.2Z"
        />
        <path
          fill="#FED57B"
          opacity="0.55"
          d="M18 17.8c40-2.6 92-4.2 150-4.9 44-.5 86-.2 118 .8 2.2.1 2.6 1.3.6 1.7-30 2.2-78 3.5-128 4.4-48 .9-94 1.3-138 .6-4-.1-5.6-1.9-2.6-2.6Z"
        />
      </svg>
    </span>
  );
}
