# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint via next lint
npm run type-check   # TypeScript check without emitting
```

No test suite is configured.

## Environment

Copy `.env.example` to `.env.local` and fill in:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase Project Settings > API
- `SUPABASE_SERVICE_ROLE_KEY` — server-only, never expose to client
- `NEXT_PUBLIC_SITE_URL` — `http://localhost:3000` locally

## Architecture

**Next.js 14 App Router** site for Qwestinum (French AI consulting firm). All content is French.

### Layer structure

```
src/app/              — Pages (public + admin routes)
src/components/       — React components grouped by domain
src/lib/actions/      — Server Actions (mutations)
src/lib/queries/      — Supabase read queries
src/lib/supabase/     — Supabase clients + TypeScript types
src/lib/tiptap/       — Tiptap editor extensions + HTML rendering
src/lib/constants.ts  — Site-wide config (SITE_CONFIG, NAV_LINKS, FOOTER_LINKS)
src/styles/fonts.ts   — Google Fonts (Fraunces + Inter)
```

### Data flow (articles as canonical example)

```
Tiptap editor (client JSON)
  → saveArticleContent() server action
  → tiptapJsonToSafeHtml() converts JSON → HTML → sanitize-html strips XSS
  → articles table stores both content (JSON) and content_html (sanitized HTML)
  → revalidatePath() clears ISR cache
  → public /ressources pages render content_html via dangerouslySetInnerHTML
```

### Auth & admin

- Supabase Auth protects all `/admin/*` routes via `src/middleware.ts`
- Middleware refreshes the session cookie on every request and redirects unauthenticated users to `/admin/login`
- `src/lib/supabase/server.ts` — server-side client (Server Components, Server Actions)
- `src/lib/supabase/client.ts` — browser client (client components only)
- Login route lives at `src/app/(auth)/admin/login/` (route group, no layout applied)

### Supabase TypeScript workaround

The generated types cause `never` errors on `.update()` / `.insert()`. Established pattern throughout the codebase:

```ts
const table = supabase.from('articles') as any;
await table.update({ ... }).eq('id', id);
// For selects with partial fields:
const data = rawData as unknown as Article[];
```

### Design system

Custom Tailwind palette (no generic gray/blue):

| Token | Hex | Use |
|---|---|---|
| `lin` | `#F4F0E8` | Main background (warm ivory) |
| `perle` | `#D8D2C2` | Secondary surfaces |
| `pierre` | `#807D75` | Secondary text |
| `sepia` | `#2A2724` | Primary text |
| `or-pale` | `#F4D35E` | Subtle accents |
| `or` | `#D4A82C` | CTA, primary accents |
| `or-fonce` | `#A8861C` | Hover / active states |

Fonts: `font-serif` → Fraunces (titles/display), `font-sans` → Inter (body/UI).

### Key public routes

- `/` — Homepage (ISR, `revalidate = 300`)
- `/cas-usage` / `/cas-usage/[slug]` — Use cases
- `/formations` / `/formations/[slug]` — Training courses
- `/ressources` / `/ressources/[slug]` — Articles (rendered from `content_html`)
- `/contact` — Contact form + Cal.com embed

### Admin routes

- `/admin` — Dashboard
- `/admin/articles` — Article list + create
- `/admin/articles/[id]/edit` — Tiptap editor with auto-save every 30s (Cmd/Ctrl+S for immediate save)
- `/admin/articles/[id]/preview` — Preview before publish
- `/admin/leads` / `/admin/leads/[id]` — CRM leads

### Supabase schema

Tables: `articles`, `formations`, `flagship_modules`, `use_cases`, `partners`, `admin_users`, `site_settings`, `leads`. All types in `src/lib/supabase/types.ts`. Storage bucket `articles-images` (public, 5MB max, JPEG/PNG/WebP/GIF).

Content status pattern: `draft` → `published` → `archived` (used by articles, formations, use_cases).
