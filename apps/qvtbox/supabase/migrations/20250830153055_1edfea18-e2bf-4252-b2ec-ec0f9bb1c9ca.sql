-- Tables pour le système QVT Box poétique (version finale)

-- Créer les types seulement s'ils n'existent pas
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

-- Table des micro-rituels
CREATE TABLE IF NOT EXISTS public.rituals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  bubble_type bubble_type NOT NULL,
  duration_minutes INTEGER DEFAULT 5,
  category TEXT DEFAULT 'well-being',
  instructions JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des équipes
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  manager_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour l'analyse IA des humeurs
CREATE TABLE IF NOT EXISTS public.mood_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_date DATE NOT NULL DEFAULT CURRENT_DATE,
  trend_analysis JSONB,
  personalized_message TEXT,
  recommendations JSONB,
  ai_confidence REAL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Mettre à jour la table profiles avec les nouveaux champs
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS user_role user_role DEFAULT 'salarié',
ADD COLUMN IF NOT EXISTS user_journey user_journey DEFAULT 'physique_only',
ADD COLUMN IF NOT EXISTS team_id UUID,
ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_mood_entry DATE;

-- Activer RLS sur toutes les nouvelles tables
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_bubbles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rituals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_analytics ENABLE ROW LEVEL SECURITY;

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

-- Politiques pour les rituels (lecture publique)
CREATE POLICY "Everyone can read rituals" ON public.rituals
  FOR SELECT USING (is_active = true);

-- Politiques pour mood_analytics
CREATE POLICY "Users can view their own analytics" ON public.mood_analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create analytics" ON public.mood_analytics
  FOR INSERT WITH CHECK (true);

-- Insérer quelques rituels par défaut
INSERT INTO public.rituals (title, description, bubble_type, duration_minutes, instructions) 
VALUES 
  ('Respiration consciente', 'Prenez 3 minutes pour respirer profondément et vous recentrer', 'soin', 3, '{"steps": ["Asseyez-vous confortablement", "Fermez les yeux", "Respirez profondément 10 fois", "Focalisez-vous sur votre respiration"]}'),
  ('Pause gratitude', 'Notez mentalement 3 choses pour lesquelles vous êtes reconnaissant', 'inspiration', 2, '{"steps": ["Pensez à votre journée", "Identifiez 3 moments positifs", "Ressentez la gratitude", "Souriez intérieurement"]}'),
  ('Micro-étirement', 'Quelques étirements doux pour détendre votre corps', 'soin', 5, '{"steps": ["Étirez vos bras vers le ciel", "Roulez vos épaules", "Penchez la tête doucement", "Respirez pendant chaque mouvement"]}'),
  ('Check-in équipe', 'Prenez des nouvelles sincères d''un collègue', 'connexion', 4, '{"steps": ["Choisissez un collègue", "Demandez comment ça va vraiment", "Écoutez activement", "Partagez votre propre ressenti"]}')
ON CONFLICT (title) DO NOTHING;

-- Fonction pour créer des bulles quotidiennes basées sur l'humeur
CREATE OR REPLACE FUNCTION generate_daily_bubbles()
RETURNS TRIGGER AS $$
DECLARE
  focus_intensity INTEGER;
  cohesion_intensity INTEGER;
  recuperation_intensity INTEGER;
  gratitude_intensity INTEGER;
BEGIN
  -- Calculer l'intensité des bulles basée sur les réponses
  focus_intensity := GREATEST(1, LEAST(5, NEW.motivation + NEW.work_satisfaction - NEW.stress_level));
  cohesion_intensity := GREATEST(1, LEAST(5, NEW.social_connection + NEW.energy_level));
  recuperation_intensity := GREATEST(1, LEAST(5, 6 - NEW.stress_level + NEW.energy_level));
  gratitude_intensity := GREATEST(1, LEAST(5, NEW.work_satisfaction + NEW.social_connection));

  -- Supprimer les bulles existantes du jour
  DELETE FROM daily_bubbles WHERE user_id = NEW.user_id AND date = NEW.date;

  -- Créer les nouvelles bulles avec les types existants
  INSERT INTO daily_bubbles (user_id, date, bubble_type, intensity, message, ritual_suggestion) VALUES
    (NEW.user_id, NEW.date, 'transformation', focus_intensity, 
     CASE WHEN focus_intensity >= 4 THEN 'Votre concentration brille aujourd''hui ✨'
          WHEN focus_intensity >= 3 THEN 'Un petit coup de focus vous ferait du bien 🎯'
          ELSE 'Accordez-vous une pause, votre esprit a besoin de douceur 🌸' END,
     'Essayez la respiration consciente'),
     
    (NEW.user_id, NEW.date, 'connexion', cohesion_intensity,
     CASE WHEN cohesion_intensity >= 4 THEN 'Vos liens sociaux sont précieux aujourd''hui 💫'
          WHEN cohesion_intensity >= 3 THEN 'Un petit geste vers les autres pourrait illuminer votre journée 🤝'
          ELSE 'Prenez soin de vos relations, elles sont votre force 💙' END,
     'Tentez un check-in équipe'),
     
    (NEW.user_id, NEW.date, 'soin', recuperation_intensity,
     CASE WHEN recuperation_intensity >= 4 THEN 'Votre énergie est rayonnante 🌟'
          WHEN recuperation_intensity >= 3 THEN 'Un petit moment de récup vous ressourcerait 🌿'
          ELSE 'Votre corps et votre esprit appellent à la douceur 🕯️' END,
     'Offrez-vous des micro-étirements'),
     
    (NEW.user_id, NEW.date, 'inspiration', gratitude_intensity,
     CASE WHEN gratitude_intensity >= 4 THEN 'Votre cœur déborde de reconnaissance 🙏'
          WHEN gratitude_intensity >= 3 THEN 'Quelques instants de gratitude coloreraient votre journée 🌈'
          ELSE 'Cherchez la beauté dans les petites choses 🦋' END,
     'Prenez une pause gratitude');

  -- Mettre à jour la date de dernière entrée d'humeur
  UPDATE profiles SET last_mood_entry = NEW.date WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger seulement s'il n'existe pas
DROP TRIGGER IF EXISTS generate_bubbles_on_mood_entry ON mood_entries;
CREATE TRIGGER generate_bubbles_on_mood_entry
  AFTER INSERT OR UPDATE ON mood_entries
  FOR EACH ROW EXECUTE FUNCTION generate_daily_bubbles();