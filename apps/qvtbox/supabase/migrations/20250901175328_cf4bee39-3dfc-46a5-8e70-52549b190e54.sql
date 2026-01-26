-- Créer seulement les nouvelles tables qui n'existent pas encore
CREATE TABLE IF NOT EXISTS public.categories (
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

CREATE TABLE IF NOT EXISTS public.products (
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

CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS seulement si pas déjà activé
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'categories') THEN
    ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products') THEN
    ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'product_images') THEN
    ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Policies pour categories
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'categories' AND policyname = 'Anyone can view active categories') THEN
    CREATE POLICY "Anyone can view active categories" ON public.categories 
      FOR SELECT USING (is_active = true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'categories' AND policyname = 'Admins can manage categories') THEN
    CREATE POLICY "Admins can manage categories" ON public.categories 
      FOR ALL USING (is_admin(auth.uid()));
  END IF;
END $$;

-- Policies pour products
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Anyone can view active products') THEN
    CREATE POLICY "Anyone can view active products" ON public.products 
      FOR SELECT USING (is_active = true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Admins can manage products') THEN
    CREATE POLICY "Admins can manage products" ON public.products 
      FOR ALL USING (is_admin(auth.uid()));
  END IF;
END $$;

-- Policies pour product_images
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'product_images' AND policyname = 'Anyone can view product images') THEN
    CREATE POLICY "Anyone can view product images" ON public.product_images 
      FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'product_images' AND policyname = 'Admins can manage product images') THEN
    CREATE POLICY "Admins can manage product images" ON public.product_images 
      FOR ALL USING (is_admin(auth.uid()));
  END IF;
END $$;

-- Créer le bucket seulement s'il n'existe pas
INSERT INTO storage.buckets (id, name, public) 
SELECT 'product-images', 'product-images', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'product-images');

-- Insérer des catégories par défaut seulement si elles n'existent pas
INSERT INTO public.categories (name, slug, description) 
SELECT 'Bien-être', 'bien-etre', 'Produits pour le bien-être et la détente'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'bien-etre');

INSERT INTO public.categories (name, slug, description) 
SELECT 'Artisanat', 'artisanat', 'Créations artisanales françaises'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'artisanat');

INSERT INTO public.categories (name, slug, description) 
SELECT 'Gastronomie', 'gastronomie', 'Spécialités culinaires régionales'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'gastronomie');

INSERT INTO public.categories (name, slug, description) 
SELECT 'Box Mensuelle', 'box-mensuelle', 'Abonnements aux box mensuelles'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'box-mensuelle');