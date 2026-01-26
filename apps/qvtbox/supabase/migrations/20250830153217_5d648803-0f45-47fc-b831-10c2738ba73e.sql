-- Tables pour le système QVT Box (version simplifiée)

-- Créer les nouveaux types seulement s'ils n'existent pas
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('salarié', 'manager', 'rh', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_journey AS ENUM ('physique_only', 'saas_box');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Table des entrées d'humeur quotidiennes
CREATE TABLE IF NOT EXISTS public.mood_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 5),
  stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 5),
  motivation INTEGER CHECK (motivation BETWEEN 1 AND 5),
  social_connection INTEGER CHECK (social_connection BETWEEN 1 AND 5),
  work_satisfaction INTEGER CHECK (work_satisfaction BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Table des bulles générées du jour
CREATE TABLE IF NOT EXISTS public.daily_bubbles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  bubble_type bubble_type NOT NULL,
  intensity INTEGER CHECK (intensity BETWEEN 1 AND 5),
  message TEXT NOT NULL,
  ritual_suggestion TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Mettre à jour la table profiles avec les nouveaux champs
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS user_role user_role DEFAULT 'salarié',
ADD COLUMN IF NOT EXISTS user_journey user_journey DEFAULT 'physique_only',
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_mood_entry DATE;

-- Activer RLS sur les nouvelles tables
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_bubbles ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour mood_entries
CREATE POLICY "Users can view their own mood entries" ON public.mood_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mood entries" ON public.mood_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mood entries" ON public.mood_entries
  FOR UPDATE USING (auth.uid() = user_id);

-- Politiques RLS pour daily_bubbles
CREATE POLICY "Users can view their own bubbles" ON public.daily_bubbles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create bubbles" ON public.daily_bubbles
  FOR INSERT WITH CHECK (true);