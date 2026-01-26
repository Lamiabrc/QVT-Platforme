-- Migration simplifiée et corrigée

-- 1. Créer table profiles sans trigger complexe
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles - simplifiées
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (id = auth.uid());

-- 2. Créer table pour les commandes
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  email TEXT,
  stripe_session_id TEXT UNIQUE,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'eur',
  status TEXT DEFAULT 'pending',
  items JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own orders" ON public.orders FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System can create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "System can update orders" ON public.orders FOR UPDATE USING (true);

-- 3. Table pour messages de contact
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  entreprise TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'nouveau',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view messages" ON public.contact_messages FOR SELECT USING (is_cms_admin());

-- 4. Table pour wellness scores
CREATE TABLE IF NOT EXISTS public.employee_wellness_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  period_start DATE NOT NULL DEFAULT CURRENT_DATE,
  period_end DATE NOT NULL DEFAULT CURRENT_DATE,
  stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
  satisfaction_level INTEGER CHECK (satisfaction_level BETWEEN 1 AND 10),
  engagement_level INTEGER CHECK (engagement_level BETWEEN 1 AND 10),
  wellbeing_score DECIMAL(3,1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.employee_wellness_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own wellness" ON public.employee_wellness_scores FOR ALL USING (user_id = auth.uid());

-- 5. Fonction de calcul bien-être
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
$$ LANGUAGE plpgsql;