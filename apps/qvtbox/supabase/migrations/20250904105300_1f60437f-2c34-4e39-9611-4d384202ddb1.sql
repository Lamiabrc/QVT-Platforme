-- CMS Admin Tables for QVT Box

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
  items jsonb DEFAULT '[]'::jsonb, -- [{product_id, qty}]
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
  docs text[], -- array of document URLs
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
  nom text NOT NULL UNIQUE, -- 'header', 'footer'
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

-- Create functions to check CMS permissions
CREATE OR REPLACE FUNCTION public.has_cms_role(check_role user_role_cms_enum)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.cms_user_roles
    WHERE user_id = auth.uid() AND role = check_role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_cms_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.cms_user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  ) OR EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid() AND email = 'lamia.brechet@outlook.fr'
  )
$$;

-- RLS Policies for CMS tables

-- Box policies
CREATE POLICY "Public can view published box" ON public.box
FOR SELECT USING (statut = 'published');

CREATE POLICY "CMS users can manage box" ON public.box
FOR ALL USING (public.is_cms_admin() OR public.has_cms_role('editor') OR public.has_cms_role('catalog_manager'))
WITH CHECK (public.is_cms_admin() OR public.has_cms_role('editor') OR public.has_cms_role('catalog_manager'));

-- Pages policies
CREATE POLICY "Public can view published pages" ON public.cms_pages
FOR SELECT USING (statut = 'published');

CREATE POLICY "CMS users can manage pages" ON public.cms_pages
FOR ALL USING (public.is_cms_admin() OR public.has_cms_role('editor'))
WITH CHECK (public.is_cms_admin() OR public.has_cms_role('editor'));

-- Sections policies
CREATE POLICY "Public can view sections of published pages" ON public.page_sections
FOR SELECT USING (EXISTS (
  SELECT 1 FROM public.cms_pages 
  WHERE id = page_sections.page_id AND statut = 'published'
));

CREATE POLICY "CMS users can manage sections" ON public.page_sections
FOR ALL USING (public.is_cms_admin() OR public.has_cms_role('editor'))
WITH CHECK (public.is_cms_admin() OR public.has_cms_role('editor'));

-- Partners policies
CREATE POLICY "CMS users can view partners" ON public.cms_partners
FOR SELECT USING (public.is_cms_admin() OR public.has_cms_role('partners_manager'));

CREATE POLICY "CMS users can manage partners" ON public.cms_partners
FOR ALL USING (public.is_cms_admin() OR public.has_cms_role('partners_manager'))
WITH CHECK (public.is_cms_admin() OR public.has_cms_role('partners_manager'));

-- Media library policies
CREATE POLICY "CMS users can view media" ON public.media_library
FOR SELECT USING (public.is_cms_admin() OR public.has_cms_role('editor') OR public.has_cms_role('catalog_manager'));

CREATE POLICY "CMS users can manage media" ON public.media_library
FOR ALL USING (public.is_cms_admin() OR public.has_cms_role('editor') OR public.has_cms_role('catalog_manager'))
WITH CHECK (public.is_cms_admin() OR public.has_cms_role('editor') OR public.has_cms_role('catalog_manager'));

-- Menus policies
CREATE POLICY "Public can view menus" ON public.cms_menus
FOR SELECT USING (true);

CREATE POLICY "CMS admins can manage menus" ON public.cms_menus
FOR ALL USING (public.is_cms_admin())
WITH CHECK (public.is_cms_admin());

-- Menu items policies
CREATE POLICY "Public can view visible menu items" ON public.cms_menu_items
FOR SELECT USING (visible = true);

CREATE POLICY "CMS admins can manage menu items" ON public.cms_menu_items
FOR ALL USING (public.is_cms_admin())
WITH CHECK (public.is_cms_admin());

-- Settings policies
CREATE POLICY "Public can view some settings" ON public.cms_settings
FOR SELECT USING (key LIKE 'public.%');

CREATE POLICY "CMS admins can manage settings" ON public.cms_settings
FOR ALL USING (public.is_cms_admin())
WITH CHECK (public.is_cms_admin());

-- User roles policies
CREATE POLICY "CMS admins can manage user roles" ON public.cms_user_roles
FOR ALL USING (public.is_cms_admin())
WITH CHECK (public.is_cms_admin());

-- Activity log policies
CREATE POLICY "CMS users can insert activity logs" ON public.cms_activity_log
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "CMS admins can view activity logs" ON public.cms_activity_log
FOR SELECT USING (public.is_cms_admin());

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_box_updated_at
  BEFORE UPDATE ON public.box
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_cms_pages_updated_at
  BEFORE UPDATE ON public.cms_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_page_sections_updated_at
  BEFORE UPDATE ON public.page_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_cms_partners_updated_at
  BEFORE UPDATE ON public.cms_partners
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_cms_settings_updated_at
  BEFORE UPDATE ON public.cms_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Insert default menus
INSERT INTO public.cms_menus (nom) VALUES ('header'), ('footer')
ON CONFLICT (nom) DO NOTHING;

-- Insert default settings
INSERT INTO public.cms_settings (key, value, description) VALUES
('seo.default_title', '"QVT Box - Solutions bien-être en entreprise"', 'Titre SEO par défaut'),
('seo.default_description', '"Découvrez nos box QVT pour améliorer le bien-être au travail. Solutions Made in France et OCDE."', 'Description SEO par défaut'),
('branding.logo_url', '"/qvt-box-logo.png"', 'URL du logo principal'),
('legal.cgv_url', '"/cgv"', 'URL des CGV'),
('legal.privacy_url', '"/politique-confidentialite"', 'URL de la politique de confidentialité'),
('content.ocde_message', '"Nous privilégions le Made in France et les producteurs locaux. Nous sélectionnons aussi des produits issus des pays de l\'OCDE, respectant qualité, normes sociales et environnementales, et traçabilité."', 'Message OCDE personnalisable'),
('shipping.free_threshold_cents', '5000', 'Seuil de livraison gratuite en centimes'),
('ctas.evaluate.href', '"/simulateur"', 'Lien CTA Évaluer mes besoins'),
('ctas.demo.href', '"/contact"', 'Lien CTA Demander une démo'),
('ctas.partner.href', '"/partenaires"', 'Lien CTA Devenir partenaire')
ON CONFLICT (key) DO NOTHING;

-- Grant admin role to lamia.brechet@outlook.fr
DO $$
DECLARE
  user_uuid uuid;
BEGIN
  SELECT id INTO user_uuid FROM auth.users WHERE email = 'lamia.brechet@outlook.fr';
  IF user_uuid IS NOT NULL THEN
    INSERT INTO public.cms_user_roles (user_id, role) VALUES (user_uuid, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;