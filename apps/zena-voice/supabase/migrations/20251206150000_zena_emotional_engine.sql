-- ZENA emotional engine schema support
DO $$
BEGIN
  -- Ensure profiles table exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'profiles'
  ) THEN
    CREATE TABLE public.profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      email TEXT,
      full_name TEXT,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );

    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Users can view their profile"
      ON public.profiles
      FOR SELECT
      USING (id = auth.uid());

    CREATE POLICY "Users can update their profile"
      ON public.profiles
      FOR UPDATE
      USING (id = auth.uid());

    CREATE POLICY "Users can insert their profile"
      ON public.profiles
      FOR INSERT
      WITH CHECK (id = auth.uid());

    CREATE TRIGGER update_profiles_updated_at
      BEFORE UPDATE ON public.profiles
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  -- Add requested profile columns only when missing
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'profiles'
  ) THEN
    ALTER TABLE public.profiles
      ADD COLUMN IF NOT EXISTS role_principal TEXT,
      ADD COLUMN IF NOT EXISTS contexte TEXT,
      ADD COLUMN IF NOT EXISTS age INTEGER,
      ADD COLUMN IF NOT EXISTS genre TEXT,
      ADD COLUMN IF NOT EXISTS relation_familiale TEXT,
      ADD COLUMN IF NOT EXISTS organisation_id UUID REFERENCES public.companies(id);
  END IF;
END
$$;

-- Emotional states
CREATE TABLE IF NOT EXISTS public.emotional_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  score_energie INTEGER,
  score_stress INTEGER,
  score_isolement INTEGER,
  risque_burnout TEXT,
  risque_decrochage TEXT,
  commentaire_libre TEXT,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.emotional_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their emotional states"
  ON public.emotional_states
  FOR ALL
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_emotional_states_profile ON public.emotional_states(profile_id);
CREATE INDEX IF NOT EXISTS idx_emotional_states_date ON public.emotional_states(date DESC);

-- Recommendations linked to emotional states
CREATE TABLE IF NOT EXISTS public.recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  emotional_state_id UUID REFERENCES public.emotional_states(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  priority TEXT,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their recommendations"
  ON public.recommendations
  FOR ALL
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_recommendations_profile ON public.recommendations(profile_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_state ON public.recommendations(emotional_state_id);
