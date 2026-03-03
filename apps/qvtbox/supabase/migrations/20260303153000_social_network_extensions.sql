-- Social Network Extensions (QVT Box)
-- Date: 2026-03-03
-- Scope:
--   - share levels (private / referent / bubble)
--   - inter-bubble connections
--   - reactions
--   - shared calendars + events
--   - luciole plans/subscriptions/messages
--   - box_items + subscriptions (stub)
--
-- Security hardening:
--   - event_participants INSERT policy must prevent inserting rows for other users
--     unless inviter is bubble admin.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'share_level') THEN
    CREATE TYPE public.share_level AS ENUM ('private', 'referent', 'bubble');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'bubble_connection_status') THEN
    CREATE TYPE public.bubble_connection_status AS ENUM ('pending', 'accepted', 'rejected', 'blocked');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_participation_status') THEN
    CREATE TYPE public.event_participation_status AS ENUM ('invited', 'going', 'maybe', 'declined');
  END IF;
END $$;

ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS share_level public.share_level NOT NULL DEFAULT 'bubble';

ALTER TABLE public.comments
  ADD COLUMN IF NOT EXISTS share_level public.share_level NOT NULL DEFAULT 'bubble';

ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS target_bubble_id UUID REFERENCES public.bubbles(id) ON DELETE SET NULL;

ALTER TABLE public.luciole_subscriptions
  ADD COLUMN IF NOT EXISTS bubble_id UUID REFERENCES public.bubbles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS plan_slug TEXT,
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS monthly_price_cents INTEGER CHECK (monthly_price_cents IS NULL OR monthly_price_cents >= 0),
  ADD COLUMN IF NOT EXISTS notes TEXT;

CREATE TABLE IF NOT EXISTS public.bubble_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_bubble_id UUID NOT NULL REFERENCES public.bubbles(id) ON DELETE CASCADE,
  target_bubble_id UUID NOT NULL REFERENCES public.bubbles(id) ON DELETE CASCADE,
  status public.bubble_connection_status NOT NULL DEFAULT 'pending',
  initiated_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  responded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT bubble_connections_not_same CHECK (source_bubble_id <> target_bubble_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_bubble_connections_unique_pair
  ON public.bubble_connections (LEAST(source_bubble_id, target_bubble_id), GREATEST(source_bubble_id, target_bubble_id));

CREATE INDEX IF NOT EXISTS idx_bubble_connections_source_status
  ON public.bubble_connections (source_bubble_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_bubble_connections_target_status
  ON public.bubble_connections (target_bubble_id, status, created_at DESC);

CREATE TABLE IF NOT EXISTS public.reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bubble_id UUID NOT NULL REFERENCES public.bubbles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL DEFAULT '❤️',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT reactions_target_check CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL)
    OR (post_id IS NULL AND comment_id IS NOT NULL)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_reactions_unique_post
  ON public.reactions (user_id, post_id)
  WHERE post_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_reactions_unique_comment
  ON public.reactions (user_id, comment_id)
  WHERE comment_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_reactions_bubble
  ON public.reactions (bubble_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.calendars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bubble_id UUID NOT NULL UNIQUE REFERENCES public.bubbles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Calendrier de bulle',
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calendar_id UUID NOT NULL REFERENCES public.calendars(id) ON DELETE CASCADE,
  bubble_id UUID NOT NULL REFERENCES public.bubbles(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  tags TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  notes TEXT,
  visibility public.share_level NOT NULL DEFAULT 'bubble',
  is_quick_activity BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT calendar_events_dates_check CHECK (ends_at IS NULL OR ends_at >= starts_at),
  CONSTRAINT calendar_events_title_check CHECK (char_length(trim(title)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_calendar_events_bubble_dates
  ON public.calendar_events (bubble_id, starts_at ASC);

CREATE TABLE IF NOT EXISTS public.event_participants (
  event_id UUID NOT NULL REFERENCES public.calendar_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status public.event_participation_status NOT NULL DEFAULT 'invited',
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (event_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_event_participants_user
  ON public.event_participants (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.luciole_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  billing_interval TEXT NOT NULL CHECK (billing_interval IN ('monthly', 'quarterly')),
  features JSONB NOT NULL DEFAULT '[]'::JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.luciole_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bubble_id UUID NOT NULL REFERENCES public.bubbles(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.luciole_subscriptions(id) ON DELETE SET NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  share_level public.share_level NOT NULL DEFAULT 'referent',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT luciole_messages_content_check CHECK (char_length(trim(content)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_luciole_messages_bubble_created
  ON public.luciole_messages (bubble_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.box_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  box_id UUID NOT NULL REFERENCES public.boxes(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (box_id, product_id)
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bubble_id UUID REFERENCES public.bubbles(id) ON DELETE SET NULL,
  box_id UUID REFERENCES public.boxes(id) ON DELETE SET NULL,
  luciole_subscription_id UUID REFERENCES public.luciole_subscriptions(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paused', 'cancelled', 'expired')),
  interval TEXT NOT NULL DEFAULT 'monthly' CHECK (interval IN ('monthly', 'quarterly')),
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status
  ON public.subscriptions (user_id, status, created_at DESC);

CREATE OR REPLACE FUNCTION public.touch_social_extensions_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_bubble_referent(target_bubble UUID, target_user UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.bubbles b
    WHERE b.id = target_bubble
      AND b.referent_user_id = target_user
  );
$$;

CREATE OR REPLACE FUNCTION public.can_access_bubble_connection(source_id UUID, target_id UUID, target_user UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.can_access_bubble(source_id, target_user)
      OR public.can_access_bubble(target_id, target_user);
$$;

CREATE OR REPLACE FUNCTION public.can_read_shared_content(
  p_bubble_id UUID,
  p_author_id UUID,
  p_share_level public.share_level,
  p_user UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN p_user IS NULL THEN false
    WHEN p_author_id = p_user THEN true
    WHEN p_share_level = 'bubble' THEN public.can_access_bubble(p_bubble_id, p_user)
    WHEN p_share_level = 'referent' THEN (
      public.is_bubble_referent(p_bubble_id, p_user)
      OR public.is_bubble_admin(p_bubble_id, p_user)
      OR public.is_assigned_luciole(p_bubble_id, p_user)
    )
    ELSE false
  END;
$$;

CREATE OR REPLACE FUNCTION public.ensure_calendar_for_bubble()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.calendars (bubble_id, title, created_by)
  VALUES (NEW.id, 'Calendrier - ' || NEW.name, NEW.created_by)
  ON CONFLICT (bubble_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_bubble_autocreate_calendar ON public.bubbles;
CREATE TRIGGER trg_bubble_autocreate_calendar
AFTER INSERT ON public.bubbles
FOR EACH ROW
EXECUTE FUNCTION public.ensure_calendar_for_bubble();

DO $$
BEGIN
  -- Backfill calendars for existing bubbles.
  INSERT INTO public.calendars (bubble_id, title, created_by)
  SELECT b.id, 'Calendrier - ' || b.name, b.created_by
  FROM public.bubbles b
  LEFT JOIN public.calendars c ON c.bubble_id = b.id
  WHERE c.id IS NULL;
END $$;

DROP TRIGGER IF EXISTS trg_bubble_connections_updated_at ON public.bubble_connections;
CREATE TRIGGER trg_bubble_connections_updated_at
BEFORE UPDATE ON public.bubble_connections
FOR EACH ROW
EXECUTE FUNCTION public.touch_social_extensions_updated_at();

DROP TRIGGER IF EXISTS trg_calendars_updated_at ON public.calendars;
CREATE TRIGGER trg_calendars_updated_at
BEFORE UPDATE ON public.calendars
FOR EACH ROW
EXECUTE FUNCTION public.touch_social_extensions_updated_at();

DROP TRIGGER IF EXISTS trg_calendar_events_updated_at ON public.calendar_events;
CREATE TRIGGER trg_calendar_events_updated_at
BEFORE UPDATE ON public.calendar_events
FOR EACH ROW
EXECUTE FUNCTION public.touch_social_extensions_updated_at();

DROP TRIGGER IF EXISTS trg_event_participants_updated_at ON public.event_participants;
CREATE TRIGGER trg_event_participants_updated_at
BEFORE UPDATE ON public.event_participants
FOR EACH ROW
EXECUTE FUNCTION public.touch_social_extensions_updated_at();

DROP TRIGGER IF EXISTS trg_luciole_plans_updated_at ON public.luciole_plans;
CREATE TRIGGER trg_luciole_plans_updated_at
BEFORE UPDATE ON public.luciole_plans
FOR EACH ROW
EXECUTE FUNCTION public.touch_social_extensions_updated_at();

DROP TRIGGER IF EXISTS trg_luciole_messages_updated_at ON public.luciole_messages;
CREATE TRIGGER trg_luciole_messages_updated_at
BEFORE UPDATE ON public.luciole_messages
FOR EACH ROW
EXECUTE FUNCTION public.touch_social_extensions_updated_at();

DROP TRIGGER IF EXISTS trg_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER trg_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.touch_social_extensions_updated_at();

ALTER TABLE public.bubble_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.luciole_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.luciole_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.box_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.luciole_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "posts_select_member_or_luciole" ON public.posts;
CREATE POLICY "posts_select_share_level"
ON public.posts
FOR SELECT
USING (
  auth.role() = 'authenticated'
  AND public.can_read_shared_content(bubble_id, author_id, share_level)
);

DROP POLICY IF EXISTS "comments_select_member_or_luciole" ON public.comments;
CREATE POLICY "comments_select_share_level"
ON public.comments
FOR SELECT
USING (
  auth.role() = 'authenticated'
  AND public.can_read_shared_content(bubble_id, author_id, share_level)
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='bubble_connections' AND policyname='bubble_connections_select_accessible') THEN
    CREATE POLICY "bubble_connections_select_accessible"
    ON public.bubble_connections
    FOR SELECT
    USING (
      auth.role() = 'authenticated'
      AND public.can_access_bubble_connection(source_bubble_id, target_bubble_id)
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='bubble_connections' AND policyname='bubble_connections_insert_admin') THEN
    CREATE POLICY "bubble_connections_insert_admin"
    ON public.bubble_connections
    FOR INSERT
    WITH CHECK (
      auth.role() = 'authenticated'
      AND public.is_bubble_admin(source_bubble_id)
      AND initiated_by = auth.uid()
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='bubble_connections' AND policyname='bubble_connections_update_admin') THEN
    CREATE POLICY "bubble_connections_update_admin"
    ON public.bubble_connections
    FOR UPDATE
    USING (
      auth.role() = 'authenticated'
      AND (public.is_bubble_admin(source_bubble_id) OR public.is_bubble_admin(target_bubble_id))
    )
    WITH CHECK (
      auth.role() = 'authenticated'
      AND (public.is_bubble_admin(source_bubble_id) OR public.is_bubble_admin(target_bubble_id))
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='reactions' AND policyname='reactions_select_accessible') THEN
    CREATE POLICY "reactions_select_accessible"
    ON public.reactions
    FOR SELECT
    USING (auth.role() = 'authenticated' AND public.can_access_bubble(bubble_id));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='reactions' AND policyname='reactions_insert_member') THEN
    CREATE POLICY "reactions_insert_member"
    ON public.reactions
    FOR INSERT
    WITH CHECK (
      auth.role() = 'authenticated'
      AND user_id = auth.uid()
      AND public.is_bubble_member(bubble_id)
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='reactions' AND policyname='reactions_delete_owner') THEN
    CREATE POLICY "reactions_delete_owner"
    ON public.reactions
    FOR DELETE
    USING (
      auth.role() = 'authenticated'
      AND (user_id = auth.uid() OR public.is_bubble_admin(bubble_id))
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='calendars' AND policyname='calendars_select_accessible') THEN
    CREATE POLICY "calendars_select_accessible"
    ON public.calendars
    FOR SELECT
    USING (auth.role() = 'authenticated' AND public.can_access_bubble(bubble_id));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='calendars' AND policyname='calendars_insert_admin') THEN
    CREATE POLICY "calendars_insert_admin"
    ON public.calendars
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated' AND public.is_bubble_admin(bubble_id) AND created_by = auth.uid());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='calendars' AND policyname='calendars_update_admin') THEN
    CREATE POLICY "calendars_update_admin"
    ON public.calendars
    FOR UPDATE
    USING (auth.role() = 'authenticated' AND public.is_bubble_admin(bubble_id))
    WITH CHECK (auth.role() = 'authenticated' AND public.is_bubble_admin(bubble_id));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='calendar_events' AND policyname='calendar_events_select_share_level') THEN
    CREATE POLICY "calendar_events_select_share_level"
    ON public.calendar_events
    FOR SELECT
    USING (
      auth.role() = 'authenticated'
      AND public.can_read_shared_content(bubble_id, created_by, visibility)
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='calendar_events' AND policyname='calendar_events_insert_member') THEN
    CREATE POLICY "calendar_events_insert_member"
    ON public.calendar_events
    FOR INSERT
    WITH CHECK (
      auth.role() = 'authenticated'
      AND created_by = auth.uid()
      AND public.is_bubble_member(bubble_id)
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='calendar_events' AND policyname='calendar_events_update_author_or_admin') THEN
    CREATE POLICY "calendar_events_update_author_or_admin"
    ON public.calendar_events
    FOR UPDATE
    USING (
      auth.role() = 'authenticated'
      AND (created_by = auth.uid() OR public.is_bubble_admin(bubble_id))
    )
    WITH CHECK (
      auth.role() = 'authenticated'
      AND (created_by = auth.uid() OR public.is_bubble_admin(bubble_id))
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='calendar_events' AND policyname='calendar_events_delete_author_or_admin') THEN
    CREATE POLICY "calendar_events_delete_author_or_admin"
    ON public.calendar_events
    FOR DELETE
    USING (
      auth.role() = 'authenticated'
      AND (created_by = auth.uid() OR public.is_bubble_admin(bubble_id))
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='event_participants' AND policyname='event_participants_select_accessible') THEN
    CREATE POLICY "event_participants_select_accessible"
    ON public.event_participants
    FOR SELECT
    USING (
      auth.role() = 'authenticated'
      AND EXISTS (
        SELECT 1
        FROM public.calendar_events ce
        WHERE ce.id = event_id
          AND public.can_access_bubble(ce.bubble_id)
      )
    );
  END IF;

  -- IMPORTANT: we will override the INSERT policy below (security hardening)

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='event_participants' AND policyname='event_participants_update_self_or_admin') THEN
    CREATE POLICY "event_participants_update_self_or_admin"
    ON public.event_participants
    FOR UPDATE
    USING (
      auth.role() = 'authenticated'
      AND (
        user_id = auth.uid()
        OR EXISTS (
          SELECT 1
          FROM public.calendar_events ce
          WHERE ce.id = event_id
            AND public.is_bubble_admin(ce.bubble_id)
        )
      )
    )
    WITH CHECK (
      auth.role() = 'authenticated'
      AND (
        user_id = auth.uid()
        OR EXISTS (
          SELECT 1
          FROM public.calendar_events ce
          WHERE ce.id = event_id
            AND public.is_bubble_admin(ce.bubble_id)
        )
      )
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='luciole_plans' AND policyname='luciole_plans_select_active') THEN
    CREATE POLICY "luciole_plans_select_active"
    ON public.luciole_plans
    FOR SELECT
    USING (is_active = true OR auth.role() = 'service_role');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='luciole_plans' AND policyname='luciole_plans_manage_service') THEN
    CREATE POLICY "luciole_plans_manage_service"
    ON public.luciole_plans
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='luciole_subscriptions' AND policyname='luciole_subscriptions_select_owner_or_luciole') THEN
    CREATE POLICY "luciole_subscriptions_select_owner_or_luciole"
    ON public.luciole_subscriptions
    FOR SELECT
    USING (
      auth.role() = 'authenticated'
      AND (
        user_id = auth.uid()
        OR EXISTS (
          SELECT 1
          FROM public.lucioles l
          WHERE l.id = luciole_id
            AND l.user_id = auth.uid()
        )
      )
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='luciole_subscriptions' AND policyname='luciole_subscriptions_insert_owner') THEN
    CREATE POLICY "luciole_subscriptions_insert_owner"
    ON public.luciole_subscriptions
    FOR INSERT
    WITH CHECK (
      auth.role() = 'authenticated'
      AND user_id = auth.uid()
      AND (bubble_id IS NULL OR public.is_bubble_member(bubble_id))
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='luciole_subscriptions' AND policyname='luciole_subscriptions_update_owner_or_luciole') THEN
    CREATE POLICY "luciole_subscriptions_update_owner_or_luciole"
    ON public.luciole_subscriptions
    FOR UPDATE
    USING (
      auth.role() = 'authenticated'
      AND (
        user_id = auth.uid()
        OR EXISTS (
          SELECT 1
          FROM public.lucioles l
          WHERE l.id = luciole_id
            AND l.user_id = auth.uid()
        )
      )
    )
    WITH CHECK (
      auth.role() = 'authenticated'
      AND (
        user_id = auth.uid()
        OR EXISTS (
          SELECT 1
          FROM public.lucioles l
          WHERE l.id = luciole_id
            AND l.user_id = auth.uid()
        )
      )
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='luciole_messages' AND policyname='luciole_messages_select_share_level') THEN
    CREATE POLICY "luciole_messages_select_share_level"
    ON public.luciole_messages
    FOR SELECT
    USING (
      auth.role() = 'authenticated'
      AND public.can_read_shared_content(bubble_id, author_id, share_level)
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='luciole_messages' AND policyname='luciole_messages_insert_member_or_luciole') THEN
    CREATE POLICY "luciole_messages_insert_member_or_luciole"
    ON public.luciole_messages
    FOR INSERT
    WITH CHECK (
      auth.role() = 'authenticated'
      AND author_id = auth.uid()
      AND (
        public.is_bubble_member(bubble_id)
        OR public.is_assigned_luciole(bubble_id)
      )
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='box_items' AND policyname='box_items_select_public') THEN
    CREATE POLICY "box_items_select_public"
    ON public.box_items
    FOR SELECT
    USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='box_items' AND policyname='box_items_manage_service') THEN
    CREATE POLICY "box_items_manage_service"
    ON public.box_items
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='subscriptions' AND policyname='subscriptions_select_owner') THEN
    CREATE POLICY "subscriptions_select_owner"
    ON public.subscriptions
    FOR SELECT
    USING (auth.role() = 'authenticated' AND user_id = auth.uid());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='subscriptions' AND policyname='subscriptions_insert_owner') THEN
    CREATE POLICY "subscriptions_insert_owner"
    ON public.subscriptions
    FOR INSERT
    WITH CHECK (
      auth.role() = 'authenticated'
      AND user_id = auth.uid()
      AND (bubble_id IS NULL OR public.is_bubble_member(bubble_id))
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='subscriptions' AND policyname='subscriptions_update_owner') THEN
    CREATE POLICY "subscriptions_update_owner"
    ON public.subscriptions
    FOR UPDATE
    USING (auth.role() = 'authenticated' AND user_id = auth.uid())
    WITH CHECK (auth.role() = 'authenticated' AND user_id = auth.uid());
  END IF;
END $$;

-- 🔒 SECURITY HARDENING (force correct INSERT policy even if it existed)
DROP POLICY IF EXISTS "event_participants_insert_member" ON public.event_participants;
CREATE POLICY "event_participants_insert_member"
ON public.event_participants
FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated'
  AND (
    -- Self RSVP
    (
      user_id = auth.uid()
      AND EXISTS (
        SELECT 1
        FROM public.calendar_events ce
        WHERE ce.id = event_id
          AND public.is_bubble_member(ce.bubble_id)
      )
    )
    OR
    -- Admin invites someone else
    (
      invited_by = auth.uid()
      AND EXISTS (
        SELECT 1
        FROM public.calendar_events ce
        WHERE ce.id = event_id
          AND public.is_bubble_admin(ce.bubble_id)
      )
    )
  )
);

DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.reactions;
  EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_object THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.calendar_events;
  EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_object THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.luciole_messages;
  EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_object THEN NULL;
  END;
END $$;
