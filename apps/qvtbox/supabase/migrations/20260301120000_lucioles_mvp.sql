-- Lucioles MVP
-- Tables:
--   - public.lucioles
--   - public.luciole_applications
--   - public.luciole_subscriptions (stub)
-- RLS:
--   - profile modifiable par la Luciole elle-même
--   - annuaire visible uniquement pour les Lucioles approved

CREATE TABLE IF NOT EXISTS public.lucioles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  city TEXT,
  bio TEXT,
  expertise TEXT[] DEFAULT '{}',
  hourly_rate_cents INTEGER,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'suspended')),
  charter_accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.luciole_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  city TEXT,
  bio TEXT,
  motivation TEXT,
  experience TEXT,
  availability TEXT,
  charter_accepted BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.luciole_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  luciole_id UUID NOT NULL REFERENCES public.lucioles(id) ON DELETE RESTRICT,
  family_id UUID REFERENCES public.families(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'ended')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lucioles_status ON public.lucioles(status);
CREATE INDEX IF NOT EXISTS idx_lucioles_user_id ON public.lucioles(user_id);
CREATE INDEX IF NOT EXISTS idx_luciole_applications_user_id ON public.luciole_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_luciole_applications_status ON public.luciole_applications(status);
CREATE INDEX IF NOT EXISTS idx_luciole_subscriptions_user_id ON public.luciole_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_luciole_subscriptions_luciole_id ON public.luciole_subscriptions(luciole_id);

CREATE OR REPLACE FUNCTION public.set_lucioles_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_lucioles_updated_at ON public.lucioles;
CREATE TRIGGER trg_lucioles_updated_at
BEFORE UPDATE ON public.lucioles
FOR EACH ROW
EXECUTE FUNCTION public.set_lucioles_updated_at();

DROP TRIGGER IF EXISTS trg_luciole_applications_updated_at ON public.luciole_applications;
CREATE TRIGGER trg_luciole_applications_updated_at
BEFORE UPDATE ON public.luciole_applications
FOR EACH ROW
EXECUTE FUNCTION public.set_lucioles_updated_at();

DROP TRIGGER IF EXISTS trg_luciole_subscriptions_updated_at ON public.luciole_subscriptions;
CREATE TRIGGER trg_luciole_subscriptions_updated_at
BEFORE UPDATE ON public.luciole_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.set_lucioles_updated_at();

ALTER TABLE public.lucioles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.luciole_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.luciole_subscriptions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'lucioles' AND policyname = 'lucioles_directory_select_approved'
  ) THEN
    CREATE POLICY "lucioles_directory_select_approved"
    ON public.lucioles
    FOR SELECT
    USING (status = 'approved');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'lucioles' AND policyname = 'lucioles_owner_select'
  ) THEN
    CREATE POLICY "lucioles_owner_select"
    ON public.lucioles
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'lucioles' AND policyname = 'lucioles_owner_insert'
  ) THEN
    CREATE POLICY "lucioles_owner_insert"
    ON public.lucioles
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'lucioles' AND policyname = 'lucioles_owner_update'
  ) THEN
    CREATE POLICY "lucioles_owner_update"
    ON public.lucioles
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'luciole_applications' AND policyname = 'luciole_applications_owner_select'
  ) THEN
    CREATE POLICY "luciole_applications_owner_select"
    ON public.luciole_applications
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'luciole_applications' AND policyname = 'luciole_applications_owner_insert'
  ) THEN
    CREATE POLICY "luciole_applications_owner_insert"
    ON public.luciole_applications
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'luciole_applications' AND policyname = 'luciole_applications_owner_update'
  ) THEN
    CREATE POLICY "luciole_applications_owner_update"
    ON public.luciole_applications
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'luciole_subscriptions' AND policyname = 'luciole_subscriptions_owner_select'
  ) THEN
    CREATE POLICY "luciole_subscriptions_owner_select"
    ON public.luciole_subscriptions
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'luciole_subscriptions' AND policyname = 'luciole_subscriptions_owner_insert'
  ) THEN
    CREATE POLICY "luciole_subscriptions_owner_insert"
    ON public.luciole_subscriptions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;
END;
$$;
