-- Add RLS policies and functions for CMS system

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

-- RLS Policies for new CMS tables

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
FOR SELECT USING (key LIKE 'public.%' OR key LIKE 'content.%' OR key LIKE 'ctas.%');

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
('content.ocde_message', '"Nous privilégions le Made in France et les producteurs locaux. Nous sélectionnons aussi des produits issus des pays de l\'\'OCDE, respectant qualité, normes sociales et environnementales, et traçabilité."', 'Message OCDE personnalisable'),
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