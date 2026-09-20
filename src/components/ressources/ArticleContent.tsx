/**
 * Rend le contenu HTML produit par l'éditeur Tiptap avec une typographie
 * éditoriale soignée (Fraunces pour les titres, Carlito pour le corps) :
 * c'est le seul endroit du site où la serif subsiste.
 *
 * Le `content_html` est généré et caché côté admin (Lot 5) à chaque save.
 */
interface ArticleContentProps {
  html: string;
}

export function ArticleContent({ html }: ArticleContentProps) {
  return (
    <div
      className="prose-qwesty"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
