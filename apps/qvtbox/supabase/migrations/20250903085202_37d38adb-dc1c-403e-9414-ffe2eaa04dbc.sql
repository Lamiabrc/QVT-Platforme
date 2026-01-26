-- Phase 2: Gestion avancée des produits

-- Table pour les variantes de produits (taille, couleur, etc.)
CREATE TABLE public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- Ex: "Taille S", "Couleur Rouge"
  value TEXT NOT NULL, -- Ex: "S", "Rouge"
  variant_type TEXT NOT NULL, -- Ex: "size", "color"
  price_modifier NUMERIC DEFAULT 0, -- Ajustement de prix (+/- par rapport au prix de base)
  sku TEXT, -- Code unique pour cette variante
  inventory_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour optimiser les requêtes
CREATE INDEX idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX idx_product_variants_type ON public.product_variants(variant_type);

-- Table pour les avis clients
CREATE TABLE public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour optimiser les requêtes d'avis
CREATE INDEX idx_product_reviews_product_id ON public.product_reviews(product_id);
CREATE INDEX idx_product_reviews_user_id ON public.product_reviews(user_id);
CREATE INDEX idx_product_reviews_rating ON public.product_reviews(rating);

-- Table pour les mots-clés et tags de produits (SEO)
CREATE TABLE public.product_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  tag_type TEXT DEFAULT 'keyword', -- 'keyword', 'feature', 'benefit'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour la recherche full-text
CREATE INDEX idx_product_tags_product_id ON public.product_tags(product_id);
CREATE INDEX idx_product_tags_search ON public.product_tags USING gin(to_tsvector('french', tag));

-- Table pour les produits recommandés / cross-sell
CREATE TABLE public.product_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  recommended_product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  recommendation_type TEXT DEFAULT 'cross_sell', -- 'cross_sell', 'up_sell', 'related'
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour les recommandations
CREATE INDEX idx_product_recommendations_product_id ON public.product_recommendations(product_id);

-- Améliorer la table products existante avec des champs SEO
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS seo_keywords TEXT[];
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS search_vector TSVECTOR;

-- Créer un slug unique basé sur le nom du produit
UPDATE public.products 
SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'))
WHERE slug IS NULL;

-- Index pour le slug et la recherche
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug) WHERE slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_search ON public.products USING gin(search_vector);

-- Fonction pour mettre à jour le vecteur de recherche
CREATE OR REPLACE FUNCTION update_product_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('french', 
    COALESCE(NEW.name, '') || ' ' ||
    COALESCE(NEW.short_description, '') || ' ' ||
    COALESCE(NEW.description, '') || ' ' ||
    COALESCE(NEW.origin, '') || ' ' ||
    COALESCE(array_to_string(NEW.seo_keywords, ' '), '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour maintenir le vecteur de recherche à jour
DROP TRIGGER IF EXISTS trigger_update_product_search_vector ON public.products;
CREATE TRIGGER trigger_update_product_search_vector
  BEFORE INSERT OR UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_product_search_vector();

-- Mettre à jour les vecteurs de recherche existants
UPDATE public.products SET updated_at = updated_at;

-- Fonction pour calculer la note moyenne d'un produit
CREATE OR REPLACE FUNCTION calculate_product_rating(product_uuid UUID)
RETURNS NUMERIC AS $$
DECLARE
  avg_rating NUMERIC;
BEGIN
  SELECT ROUND(AVG(rating)::NUMERIC, 1) INTO avg_rating
  FROM public.product_reviews 
  WHERE product_id = product_uuid AND is_approved = true;
  
  RETURN COALESCE(avg_rating, 0);
END;
$$ LANGUAGE plpgsql;

-- Ajouter des colonnes pour les statistiques de reviews
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS average_rating NUMERIC DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- Fonction pour mettre à jour les stats de reviews
CREATE OR REPLACE FUNCTION update_product_review_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Mettre à jour la note moyenne et le nombre d'avis
  UPDATE public.products 
  SET 
    average_rating = calculate_product_rating(
      CASE 
        WHEN TG_OP = 'DELETE' THEN OLD.product_id 
        ELSE NEW.product_id 
      END
    ),
    review_count = (
      SELECT COUNT(*) 
      FROM public.product_reviews 
      WHERE product_id = (
        CASE 
          WHEN TG_OP = 'DELETE' THEN OLD.product_id 
          ELSE NEW.product_id 
        END
      ) 
      AND is_approved = true
    ),
    updated_at = now()
  WHERE id = (
    CASE 
      WHEN TG_OP = 'DELETE' THEN OLD.product_id 
      ELSE NEW.product_id 
    END
  );
  
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour maintenir les stats de reviews à jour
DROP TRIGGER IF EXISTS trigger_update_product_review_stats ON public.product_reviews;
CREATE TRIGGER trigger_update_product_review_stats
  AFTER INSERT OR UPDATE OR DELETE ON public.product_reviews
  FOR EACH ROW EXECUTE FUNCTION update_product_review_stats();

-- RLS Policies pour les nouvelles tables

-- Product variants - accessible à tous en lecture, modification par admins
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active product variants" ON public.product_variants
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage product variants" ON public.product_variants
  FOR ALL USING (is_user_admin(auth.uid()));

-- Product reviews - lectures publiques, écriture par utilisateurs connectés
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved reviews" ON public.product_reviews
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can create their own reviews" ON public.product_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON public.product_reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reviews" ON public.product_reviews
  FOR ALL USING (is_user_admin(auth.uid()));

-- Product tags - lecture publique, gestion par admins
ALTER TABLE public.product_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product tags" ON public.product_tags
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage product tags" ON public.product_tags
  FOR ALL USING (is_user_admin(auth.uid()));

-- Product recommendations - lecture publique, gestion par admins
ALTER TABLE public.product_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product recommendations" ON public.product_recommendations
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage product recommendations" ON public.product_recommendations
  FOR ALL USING (is_user_admin(auth.uid()));