# Qwestinum — Site dynamique

Site institutionnel de Qwestinum avec admin intégré.

**Stack** : Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase (PostgreSQL + Auth) · Tiptap (éditeur d'articles)

---

## 🚀 Démarrage en local

### Prérequis

- **Node.js 18+** ([télécharger](https://nodejs.org))
- **Compte Supabase** (free tier — voir étape 2)

### 1. Installer les dépendances

```bash
cd qwestinum-site
npm install
```

L'installation peut prendre 1 à 2 minutes.

### 2. Créer le projet Supabase

1. Va sur https://supabase.com et crée un compte (ou connecte-toi avec GitHub)
2. Clique sur **New project**
3. Remplis :
   - **Name** : `qwestinum-prod` (ou ce que tu veux)
   - **Database password** : génère un mot de passe fort, **garde-le précieusement**
   - **Region** : `Frankfurt (eu-central-1)` (proximité UE pour RGPD)
   - **Pricing plan** : `Free`
4. Attends ~2 minutes pendant le provisionnement

### 3. Créer le schéma de base de données

1. Dans Supabase, va dans **SQL Editor** (icône `</>` dans la sidebar)
2. Clique sur **New query**
3. Ouvre le fichier `supabase/schema.sql` de ce projet
4. Copie tout son contenu, colle-le dans l'éditeur SQL Supabase
5. Clique sur **Run** (ou Ctrl/Cmd + Enter)
6. Tu dois voir "Success. No rows returned" → tout est bon

### 4. Configurer les variables d'environnement

1. Dans Supabase, va dans **Project Settings** → **API**
2. Copie la **Project URL** et l'**anon public key**
3. Dans le projet local, copie `.env.example` en `.env.local` :

```bash
cp .env.example .env.local
```

4. Édite `.env.local` et remplace les valeurs :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Activer l'authentification Magic Link

1. Dans Supabase, va dans **Authentication** → **Providers**
2. Clique sur **Email**
3. Active **Enable Email provider**
4. (Optionnel) Désactive **Confirm email** pour aller plus vite en dev
5. Active **Enable email magic link**
6. Sauvegarde

### 6. Lancer le serveur de développement

```bash
npm run dev
```

Ouvre http://localhost:3000 dans ton navigateur.

Si tout est bon, tu vois :
- Le logo Qwestinum (constellation perle & or)
- Un panneau de diagnostic avec **4 lignes vertes** ("Actif" / "X partenaires")

🎉 **Le Lot 1 est opérationnel.**

---

## 📁 Organisation du projet

```
qwestinum-site/
├── public/                    Assets statiques (logos SVG, favicon...)
├── supabase/
│   └── schema.sql             Schéma DB complet à coller dans Supabase
├── src/
│   ├── app/                   Pages (App Router Next.js)
│   │   ├── layout.tsx         Layout racine — polices + meta
│   │   ├── page.tsx           Page d'accueil
│   │   └── globals.css        CSS global + Tailwind
│   ├── components/
│   │   └── brand/
│   │       └── Logo.tsx       Composants Logo (SVG inline)
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts      Client Supabase navigateur
│   │   │   ├── server.ts      Client Supabase serveur
│   │   │   └── types.ts       Types TypeScript de la DB
│   │   ├── utils.ts           Helpers (cn, formatDate, slugify...)
│   │   └── constants.ts       Config site (nav, contact...)
│   └── styles/
│       └── fonts.ts           Configuration Fraunces + Inter
├── tailwind.config.ts         Palette + polices Tailwind
├── tsconfig.json              Config TypeScript
└── package.json               Dépendances
```

---

## 🎨 Charte graphique

**Couleurs Tailwind disponibles** :
- `lin` `#FBFAF7` — background principal
- `perle` `#DCD9D1` — surfaces secondaires
- `pierre` `#807D75` — texte secondaire
- `sepia` `#2A2724` — texte primaire (encre)
- `or-pale` `#F4D35E` — accents discrets
- `or` `#D4A82C` — CTA principaux
- `or-fonce` `#A8861C` — hover, états actifs

**Polices** :
- `font-serif` → Fraunces (titres éditoriaux)
- `font-sans` → Inter (corps + UI)

**Composants utilitaires** déjà disponibles dans `globals.css` :
- `.container-page` — container centré 1200px max
- `.btn-primary` — bouton or
- `.btn-secondary` — bouton outline
- `.label-mark` — label uppercase espacé
- `.link-editorial` — lien souligné or pâle

---

## 🔐 Devenir admin (après le Lot 4)

Quand le Lot 4 sera livré, tu pourras te connecter à `/admin/login`. Après avoir reçu ton magic link et créé ton compte Supabase, exécute cette requête dans le SQL Editor pour devenir admin :

```sql
insert into public.admin_users (user_id, email, role)
values (
  (select id from auth.users where email = 'TON-EMAIL@example.com'),
  'TON-EMAIL@example.com',
  'admin'
);
```

---

## 📦 Roadmap des lots

- ✅ **Lot 1 — Setup** (actuel) : Next.js + Tailwind + Supabase + diagnostic
- ⏳ **Lot 2 — Page d'accueil premium** : hero, partenaires, services, garanties, etc.
- ⏳ **Lot 3 — Pages publiques** : cas d'usage, formations, ressources, à propos
- ⏳ **Lot 4 — Auth admin** : magic link, dashboard, layout admin
- ⏳ **Lot 5 — Éditeur Tiptap** : CRUD articles avec WYSIWYG
- ⏳ **Lot 6 — Gestion content** : formations, cas, modules, partenaires

---

## 🛠️ Commandes utiles

```bash
npm run dev          # Serveur de développement (localhost:3000)
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Linter ESLint
npm run type-check   # Vérification TypeScript
```

---

**Contact** : contact@qwestinum.com
