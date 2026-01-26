-- Créer les tables pour la boutique
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  sku TEXT UNIQUE,
  barcode TEXT,
  track_inventory BOOLEAN DEFAULT true,
  inventory_quantity INTEGER DEFAULT 0,
  allow_backorder BOOLEAN DEFAULT false,
  weight DECIMAL(8,2),
  requires_shipping BOOLEAN DEFAULT true,
  is_digital BOOLEAN DEFAULT false,
  category_id UUID REFERENCES public.categories(id),
  origin TEXT,
  artisan_info TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.product_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  billing_interval TEXT NOT NULL CHECK (billing_interval IN ('monthly', 'quarterly', 'yearly')),
  trial_period_days INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  features JSONB DEFAULT '[]'::jsonb,
  max_boxes_per_period INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- Policies pour categories (lecture publique, écriture admin)
CREATE POLICY "Anyone can view active categories" ON public.categories 
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON public.categories 
  FOR ALL USING (is_admin(auth.uid()));

-- Policies pour products (lecture publique, écriture admin)  
CREATE POLICY "Anyone can view active products" ON public.products 
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage products" ON public.products 
  FOR ALL USING (is_admin(auth.uid()));

-- Policies pour product_images (lecture publique, écriture admin)
CREATE POLICY "Anyone can view product images" ON public.product_images 
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage product images" ON public.product_images 
  FOR ALL USING (is_admin(auth.uid()));

-- Policies pour subscription_plans (lecture publique, écriture admin)
CREATE POLICY "Anyone can view active subscription plans" ON public.subscription_plans 
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage subscription plans" ON public.subscription_plans 
  FOR ALL USING (is_admin(auth.uid()));

-- Créer les buckets de stockage
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Policies pour le stockage des images produits
CREATE POLICY "Anyone can view product images" ON storage.objects 
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND is_admin(auth.uid()));

CREATE POLICY "Admins can update product images" ON storage.objects 
  FOR UPDATE USING (bucket_id = 'product-images' AND is_admin(auth.uid()));

CREATE POLICY "Admins can delete product images" ON storage.objects 
  FOR DELETE USING (bucket_id = 'product-images' AND is_admin(auth.uid()));

-- Triggers pour updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insérer des catégories par défaut
INSERT INTO public.categories (name, slug, description) VALUES 
  ('Bien-être', 'bien-etre', 'Produits pour le bien-être et la détente'),
  ('Artisanat', 'artisanat', 'Créations artisanales françaises'),
  ('Gastronomie', 'gastronomie', 'Spécialités culinaires régionales'),
  ('Box Mensuelle', 'box-mensuelle', 'Abonnements aux box mensuelles');

-- Insérer des plans d'abonnement par défaut
INSERT INTO public.subscription_plans (name, slug, description, price, billing_interval, features) VALUES 
  ('Box Mensuelle', 'box-mensuelle', 'Recevez chaque mois une sélection de produits bien-être', 29.90, 'monthly', 
   '["Produits artisanaux français", "Livraison gratuite", "Surprise chaque mois", "Annulation flexible"]'::jsonb),
  ('Box Trimestrielle', 'box-trimestrielle', 'Recevez tous les 3 mois une box premium', 79.90, 'quarterly',
   '["Box premium", "Produits exclusifs", "Livraison gratuite", "Support prioritaire"]'::jsonb),
  ('Box Annuelle', 'box-annuelle', 'Abonnement annuel avec réductions', 299.90, 'yearly',
   '["2 mois gratuits", "Box collector", "Cadeaux exclusifs", "Support VIP"]'::jsonb);