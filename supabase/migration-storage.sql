-- ============================================================
-- QWESTINUM — Migration : Supabase Storage pour les articles
-- ============================================================
-- À exécuter dans Supabase > SQL Editor > New query > Run
--
-- Cette migration :
-- 1. Crée le bucket "articles-images" (public en lecture)
-- 2. Configure les politiques RLS :
--    - Lecture publique (n'importe qui peut afficher les images)
--    - Upload réservé aux admins (via is_admin())
--    - Suppression réservée aux admins
-- ============================================================

-- 1. Création du bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'articles-images',
  'articles-images',
  true,
  5242880,  -- 5 MB max par fichier
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- 2. Politiques RLS sur le bucket
-- (les anciennes politiques sont supprimées si elles existent)

drop policy if exists "Articles images public read" on storage.objects;
drop policy if exists "Articles images admin upload" on storage.objects;
drop policy if exists "Articles images admin update" on storage.objects;
drop policy if exists "Articles images admin delete" on storage.objects;

-- Lecture publique : n'importe qui peut SELECT depuis ce bucket
create policy "Articles images public read"
  on storage.objects for select
  using (bucket_id = 'articles-images');

-- Upload réservé aux admins
create policy "Articles images admin upload"
  on storage.objects for insert
  with check (
    bucket_id = 'articles-images'
    and public.is_admin()
  );

-- Update réservé aux admins
create policy "Articles images admin update"
  on storage.objects for update
  using (
    bucket_id = 'articles-images'
    and public.is_admin()
  );

-- Delete réservé aux admins
create policy "Articles images admin delete"
  on storage.objects for delete
  using (
    bucket_id = 'articles-images'
    and public.is_admin()
  );

-- ============================================================
-- VÉRIFICATION (optionnel — exécuter dans une nouvelle query)
-- ============================================================
-- select * from storage.buckets where id = 'articles-images';
-- → doit retourner 1 ligne avec public = true

-- select policyname from pg_policies
-- where schemaname = 'storage' and tablename = 'objects'
-- and policyname like 'Articles images%';
-- → doit retourner 4 politiques
