/**
 * Next.js utilise des exceptions comme mécanisme de contrôle interne :
 * `notFound()`, `redirect()` et surtout la bascule statique -> dynamique
 * quand une page touche `cookies()` lèvent une erreur porteuse d'un
 * `digest`, que le framework rattrape lui-même plus haut dans la pile.
 *
 * Nos requêtes Supabase sont enveloppées dans des `try/catch` destinés aux
 * pannes réseau/base. Sans ce garde-fou, ces `catch` avalent aussi le
 * signal de Next : le framework ne bascule jamais en rendu dynamique et la
 * route renvoie une 500 (cas vécu sur /cas-usage/[slug] et /formations/[slug]).
 *
 * À appeler en PREMIÈRE ligne de chaque `catch` d'une requête serveur.
 */
const FRAMEWORK_DIGESTS = [
  'DYNAMIC_SERVER_USAGE',
  'NEXT_NOT_FOUND',
  'NEXT_REDIRECT',
  'BAILOUT_TO_CLIENT_SIDE_RENDERING',
];

export function rethrowIfFrameworkError(err: unknown): void {
  if (typeof err !== 'object' || err === null) return;

  const digest = (err as { digest?: unknown }).digest;
  if (typeof digest !== 'string') return;

  // `NEXT_REDIRECT` arrive sous la forme "NEXT_REDIRECT;replace;/url;307;"
  if (FRAMEWORK_DIGESTS.some((d) => digest === d || digest.startsWith(`${d};`))) {
    throw err;
  }
}
