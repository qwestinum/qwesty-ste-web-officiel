# LOT 5 — Éditeur d'articles Tiptap + Supabase Storage

## Vue d'ensemble

Ce lot débloque la **publication autonome d'articles** depuis l'admin :
- Éditeur WYSIWYG complet (Tiptap)
- Upload d'images via Supabase Storage
- Auto-save toutes les 30s
- Page Preview avant publication
- Sanitization XSS du HTML rendu

## Procédure de déploiement — dans l'ordre

### Étape 1 — Migration SQL Supabase Storage

Va sur **Supabase → SQL Editor → New query** et exécute le contenu de :
```
supabase/migration-storage.sql
```

Cette migration :
- Crée le bucket public `articles-images` (5 MB max, JPEG/PNG/WebP/GIF)
- Configure les politiques RLS (lecture publique, upload admin)

**Vérification** :
```sql
select * from storage.buckets where id = 'articles-images';
-- → 1 ligne, public = true
```

### Étape 2 — Mettre à jour package.json

Ajouter ces dépendances dans le bloc `"dependencies"` :

```json
"@tiptap/extension-image": "^2.10.3",
"@tiptap/extension-link": "^2.10.3",
"@tiptap/extension-placeholder": "^2.10.3",
"@tiptap/pm": "^2.10.3",
"@tiptap/react": "^2.10.3",
"@tiptap/starter-kit": "^2.10.3",
"isomorphic-dompurify": "^2.18.0",
```

### Étape 3 — Pousser le code

Décompresse le ZIP et fusionne avec ton repo local. Les fichiers sont :

**Nouveaux** :
- `src/lib/tiptap/extensions.ts`
- `src/lib/tiptap/render.ts`
- `src/lib/queries/articles-admin.ts`
- `src/lib/actions/articles.ts`
- `src/components/admin/editor/TiptapEditor.tsx`
- `src/components/admin/editor/EditorToolbar.tsx`
- `src/components/admin/editor/ArticleMetaForm.tsx`
- `src/components/admin/editor/CreateArticleButton.tsx`
- `src/app/admin/articles/page.tsx`
- `src/app/admin/articles/[id]/edit/page.tsx`
- `src/app/admin/articles/[id]/preview/page.tsx`

**Modifiés** :
- `src/components/admin/AdminShell.tsx` (Articles devient cliquable)
- `src/app/globals.css` (ajouter le contenu de `globals-additions.css` à la fin)

Commit + push.

### Étape 4 — Build Vercel

Vercel relance automatiquement (~3 min).

⚠️ **TypeScript strict** : si tu as des erreurs `never`, c'est le pattern récurrent qu'on connaît :
- Pour `.update()`/`.insert()` → `const table = supabase.from('xxx') as any` puis chaîner
- Pour `.select('partial')` → `data as unknown as Type[]`

Tous les fichiers livrés appliquent déjà ces patterns.

### Étape 5 — Tester le flow complet

1. Va sur `/admin` → connecte-toi
2. Clique **Articles** dans la sidebar (maintenant cliquable, plus "bientôt")
3. Clique **+ Nouvel article**
4. Tu es redirigé vers `/admin/articles/[id]/edit`
5. Tape un titre, change le slug si besoin
6. Dans l'éditeur, écris un paragraphe, ajoute un H2, une liste, un lien
7. **Upload d'image** : clique 🖼 dans la toolbar → sélectionne une image → elle s'insère
8. Attends 30s → tu vois "Sauvegardé" en bas
9. Ou sauvegarde immédiatement avec Cmd/Ctrl+S
10. Clique **Aperçu →** dans la sidebar → tu vois l'article rendu
11. Reviens à l'édition → clique **Publier**
12. Va sur `/ressources` → ton article est visible publiquement

## Architecture

```
Édition Tiptap (client)
    ↓ JSON Tiptap
saveArticleContent() Server Action
    ↓ JSON + HTML généré + reading_time
articles table (content, content_html, reading_time_minutes)
    ↓ revalidatePath('/ressources')
Site public (rend content_html avec dangerouslySetInnerHTML)
```

Le HTML est généré côté serveur (jamais côté client) et **sanitizé avec DOMPurify** avant stockage. Donc même si quelqu'un pollue le JSON Tiptap directement en DB, l'HTML rendu reste safe.

## Ce qui reste à faire (Lot 6)

- CRUD `use_cases`
- CRUD `formations`
- CRUD `flagship_modules`
- CRUD `partners`

Tout réutilisera l'AdminShell et les patterns d'éditeur déjà en place.
