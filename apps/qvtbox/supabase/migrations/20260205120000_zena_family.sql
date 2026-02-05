-- Zena Family MVP schema (families + lucioles + supervision)

-- ---------- Enums ----------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mentor_application_status') THEN
    CREATE TYPE public.mentor_application_status AS ENUM ('pending', 'approved', 'rejected');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mentor_status') THEN
    CREATE TYPE public.mentor_status AS ENUM ('pending', 'approved', 'suspended');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'support_request_status') THEN
    CREATE TYPE public.support_request_status AS ENUM ('queued', 'assigned', 'active', 'closed', 'cancelled');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'support_session_status') THEN
    CREATE TYPE public.support_session_status AS ENUM ('active', 'closed', 'archived');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'message_moderation_status') THEN
    CREATE TYPE public.message_moderation_status AS ENUM ('allowed', 'blocked', 'flagged');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'risk_flag_status') THEN
    CREATE TYPE public.risk_flag_status AS ENUM ('open', 'reviewing', 'resolved');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'risk_level_enum') THEN
    CREATE TYPE public.risk_level_enum AS ENUM ('low', 'medium', 'high', 'critical');
  END IF;
END $$;

-- ---------- Core tables ----------
CREATE TABLE IF NOT EXISTS public.app_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'supervisor' CHECK (role IN ('supervisor', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.mentor_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  age INTEGER,
  city TEXT,
  motivation TEXT,
  experience TEXT,
  availability TEXT,
  status public.mentor_application_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.mentor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  bio TEXT,
  status public.mentor_status NOT NULL DEFAULT 'pending',
  max_active_sessions INTEGER NOT NULL DEFAULT 3,
  active_sessions INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.support_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID,
  note TEXT,
  status public.support_request_status NOT NULL DEFAULT 'queued',
  assigned_mentor_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.support_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL UNIQUE REFERENCES public.support_requests(id) ON DELETE CASCADE,
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  status public.support_session_status NOT NULL DEFAULT 'active',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.session_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.support_sessions(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('mentor', 'teen', 'parent', 'admin', 'system')),
  content TEXT NOT NULL,
  moderation_status public.message_moderation_status NOT NULL DEFAULT 'allowed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID,
  mood_score INTEGER CHECK (mood_score BETWEEN 0 AND 10),
  stress_score INTEGER CHECK (stress_score BETWEEN 0 AND 10),
  note TEXT,
  ai_result JSONB,
  risk_score INTEGER NOT NULL DEFAULT 0 CHECK (risk_score BETWEEN 0 AND 100),
  escalation_level INTEGER NOT NULL DEFAULT 0 CHECK (escalation_level BETWEEN 0 AND 3),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.risk_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.support_sessions(id) ON DELETE SET NULL,
  message_id UUID REFERENCES public.session_messages(id) ON DELETE SET NULL,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  risk_level public.risk_level_enum NOT NULL DEFAULT 'low',
  status public.risk_flag_status NOT NULL DEFAULT 'open',
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id)
);

-- ---------- Alerts table extensions (family) ----------
ALTER TABLE public.alerts ADD COLUMN IF NOT EXISTS family_id UUID;
ALTER TABLE public.alerts ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.alerts ADD COLUMN IF NOT EXISTS severity TEXT;
ALTER TABLE public.alerts ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE public.alerts ADD COLUMN IF NOT EXISTS message TEXT;

-- ---------- Indexes ----------
CREATE INDEX IF NOT EXISTS idx_mentor_applications_user_id ON public.mentor_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_mentor_profiles_status ON public.mentor_profiles(status);
CREATE INDEX IF NOT EXISTS idx_support_requests_family_id ON public.support_requests(family_id);
CREATE INDEX IF NOT EXISTS idx_support_requests_requester_id ON public.support_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_support_requests_assigned_mentor ON public.support_requests(assigned_mentor_id);
CREATE INDEX IF NOT EXISTS idx_support_sessions_family_id ON public.support_sessions(family_id);
CREATE INDEX IF NOT EXISTS idx_support_sessions_mentor_id ON public.support_sessions(mentor_id);
CREATE INDEX IF NOT EXISTS idx_session_messages_session_id ON public.session_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_checkins_family_id ON public.checkins(family_id);
CREATE INDEX IF NOT EXISTS idx_checkins_user_id ON public.checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_risk_flags_family_id ON public.risk_flags(family_id);
CREATE INDEX IF NOT EXISTS idx_alerts_family_id ON public.alerts(family_id);

-- ---------- Helper functions ----------
CREATE OR REPLACE FUNCTION public.is_app_admin(target_user UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.app_admins a WHERE a.user_id = target_user
  );
$$;

CREATE OR REPLACE FUNCTION public.is_family_member(target_family UUID, target_user UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.family_members fm
    WHERE fm.family_id = target_family AND fm.user_id = target_user
  );
$$;

CREATE OR REPLACE FUNCTION public.is_session_participant(target_session UUID, target_user UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.support_sessions s
    WHERE s.id = target_session
      AND (s.mentor_id = target_user OR s.requester_id = target_user)
  )
  OR public.is_app_admin(target_user);
$$;

-- Assign mentor to request (service_role only)
CREATE OR REPLACE FUNCTION public.assign_mentor_to_request(request_id UUID)
RETURNS TABLE (mentor_id UUID, session_id UUID)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  req_record public.support_requests%ROWTYPE;
  mentor_record public.mentor_profiles%ROWTYPE;
  new_session_id UUID;
BEGIN
  SELECT * INTO req_record
  FROM public.support_requests
  WHERE id = request_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'support_request_not_found';
  END IF;

  IF req_record.status <> 'queued' THEN
    RETURN;
  END IF;

  SELECT * INTO mentor_record
  FROM public.mentor_profiles
  WHERE status = 'approved'
    AND active_sessions < max_active_sessions
  ORDER BY active_sessions ASC, created_at ASC
  LIMIT 1
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  UPDATE public.support_requests
  SET status = 'assigned',
      assigned_mentor_id = mentor_record.user_id,
      updated_at = now()
  WHERE id = req_record.id;

  INSERT INTO public.support_sessions (
    request_id, family_id, mentor_id, requester_id, status, started_at
  ) VALUES (
    req_record.id, req_record.family_id, mentor_record.user_id, req_record.requester_id, 'active', now()
  )
  RETURNING id INTO new_session_id;

  UPDATE public.mentor_profiles
  SET active_sessions = active_sessions + 1,
      updated_at = now()
  WHERE id = mentor_record.id;

  RETURN QUERY SELECT mentor_record.user_id, new_session_id;
END;
$$;

REVOKE ALL ON FUNCTION public.assign_mentor_to_request(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.assign_mentor_to_request(UUID) TO service_role;

-- ---------- Contact info blocking (PII) ----------
CREATE OR REPLACE FUNCTION public.reject_contact_info_in_messages()
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
    RAISE EXCEPTION 'Contact info detected (email not allowed)';
  END IF;

  -- Phone numbers (>=9 digits total)
  digits := regexp_replace(NEW.content, '\D', '', 'g');
  IF length(digits) >= 9 THEN
    RAISE EXCEPTION 'Contact info detected (phone number not allowed)';
  END IF;

  -- Social handles / platforms
  IF NEW.content ~* '(instagram|insta|ig\\b|snapchat|tiktok|discord|whatsapp|telegram|signal|facebook|fb\\b)' THEN
    RAISE EXCEPTION 'Contact info detected (social handle not allowed)';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS block_contact_info_on_messages ON public.session_messages;
CREATE TRIGGER block_contact_info_on_messages
  BEFORE INSERT OR UPDATE ON public.session_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.reject_contact_info_in_messages();

-- ---------- Updated_at triggers ----------
DROP TRIGGER IF EXISTS update_mentor_applications_updated_at ON public.mentor_applications;
CREATE TRIGGER update_mentor_applications_updated_at
  BEFORE UPDATE ON public.mentor_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_mentor_profiles_updated_at ON public.mentor_profiles;
CREATE TRIGGER update_mentor_profiles_updated_at
  BEFORE UPDATE ON public.mentor_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_support_requests_updated_at ON public.support_requests;
CREATE TRIGGER update_support_requests_updated_at
  BEFORE UPDATE ON public.support_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_support_sessions_updated_at ON public.support_sessions;
CREATE TRIGGER update_support_sessions_updated_at
  BEFORE UPDATE ON public.support_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_checkins_updated_at ON public.checkins;
CREATE TRIGGER update_checkins_updated_at
  BEFORE UPDATE ON public.checkins
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------- RLS ----------
ALTER TABLE public.app_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

-- Families
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'families' AND policyname = 'zena_families_select'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_families_select" ON public.families
      FOR SELECT USING (auth.role() = ''authenticated'' AND public.is_family_member(id))';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'families' AND policyname = 'zena_families_insert'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_families_insert" ON public.families
      FOR INSERT WITH CHECK (auth.role() = ''authenticated'' AND created_by = auth.uid())';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'families' AND policyname = 'zena_families_update'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_families_update" ON public.families
      FOR UPDATE USING (auth.role() = ''authenticated'' AND (created_by = auth.uid() OR public.is_app_admin()))';
  END IF;
END $$;

-- Family members
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'family_members' AND policyname = 'zena_family_members_select'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_family_members_select" ON public.family_members
      FOR SELECT USING (auth.role() = ''authenticated'' AND public.is_family_member(family_id))';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'family_members' AND policyname = 'zena_family_members_insert'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_family_members_insert" ON public.family_members
      FOR INSERT WITH CHECK (auth.role() = ''authenticated'' AND auth.uid() = user_id)';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'family_members' AND policyname = 'zena_family_members_delete'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_family_members_delete" ON public.family_members
      FOR DELETE USING (auth.role() = ''authenticated'' AND (auth.uid() = user_id OR public.is_app_admin()))';
  END IF;
END $$;

-- Mentor applications
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'mentor_applications' AND policyname = 'zena_mentor_applications_select'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_mentor_applications_select" ON public.mentor_applications
      FOR SELECT USING (auth.role() = ''authenticated'' AND (auth.uid() = user_id OR public.is_app_admin()))';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'mentor_applications' AND policyname = 'zena_mentor_applications_insert'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_mentor_applications_insert" ON public.mentor_applications
      FOR INSERT WITH CHECK (auth.role() = ''authenticated'' AND auth.uid() = user_id)';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'mentor_applications' AND policyname = 'zena_mentor_applications_update'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_mentor_applications_update" ON public.mentor_applications
      FOR UPDATE USING (auth.role() = ''authenticated'' AND (auth.uid() = user_id OR public.is_app_admin()))';
  END IF;
END $$;

-- Mentor profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'mentor_profiles' AND policyname = 'zena_mentor_profiles_select'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_mentor_profiles_select" ON public.mentor_profiles
      FOR SELECT USING (auth.role() = ''authenticated'' AND (auth.uid() = user_id OR public.is_app_admin()))';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'mentor_profiles' AND policyname = 'zena_mentor_profiles_insert'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_mentor_profiles_insert" ON public.mentor_profiles
      FOR INSERT WITH CHECK (auth.role() = ''authenticated'' AND auth.uid() = user_id)';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'mentor_profiles' AND policyname = 'zena_mentor_profiles_update'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_mentor_profiles_update" ON public.mentor_profiles
      FOR UPDATE USING (auth.role() = ''authenticated'' AND (auth.uid() = user_id OR public.is_app_admin()))';
  END IF;
END $$;

-- Support requests
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'support_requests' AND policyname = 'zena_support_requests_select'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_support_requests_select" ON public.support_requests
      FOR SELECT USING (
        auth.role() = ''authenticated'' AND
        (public.is_family_member(family_id) OR auth.uid() = assigned_mentor_id OR public.is_app_admin())
      )';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'support_requests' AND policyname = 'zena_support_requests_insert'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_support_requests_insert" ON public.support_requests
      FOR INSERT WITH CHECK (
        auth.role() = ''authenticated'' AND auth.uid() = requester_id AND public.is_family_member(family_id)
      )';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'support_requests' AND policyname = 'zena_support_requests_update'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_support_requests_update" ON public.support_requests
      FOR UPDATE USING (
        auth.role() = ''authenticated'' AND
        (auth.uid() = requester_id OR auth.uid() = assigned_mentor_id OR public.is_app_admin())
      )';
  END IF;
END $$;

-- Support sessions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'support_sessions' AND policyname = 'zena_support_sessions_select'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_support_sessions_select" ON public.support_sessions
      FOR SELECT USING (auth.role() = ''authenticated'' AND public.is_session_participant(id))';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'support_sessions' AND policyname = 'zena_support_sessions_insert'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_support_sessions_insert" ON public.support_sessions
      FOR INSERT WITH CHECK (auth.role() = ''service_role'')';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'support_sessions' AND policyname = 'zena_support_sessions_update'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_support_sessions_update" ON public.support_sessions
      FOR UPDATE USING (auth.role() = ''authenticated'' AND public.is_session_participant(id))';
  END IF;
END $$;

-- Session messages
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'session_messages' AND policyname = 'zena_session_messages_select'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_session_messages_select" ON public.session_messages
      FOR SELECT USING (auth.role() = ''authenticated'' AND public.is_session_participant(session_id))';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'session_messages' AND policyname = 'zena_session_messages_insert'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_session_messages_insert" ON public.session_messages
      FOR INSERT WITH CHECK (
        auth.role() = ''authenticated'' AND auth.uid() = sender_id AND public.is_session_participant(session_id)
      )';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'session_messages' AND policyname = 'zena_session_messages_update'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_session_messages_update" ON public.session_messages
      FOR UPDATE USING (auth.role() = ''authenticated'' AND public.is_app_admin())';
  END IF;
END $$;

-- Checkins
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'checkins' AND policyname = 'zena_checkins_select'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_checkins_select" ON public.checkins
      FOR SELECT USING (auth.role() = ''authenticated'' AND public.is_family_member(family_id))';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'checkins' AND policyname = 'zena_checkins_insert'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_checkins_insert" ON public.checkins
      FOR INSERT WITH CHECK (
        auth.role() = ''authenticated'' AND auth.uid() = user_id AND public.is_family_member(family_id)
      )';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'checkins' AND policyname = 'zena_checkins_update'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_checkins_update" ON public.checkins
      FOR UPDATE USING (auth.role() = ''authenticated'' AND (auth.uid() = user_id OR public.is_app_admin()))';
  END IF;
END $$;

-- Risk flags
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'risk_flags' AND policyname = 'zena_risk_flags_select'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_risk_flags_select" ON public.risk_flags
      FOR SELECT USING (
        auth.role() = ''authenticated'' AND (public.is_app_admin() OR public.is_family_member(family_id))
      )';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'risk_flags' AND policyname = 'zena_risk_flags_insert'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_risk_flags_insert" ON public.risk_flags
      FOR INSERT WITH CHECK (
        auth.role() = ''authenticated'' AND (public.is_family_member(family_id) OR public.is_app_admin())
      )';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'risk_flags' AND policyname = 'zena_risk_flags_update'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_risk_flags_update" ON public.risk_flags
      FOR UPDATE USING (auth.role() = ''authenticated'' AND public.is_app_admin())';
  END IF;
END $$;

-- App admins
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'app_admins' AND policyname = 'zena_app_admins_select'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_app_admins_select" ON public.app_admins
      FOR SELECT USING (auth.role() = ''authenticated'' AND auth.uid() = user_id)';
  END IF;
END $$;

-- Alerts (family + admin)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'alerts' AND policyname = 'zena_alerts_family_select'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_alerts_family_select" ON public.alerts
      FOR SELECT USING (auth.role() = ''authenticated'' AND family_id IS NOT NULL AND public.is_family_member(family_id))';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'alerts' AND policyname = 'zena_alerts_admin_select'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_alerts_admin_select" ON public.alerts
      FOR SELECT USING (auth.role() = ''authenticated'' AND public.is_app_admin())';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'alerts' AND policyname = 'zena_alerts_admin_update'
  ) THEN
    EXECUTE 'CREATE POLICY "zena_alerts_admin_update" ON public.alerts
      FOR UPDATE USING (auth.role() = ''authenticated'' AND public.is_app_admin())';
  END IF;
END $$;
