-- Migration corrigée pour un système complet et sécurisé

-- 1. Corriger/créer table profiles pour les utilisateurs 
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Fonction sécurisée pour créer automatiquement un profil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  
  -- Attribuer le rôle admin à votre adresse email spécifique
  IF NEW.email = 'lamia.brechet@outlook.fr' THEN
    INSERT INTO public.cms_user_roles (user_id, role, granted_by)
    VALUES (NEW.id, 'admin', NEW.id)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Créer le trigger pour les nouveaux utilisateurs
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Créer fonction sécurisée pour vérifier les permissions admin
CREATE OR REPLACE FUNCTION public.get_user_email_from_profiles()
RETURNS TEXT AS $$
  SELECT email FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- 4. Corriger les permissions pour les produits avec fonction sécurisée
DROP POLICY IF EXISTS "CMS users can manage products" ON public.products;
CREATE POLICY "CMS users can manage products" ON public.products 
FOR ALL USING (
  is_cms_admin() OR 
  has_cms_role('editor'::user_role_cms_enum) OR 
  has_cms_role('catalog_manager'::user_role_cms_enum) OR
  public.get_user_email_from_profiles() = 'lamia.brechet@outlook.fr'
);

-- 5. Créer table pour les commandes de paiement
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  email TEXT,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'eur',
  status TEXT DEFAULT 'pending',
  items JSONB DEFAULT '[]'::jsonb,
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policies pour orders
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "System can update orders" ON public.orders;

CREATE POLICY "Users can view their own orders" ON public.orders 
FOR SELECT USING (
  user_id = auth.uid() OR 
  (auth.uid() IS NOT NULL AND email = public.get_user_email_from_profiles())
);

CREATE POLICY "Anyone can create orders" ON public.orders 
FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update orders" ON public.orders 
FOR UPDATE USING (true);

-- 6. Créer table pour les messages de contact
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  entreprise TEXT,
  message TEXT NOT NULL,
  source_page TEXT DEFAULT '/contact',
  status TEXT DEFAULT 'nouveau',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Policies pour contact_messages
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can view contact messages" ON public.contact_messages;

CREATE POLICY "Anyone can submit contact messages" ON public.contact_messages 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view contact messages" ON public.contact_messages 
FOR SELECT USING (is_cms_admin() OR public.get_user_email_from_profiles() = 'lamia.brechet@outlook.fr');

-- 7. Créer table pour les dashboards RH/bien-être
CREATE TABLE IF NOT EXISTS public.employee_wellness_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
  satisfaction_level INTEGER CHECK (satisfaction_level BETWEEN 1 AND 10),
  engagement_level INTEGER CHECK (engagement_level BETWEEN 1 AND 10),
  wellbeing_score DECIMAL(3,1),
  department TEXT,
  team TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.employee_wellness_scores ENABLE ROW LEVEL SECURITY;

-- Policies pour wellness scores
DROP POLICY IF EXISTS "Users can view their own scores" ON public.employee_wellness_scores;
DROP POLICY IF EXISTS "HR can view all scores" ON public.employee_wellness_scores;

CREATE POLICY "Users can view their own scores" ON public.employee_wellness_scores 
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own scores" ON public.employee_wellness_scores 
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "HR can view all scores" ON public.employee_wellness_scores 
FOR SELECT USING (
  is_cms_admin() OR 
  public.get_user_email_from_profiles() = 'lamia.brechet@outlook.fr'
);

-- 8. Fonction pour calculer le score de bien-être
CREATE OR REPLACE FUNCTION public.calculate_wellbeing_score(
  p_stress INTEGER,
  p_satisfaction INTEGER, 
  p_engagement INTEGER
) RETURNS DECIMAL(3,1) AS $$
BEGIN
  RETURN ROUND(
    ((10 - p_stress) * 0.3 + p_satisfaction * 0.4 + p_engagement * 0.3), 1
  );
END;
$$ LANGUAGE plpgsql SET search_path = public;