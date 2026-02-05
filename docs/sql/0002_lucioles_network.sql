-- 0002 ZENA Lucioles Network (mentor / support / supervision)
-- Requirements:
-- - Do not modify 0001
-- - Only zena_* tables in this file
-- - RLS everywhere (no anon)

-- ---------- Enums ----------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'zena_mentor_application_status') THEN
    CREATE TYPE public.zena_mentor_application_status AS ENUM ('pending', 'approved', 'rejected');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'zena_mentor_status') THEN
    CREATE TYPE public.zena_mentor_status AS ENUM ('pending', 'approved', 'suspended');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'zena_support_request_status') THEN
    CREATE TYPE public.zena_support_request_status AS ENUM ('queued', 'assigned', 'active', 'closed', 'cancelled');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'zena_support_session_status') THEN
    CREATE TYPE public.zena_support_session_status AS ENUM ('active', 'closed', 'archived');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'zena_message_moderation_status') THEN
    CREATE TYPE public.zena_message_moderation_status AS ENUM ('allowed', 'blocked', 'flagged');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'zena_risk_flag_status') THEN
    CREATE TYPE public.zena_risk_flag_status AS ENUM ('open', 'reviewing', 'resolved');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'zena_risk_level') THEN
    CREATE TYPE public.zena_risk_level AS ENUM ('low', 'medium', 'high', 'critical');
  END IF;
END $$;

-- ---------- Core tables ----------
CREATE TABLE IF NOT EXISTS public.zena_app_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'supervisor' CHECK (role IN ('supervisor', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.zena_mentor_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  age INTEGER,
  city TEXT,
  motivation TEXT,
  experience TEXT,
  availability TEXT,
  status public.zena_mentor_application_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.zena_mentor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  bio TEXT,
  status public.zena_mentor_status NOT NULL DEFAULT 'pending',
  max_active_sessions INTEGER NOT NULL DEFAULT 3,
  active_sessions INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.zena_mentor_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_profile_id UUID NOT NULL REFERENCES public.zena_mentor_profiles(id) ON DELETE CASCADE,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'Europe/Paris',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.zena_support_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note TEXT,
  status public.zena_support_request_status NOT NULL DEFAULT 'queued',
  mentor_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.zena_support_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL UNIQUE REFERENCES public.zena_support_requests(id) ON DELETE CASCADE,
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  mentor_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  status public.zena_support_session_status NOT NULL DEFAULT 'active',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.zena_session_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.zena_support_sessions(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('mentor', 'teen', 'parent', 'admin', 'system')),
  content TEXT NOT NULL,
  moderation_status public.zena_message_moderation_status NOT NULL DEFAULT 'allowed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.zena_risk_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.zena_support_sessions(id) ON DELETE SET NULL,
  message_id UUID REFERENCES public.zena_session_messages(id) ON DELETE SET NULL,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  risk_level public.zena_risk_level NOT NULL DEFAULT 'low',
  status public.zena_risk_flag_status NOT NULL DEFAULT 'open',
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id)
);

-- ---------- Helper functions ----------
CREATE OR REPLACE FUNCTION public.zena_is_admin(target_user UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.zena_app_admins a WHERE a.user_id = target_user
  );
$$;

CREATE OR REPLACE FUNCTION public.zena_is_session_participant(target_session UUID, target_user UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.zena_support_sessions s
    WHERE s.id = target_session
      AND (s.mentor_user_id = target_user OR s.requester_id = target_user)
  )
  OR public.zena_is_admin(target_user);
$$;

-- ---------- Anti-PII trigger on messages ----------
CREATE OR REPLACE FUNCTION public.zena_reject_pii_in_messages()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  digits TEXT;
BEGIN
  IF NEW.content IS NULL THEN
    RETURN NEW;
  END IF;

  -- Emails
  IF NEW.content ~* '([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})' THEN
    RAISE EXCEPTION 'PII detected (email not allowed)';
  END IF;

  -- Phone numbers (>=9 digits total)
  digits := regexp_replace(NEW.content, '\D', '', 'g');
  IF length(digits) >= 9 THEN
    RAISE EXCEPTION 'PII detected (phone number not allowed)';
  END IF;

  -- Social handles / platforms
  IF NEW.content ~* '(instagram|insta|ig\\b|snapchat|tiktok|discord|whatsapp|telegram|signal|facebook|fb\\b|twitter|x\\b)' THEN
    RAISE EXCEPTION 'PII detected (social handle not allowed)';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS zena_block_pii_on_messages ON public.zena_session_messages;
CREATE TRIGGER zena_block_pii_on_messages
  BEFORE INSERT OR UPDATE ON public.zena_session_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.zena_reject_pii_in_messages();

-- ---------- Indexes ----------
CREATE INDEX IF NOT EXISTS idx_zena_session_messages_session_id
  ON public.zena_session_messages(session_id);

CREATE INDEX IF NOT EXISTS idx_zena_support_requests_mentor_user_id
  ON public.zena_support_requests(mentor_user_id);
CREATE INDEX IF NOT EXISTS idx_zena_support_requests_status
  ON public.zena_support_requests(status);
CREATE INDEX IF NOT EXISTS idx_zena_support_requests_created_at
  ON public.zena_support_requests(created_at);

CREATE INDEX IF NOT EXISTS idx_zena_support_sessions_mentor_user_id
  ON public.zena_support_sessions(mentor_user_id);
CREATE INDEX IF NOT EXISTS idx_zena_support_sessions_status
  ON public.zena_support_sessions(status);
CREATE INDEX IF NOT EXISTS idx_zena_support_sessions_created_at
  ON public.zena_support_sessions(created_at);

CREATE INDEX IF NOT EXISTS idx_zena_risk_flags_session_id
  ON public.zena_risk_flags(session_id);
CREATE INDEX IF NOT EXISTS idx_zena_risk_flags_status
  ON public.zena_risk_flags(status);
CREATE INDEX IF NOT EXISTS idx_zena_risk_flags_created_at
  ON public.zena_risk_flags(created_at);

-- ---------- RLS ----------
ALTER TABLE public.zena_app_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zena_mentor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zena_mentor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zena_mentor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zena_support_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zena_support_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zena_session_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zena_risk_flags ENABLE ROW LEVEL SECURITY;

-- zena_app_admins
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'zena_app_admins' AND policyname = 'zena_app_admins_select'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_app_admins_select" ON public.zena_app_admins
      FOR SELECT USING (auth.role() = ''authenticated'' AND (auth.uid() = user_id OR public.zena_is_admin()))';
  END IF;
END $$;

-- zena_mentor_applications
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'zena_mentor_applications' AND policyname = 'zena_mentor_applications_select'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_mentor_applications_select" ON public.zena_mentor_applications
      FOR SELECT USING (auth.role() = ''authenticated'' AND (auth.uid() = user_id OR public.zena_is_admin()))';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'zena_mentor_applications' AND policyname = 'zena_mentor_applications_insert'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_mentor_applications_insert" ON public.zena_mentor_applications
      FOR INSERT WITH CHECK (auth.role() = ''authenticated'' AND auth.uid() = user_id)';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'zena_mentor_applications' AND policyname = 'zena_mentor_applications_update'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_mentor_applications_update" ON public.zena_mentor_applications
      FOR UPDATE USING (auth.role() = ''authenticated'' AND (auth.uid() = user_id OR public.zena_is_admin()))';
  END IF;
END $$;

-- zena_mentor_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'zena_mentor_profiles' AND policyname = 'zena_mentor_profiles_select'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_mentor_profiles_select" ON public.zena_mentor_profiles
      FOR SELECT USING (auth.role() = ''authenticated'' AND (auth.uid() = user_id OR public.zena_is_admin()))';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'zena_mentor_profiles' AND policyname = 'zena_mentor_profiles_insert'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_mentor_profiles_insert" ON public.zena_mentor_profiles
      FOR INSERT WITH CHECK (auth.role() = ''authenticated'' AND auth.uid() = user_id)';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'zena_mentor_profiles' AND policyname = 'zena_mentor_profiles_update'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_mentor_profiles_update" ON public.zena_mentor_profiles
      FOR UPDATE USING (auth.role() = ''authenticated'' AND (auth.uid() = user_id OR public.zena_is_admin()))';
  END IF;
END $$;

-- zena_mentor_availability
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'zena_mentor_availability' AND policyname = 'zena_mentor_availability_select'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_mentor_availability_select" ON public.zena_mentor_availability
      FOR SELECT USING (
        auth.role() = ''authenticated'' AND (
          public.zena_is_admin()
          OR EXISTS (
            SELECT 1 FROM public.zena_mentor_profiles mp
            WHERE mp.id = mentor_profile_id AND mp.user_id = auth.uid()
          )
        )
      )';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'zena_mentor_availability' AND policyname = 'zena_mentor_availability_insert'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_mentor_availability_insert" ON public.zena_mentor_availability
      FOR INSERT WITH CHECK (
        auth.role() = ''authenticated'' AND (
          public.zena_is_admin()
          OR EXISTS (
            SELECT 1 FROM public.zena_mentor_profiles mp
            WHERE mp.id = mentor_profile_id AND mp.user_id = auth.uid()
          )
        )
      )';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'zena_mentor_availability' AND policyname = 'zena_mentor_availability_update'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_mentor_availability_update" ON public.zena_mentor_availability
      FOR UPDATE USING (
        auth.role() = ''authenticated'' AND (
          public.zena_is_admin()
          OR EXISTS (
            SELECT 1 FROM public.zena_mentor_profiles mp
            WHERE mp.id = mentor_profile_id AND mp.user_id = auth.uid()
          )
        )
      )';
  END IF;
END $$;

-- zena_support_requests
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'zena_support_requests' AND policyname = 'zena_support_requests_select'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_support_requests_select" ON public.zena_support_requests
      FOR SELECT USING (
        auth.role() = ''authenticated'' AND (
          public.zena_is_admin()
          OR auth.uid() = requester_id
          OR auth.uid() = mentor_user_id
        )
      )';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'zena_support_requests' AND policyname = 'zena_support_requests_insert'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_support_requests_insert" ON public.zena_support_requests
      FOR INSERT WITH CHECK (
        auth.role() = ''authenticated''
        AND auth.uid() = requester_id
        AND public.is_family_member(family_id)
      )';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'zena_support_requests' AND policyname = 'zena_support_requests_update'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_support_requests_update" ON public.zena_support_requests
      FOR UPDATE USING (
        auth.role() = ''authenticated'' AND (
          public.zena_is_admin()
          OR auth.uid() = requester_id
          OR auth.uid() = mentor_user_id
        )
      )';
  END IF;
END $$;

-- zena_support_sessions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'zena_support_sessions' AND policyname = 'zena_support_sessions_select'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_support_sessions_select" ON public.zena_support_sessions
      FOR SELECT USING (
        auth.role() = ''authenticated'' AND (
          public.zena_is_admin()
          OR auth.uid() = mentor_user_id
          OR auth.uid() = requester_id
        )
      )';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'zena_support_sessions' AND policyname = 'zena_support_sessions_insert'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_support_sessions_insert" ON public.zena_support_sessions
      FOR INSERT WITH CHECK (auth.role() = ''authenticated'' AND public.zena_is_admin())';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'zena_support_sessions' AND policyname = 'zena_support_sessions_update'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_support_sessions_update" ON public.zena_support_sessions
      FOR UPDATE USING (
        auth.role() = ''authenticated'' AND (
          public.zena_is_admin()
          OR auth.uid() = mentor_user_id
          OR auth.uid() = requester_id
        )
      )';
  END IF;
END $$;

-- zena_session_messages
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'zena_session_messages' AND policyname = 'zena_session_messages_select'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_session_messages_select" ON public.zena_session_messages
      FOR SELECT USING (auth.role() = ''authenticated'' AND public.zena_is_session_participant(session_id))';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'zena_session_messages' AND policyname = 'zena_session_messages_insert'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_session_messages_insert" ON public.zena_session_messages
      FOR INSERT WITH CHECK (
        auth.role() = ''authenticated''
        AND auth.uid() = sender_id
        AND public.zena_is_session_participant(session_id)
      )';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'zena_session_messages' AND policyname = 'zena_session_messages_update'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_session_messages_update" ON public.zena_session_messages
      FOR UPDATE USING (auth.role() = ''authenticated'' AND public.zena_is_admin())';
  END IF;
END $$;

-- zena_risk_flags
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'zena_risk_flags' AND policyname = 'zena_risk_flags_select'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_risk_flags_select" ON public.zena_risk_flags
      FOR SELECT USING (
        auth.role() = ''authenticated'' AND (
          public.zena_is_admin()
          OR public.is_family_member(family_id)
          OR reporter_id = auth.uid()
        )
      )';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'zena_risk_flags' AND policyname = 'zena_risk_flags_insert'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_risk_flags_insert" ON public.zena_risk_flags
      FOR INSERT WITH CHECK (
        auth.role() = ''authenticated'' AND (
          public.zena_is_admin()
          OR public.is_family_member(family_id)
          OR reporter_id = auth.uid()
        )
      )';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'zena_risk_flags' AND policyname = 'zena_risk_flags_update'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_risk_flags_update" ON public.zena_risk_flags
      FOR UPDATE USING (auth.role() = ''authenticated'' AND public.zena_is_admin())';
  END IF;
END $$;

-- ---------- How to test ----------
-- 1) Insert a mentor profile (use a real auth.users id)
-- insert into public.zena_mentor_profiles (user_id, display_name, status)
-- values ('<mentor-user-uuid>', 'Luciole Maya', 'approved');
--
-- 2) Insert availability for that mentor
-- insert into public.zena_mentor_availability (mentor_profile_id, day_of_week, start_time, end_time, timezone)
-- values (
--   (select id from public.zena_mentor_profiles where user_id = '<mentor-user-uuid>'),
--   2, '18:00', '20:00', 'Europe/Paris'
-- );
--
-- 3) Create a support request (requester must be in public.family_members for the family)
-- insert into public.zena_support_requests (family_id, requester_id, note)
-- values ('<family-uuid>', '<requester-user-uuid>', 'Besoin de parler');
