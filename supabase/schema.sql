-- ============================================================
-- QWESTINUM — Schéma de base de données
-- ============================================================
-- À exécuter dans Supabase > SQL Editor > New query
-- Crée toutes les tables, les politiques RLS et les fonctions utiles.
-- ============================================================

-- ------------------------------------------------------------
-- 0. EXTENSIONS
-- ------------------------------------------------------------
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- 1. FONCTION updated_at AUTOMATIQUE
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ------------------------------------------------------------
-- 2. TABLE admin_users — comptes admin
-- ------------------------------------------------------------
create table if not exists public.admin_users (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  email text not null,
  role text not null default 'admin' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 3. TABLE articles — blog/ressources
-- ------------------------------------------------------------
create table if not exists public.articles (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content jsonb,                    -- contenu Tiptap au format JSON
  content_html text,                -- version rendue (cache)
  category text not null default 'strategie' check (
    category in ('strategie', 'methode', 'retours-experience', 'lucidite-ia')
  ),
  cover_image_url text,
  reading_time_minutes integer,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  is_featured boolean not null default false,
  author_name text default 'Imad Belfaqir',
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_status_published_at_idx
  on public.articles(status, published_at desc) where status = 'published';
create index if not exists articles_slug_idx on public.articles(slug);
create index if not exists articles_category_idx on public.articles(category);

create trigger articles_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 4. TABLE formations — catalogue de formations
-- ------------------------------------------------------------
create table if not exists public.formations (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  excerpt text,
  level text check (level in ('fondations', 'productivite', 'direction', 'methode', 'execution', 'conformite', 'business', 'humain')),
  level_label text,
  duration_days numeric,
  duration_label text,            -- ex: "2 jours · 14h"
  audience text,
  description text,
  programme jsonb,                -- tableau d'items ["...","..."]
  formats text[],                 -- ['inter', 'intra', 'distanciel', 'sur-mesure']
  price_label text,               -- ex: "Sur devis", "1 200€ HT"
  is_flagship boolean not null default false,
  display_order integer not null default 100,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists formations_status_idx on public.formations(status);
create index if not exists formations_slug_idx on public.formations(slug);

create trigger formations_updated_at
  before update on public.formations
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 5. TABLE flagship_modules — 9 modules du programme phare
-- ------------------------------------------------------------
create table if not exists public.flagship_modules (
  id uuid primary key default uuid_generate_v4(),
  module_number integer not null unique,
  title text not null,
  description text,
  tag text,                       -- ex: "Fondations", "Méthode signature"
  is_highlight boolean not null default false,
  display_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger flagship_modules_updated_at
  before update on public.flagship_modules
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 6. TABLE use_cases — cas clients & solutions produit
-- ------------------------------------------------------------
create table if not exists public.use_cases (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  subtitle text,
  case_type text not null default 'client' check (case_type in ('client', 'product')),
  sector text,                    -- ex: "Hôtellerie 5★", "RH/ESN"
  status_label text,              -- ex: "Déployé", "En cours", "Bêta à venir"
  problem text,
  solution_items jsonb,           -- tableau ["...","..."]
  kpis jsonb,                     -- [{value, label, projected: bool}]
  accent_color text default 'or' check (accent_color in ('or', 'sepia', 'pierre', 'or-pale')),
  display_order integer not null default 100,
  is_featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists use_cases_status_idx on public.use_cases(status);
create index if not exists use_cases_slug_idx on public.use_cases(slug);

create trigger use_cases_updated_at
  before update on public.use_cases
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 7. TABLE partners — partenaires technologiques
-- ------------------------------------------------------------
create table if not exists public.partners (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  logo_svg text,                  -- SVG inline pour rendu propre
  logo_url text,                  -- ou URL externe
  website_url text,
  display_order integer not null default 100,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger partners_updated_at
  before update on public.partners
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 8. TABLE site_settings — paramètres globaux du site
-- ------------------------------------------------------------
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create trigger site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 9. ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------
-- Active RLS sur toutes les tables
alter table public.admin_users      enable row level security;
alter table public.articles         enable row level security;
alter table public.formations       enable row level security;
alter table public.flagship_modules enable row level security;
alter table public.use_cases        enable row level security;
alter table public.partners         enable row level security;
alter table public.site_settings    enable row level security;

-- Fonction utilitaire : "l'utilisateur courant est-il admin ?"
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
  );
end;
$$ language plpgsql security definer;

-- ------------------------------------------------------------
-- POLICIES — articles
-- ------------------------------------------------------------
-- Lecture publique : seulement les articles publiés
create policy "Articles published readable by all"
  on public.articles for select
  using (status = 'published');

-- Lecture admin : tous les articles (incl. drafts)
create policy "Articles all readable by admin"
  on public.articles for select
  using (public.is_admin());

create policy "Articles writable by admin"
  on public.articles for all
  using (public.is_admin())
  with check (public.is_admin());

-- ------------------------------------------------------------
-- POLICIES — formations
-- ------------------------------------------------------------
create policy "Formations published readable by all"
  on public.formations for select
  using (status = 'published');

create policy "Formations all readable by admin"
  on public.formations for select
  using (public.is_admin());

create policy "Formations writable by admin"
  on public.formations for all
  using (public.is_admin())
  with check (public.is_admin());

-- ------------------------------------------------------------
-- POLICIES — flagship_modules
-- ------------------------------------------------------------
create policy "Flagship modules readable by all"
  on public.flagship_modules for select using (true);

create policy "Flagship modules writable by admin"
  on public.flagship_modules for all
  using (public.is_admin())
  with check (public.is_admin());

-- ------------------------------------------------------------
-- POLICIES — use_cases
-- ------------------------------------------------------------
create policy "Use cases published readable by all"
  on public.use_cases for select
  using (status = 'published');

create policy "Use cases all readable by admin"
  on public.use_cases for select
  using (public.is_admin());

create policy "Use cases writable by admin"
  on public.use_cases for all
  using (public.is_admin())
  with check (public.is_admin());

-- ------------------------------------------------------------
-- POLICIES — partners
-- ------------------------------------------------------------
create policy "Partners active readable by all"
  on public.partners for select
  using (is_active = true);

create policy "Partners writable by admin"
  on public.partners for all
  using (public.is_admin())
  with check (public.is_admin());

-- ------------------------------------------------------------
-- POLICIES — site_settings
-- ------------------------------------------------------------
create policy "Settings readable by all"
  on public.site_settings for select using (true);

create policy "Settings writable by admin"
  on public.site_settings for all
  using (public.is_admin())
  with check (public.is_admin());

-- ------------------------------------------------------------
-- POLICIES — admin_users
-- ------------------------------------------------------------
create policy "Admin users readable by self"
  on public.admin_users for select
  using (user_id = auth.uid() or public.is_admin());

create policy "Admin users writable by admin"
  on public.admin_users for all
  using (public.is_admin())
  with check (public.is_admin());

-- ------------------------------------------------------------
-- 10. SEED DATA — données initiales
-- ------------------------------------------------------------
-- Partenaires technologiques (les logos SVG seront ajoutés via l'admin)
insert into public.partners (name, display_order, is_active) values
  ('Anthropic', 10, true),
  ('OpenAI', 20, true),
  ('n8n', 30, true),
  ('Make', 40, true),
  ('Supabase', 50, true),
  ('Vercel', 60, true),
  ('Cal.com', 70, true)
on conflict do nothing;

-- 9 modules du programme flagship
insert into public.flagship_modules (module_number, title, description, tag, is_highlight, display_order) values
  (1, 'Comprendre l''IA sans se faire avoir', 'IA générative, ML, automatisation. Hallucinations, limites, coûts cachés.', 'Fondations', false, 10),
  (2, 'Stratégie IA orientée business', 'Les 5 portes d''entrée. Matrice Impact/Faisabilité. Build vs Buy vs No-Go.', 'Stratégie', false, 20),
  (3, 'Process First', 'Cartographier, détecter les frictions, évaluer l''IA-readiness.', 'Méthode signature', false, 30),
  (4, 'Construire & Intégrer', 'Workflows, automatisation, IA appliquée aux opérations. Sans coder.', 'Exécution', false, 40),
  (5, 'Systèmes agentiques', 'Agents vs workflows. Cadrer un projet agentique sérieusement.', 'Niveau supérieur', false, 50),
  (6, 'Faire embarquer les équipes', 'ADKAR, résistances, stratégie d''adoption, coexistence humain/IA.', 'Humain', false, 60),
  (7, 'Industrialisation & Conformité', 'Prototype → production. Sécurité. AI Act et RGPD.', 'Sécurité & droit', false, 70),
  (8, 'ROI & Pilotage', 'Calcul du ROI. Business case. KPI et tableaux de bord.', 'Business', false, 80),
  (9, 'Projet réel — fil rouge', 'Votre projet, votre processus, vos données. Démo finale devant jury.', 'Le cœur du programme', true, 90)
on conflict (module_number) do nothing;

-- Paramètres globaux par défaut
insert into public.site_settings (key, value) values
  ('hero_counters', '[
    {"value": "20+", "label": "Ans d''expérience"},
    {"value": "5", "label": "Cas déployés"},
    {"value": "3", "label": "Capitales"},
    {"value": "100%", "label": "RGPD compliant"}
  ]'::jsonb),
  ('contact', '{
    "email": "contact@qwestinum.com",
    "phone": "+33 6 36 49 58 98",
    "locations": ["Casablanca", "Paris", "Vienne"]
  }'::jsonb)
on conflict (key) do nothing;

-- ============================================================
-- FIN DU SCHÉMA
-- ============================================================
-- IMPORTANT : pour devenir admin, après avoir créé ton compte
-- via /admin/login (magic link), exécute :
--
-- insert into public.admin_users (user_id, email, role)
-- values (
--   (select id from auth.users where email = 'TON-EMAIL@example.com'),
--   'TON-EMAIL@example.com',
--   'admin'
-- );
-- ============================================================
