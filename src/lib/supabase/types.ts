/**
 * Types TypeScript de la base de données Supabase.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ----------------------------------------------------------------
// Modèles métier
// ----------------------------------------------------------------

export type ArticleCategory = 'strategie' | 'methode' | 'retours-experience' | 'lucidite-ia';
export type ContentStatus = 'draft' | 'published' | 'archived';

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: Json | null;
  content_html: string | null;
  category: ArticleCategory;
  cover_image_url: string | null;
  reading_time_minutes: number | null;
  status: ContentStatus;
  is_featured: boolean;
  author_name: string | null;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Formation {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  level: string | null;
  level_label: string | null;
  duration_days: number | null;
  duration_label: string | null;
  audience: string | null;
  description: string | null;
  programme: Json | null;
  formats: string[] | null;
  price_label: string | null;
  is_flagship: boolean;
  display_order: number;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

export interface FlagshipModule {
  id: string;
  module_number: number;
  title: string;
  description: string | null;
  tag: string | null;
  is_highlight: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface UseCaseKpi {
  value: string;
  label: string;
  projected?: boolean;
}

export interface UseCase {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  case_type: 'client' | 'product';
  sector: string | null;
  status_label: string | null;
  problem: string | null;
  solution_items: Json | null;
  kpis: Json | null;
  accent_color: 'or' | 'sepia' | 'pierre' | 'or-pale';
  display_order: number;
  is_featured: boolean;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

export interface Partner {
  id: string;
  name: string;
  logo_svg: string | null;
  logo_url: string | null;
  website_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  role: 'admin' | 'editor';
  created_at: string;
}

export interface SiteSetting {
  key: string;
  value: Json;
  updated_at: string;
}

export type LeadSubject = 'general' | 'diagnostic' | 'formation' | 'partnership' | 'press' | 'other';
export type LeadStatus = 'new' | 'in-progress' | 'archived' | 'spam';

export interface Lead {
  id: string;
  full_name: string;
  email: string;
  company: string | null;
  phone: string | null;
  subject: LeadSubject;
  message: string;
  source: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  status: LeadStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ----------------------------------------------------------------
// Database type — utilisé par createClient<Database>()
// ----------------------------------------------------------------

export interface Database {
  public: {
    Tables: {
      articles: {
        Row: Article;
        Insert: Partial<Omit<Article, 'id' | 'created_at' | 'updated_at'>> & { title: string; slug: string };
        Update: Partial<Article>;
      };
      formations: {
        Row: Formation;
        Insert: Partial<Omit<Formation, 'id' | 'created_at' | 'updated_at'>> & { title: string; slug: string };
        Update: Partial<Formation>;
      };
      flagship_modules: {
        Row: FlagshipModule;
        Insert: Partial<Omit<FlagshipModule, 'id' | 'created_at' | 'updated_at'>> & { title: string; module_number: number };
        Update: Partial<FlagshipModule>;
      };
      use_cases: {
        Row: UseCase;
        Insert: Partial<Omit<UseCase, 'id' | 'created_at' | 'updated_at'>> & { title: string; slug: string };
        Update: Partial<UseCase>;
      };
      partners: {
        Row: Partner;
        Insert: Partial<Omit<Partner, 'id' | 'created_at' | 'updated_at'>> & { name: string };
        Update: Partial<Partner>;
      };
      admin_users: {
        Row: AdminUser;
        Insert: Partial<Omit<AdminUser, 'id' | 'created_at'>> & { user_id: string; email: string };
        Update: Partial<AdminUser>;
      };
      site_settings: {
        Row: SiteSetting;
        Insert: SiteSetting;
        Update: Partial<SiteSetting>;
      };
      leads: {
        Row: Lead;
        Insert: Partial<Omit<Lead, 'id' | 'created_at' | 'updated_at'>> & {
          full_name: string;
          email: string;
          message: string;
        };
        Update: Partial<Lead>;
      };
    };
  };
}