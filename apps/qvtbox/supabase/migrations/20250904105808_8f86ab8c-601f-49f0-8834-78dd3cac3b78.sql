-- CMS Admin Tables for QVT Box - Fixed syntax error

-- 1. Enums for the CMS system
CREATE TYPE public.origin_enum AS ENUM ('FR', 'UE', 'OCDE');
CREATE TYPE public.pillar_enum AS ENUM ('SANTE', 'ORGA', 'COHESION', 'DEV');
CREATE TYPE public.section_type_enum AS ENUM ('hero', 'piliers', 'grid_box', 'grid_produits', 'partenaires', 'transparence_ocde', 'richtext', 'cta_band', 'faq', 'contact_form');
CREATE TYPE public.content_status_enum AS ENUM ('draft', 'published');
CREATE TYPE public.partner_status_enum AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.partner_type_enum AS ENUM ('premium_fr_local', 'standard_ocde');
CREATE TYPE public.category_product_enum AS ENUM ('physique', 'virtuel', 'evenementiel');
CREATE TYPE public.user_role_cms_enum AS ENUM ('admin', 'editor', 'catalog_manager', 'partners_manager', 'reader');

-- 2. Update existing products table with CMS fields
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS prix_cents integer,
ADD COLUMN IF NOT EXISTS devise text DEFAULT 'EUR',
ADD COLUMN IF NOT EXISTS origine origin_enum,
ADD COLUMN IF NOT EXISTS images text[],
ADD COLUMN IF NOT EXISTS tags text[],
ADD COLUMN IF NOT EXISTS sku text,
ADD COLUMN IF NOT EXISTS stock integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS statut content_status_enum DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS seo_title text,
ADD COLUMN IF NOT EXISTS seo_description text,
ADD COLUMN IF NOT EXISTS published_at timestamp with time zone;

-- 3. Update categories table  
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.categories(id),
ADD COLUMN IF NOT EXISTS ordre integer DEFAULT 0;

-- 4. Box (bundles) table
CREATE TABLE public.box (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  prix_cents integer NOT NULL,
  devise text DEFAULT 'EUR',
  piliers pillar_enum[] NOT NULL,
  origine origin_enum NOT NULL,
  items jsonb DEFAULT '[]'::jsonb,
  image_couverture text,
  statut content_status_enum DEFAULT 'draft',
  seo_title text,
  seo_description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  published_at timestamp with time zone
);

-- 5. Pages table
CREATE TABLE public.cms_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titre text NOT NULL,
  slug text NOT NULL UNIQUE,
  seo_title text,
  seo_description text,
  statut content_status_enum DEFAULT 'draft',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  published_at timestamp with time zone
);

-- 6. Page sections (Page Builder)
CREATE TABLE public.page_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES public.cms_pages(id) ON DELETE CASCADE,
  type_section section_type_enum NOT NULL,
  data jsonb DEFAULT '{}'::jsonb,
  ordre integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 7. Partners table (updated from existing partners_applications)
CREATE TABLE public.cms_partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  societe text NOT NULL,
  contact_nom text NOT NULL,
  contact_email text NOT NULL,
  contact_tel text,
  site_web text,
  type_offre partner_type_enum NOT NULL,
  origine origin_enum NOT NULL,
  categories category_product_enum[],
  description_courte text,
  certifications text,
  moq text,
  prix_b2b text,
  delais text,
  logistique_echantillons text,
  status partner_status_enum DEFAULT 'pending',
  docs text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 8. Media library
CREATE TABLE public.media_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fichier_url text NOT NULL,
  alt text NOT NULL,
  width integer,
  height integer,
  type text NOT NULL,
  uploaded_by uuid,
  created_at timestamp with time zone DEFAULT now()
);

-- 9. Menus
CREATE TABLE public.cms_menus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now()
);

-- 10. Menu items
CREATE TABLE public.cms_menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id uuid REFERENCES public.cms_menus(id) ON DELETE CASCADE,
  label text NOT NULL,
  url text NOT NULL,
  ordre integer DEFAULT 0,
  visible boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- 11. Settings (key/value store)
CREATE TABLE public.cms_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 12. User roles for CMS (separate from existing user_roles)
CREATE TABLE public.cms_user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role user_role_cms_enum NOT NULL,
  granted_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, role)
);

-- 13. Activity log for CMS actions
CREATE TABLE public.cms_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text,
  details jsonb DEFAULT '{}'::jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.box ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_activity_log ENABLE ROW LEVEL SECURITY;