-- Social Bubbles MVP (QVT Box)
-- Date: 2026-03-03
-- Scope: bubbles + social feed + moderation + lucioles + box recommendations

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'bubble_kind') THEN
    CREATE TYPE public.bubble_kind AS ENUM ('personal', 'enterprise');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'bubble_member_role') THEN
    CREATE TYPE public.bubble_member_role AS ENUM ('owner', 'admin', 'member', 'referent', 'luciole');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'bubble_invitation_status') THEN
    CREATE TYPE public.bubble_invitation_status AS ENUM ('pending', 'accepted', 'rejected', 'expired');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type_social') THEN
    CREATE TYPE public.notification_type_social AS ENUM ('invitation', 'new_post', 'reply', 'help_request');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'report_status_social') THEN
    CREATE TYPE public.report_status_social AS ENUM ('pending', 'reviewed', 'closed');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.bubbles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  bubble_type public.bubble_kind NOT NULL DEFAULT 'personal',
  has_minor BOOLEAN NOT NULL DEFAULT false,
  referent_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  enterprise_id UUID REFERENCES public.enterprises(id) ON DELETE SET NULL,
  cover_path TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT bubbles_minor_referent_required CHECK (NOT has_minor OR referent_user_id IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS public.bubble_members (
  bubble_id UUID NOT NULL REFERENCES public.bubbles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.bubble_member_role NOT NULL DEFAULT 'member',
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (bubble_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.bubble_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bubble_id UUID NOT NULL REFERENCES public.bubbles(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  email TEXT,
  role public.bubble_member_role NOT NULL DEFAULT 'member',
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status public.bubble_invitation_status NOT NULL DEFAULT 'pending',
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '7 days'),
  accepted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT bubble_invitations_token_length CHECK (char_length(token) >= 12)
);

CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bubble_id UUID NOT NULL REFERENCES public.bubbles(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT posts_content_not_empty CHECK (char_length(trim(content)) > 0),
  CONSTRAINT posts_content_size CHECK (char_length(content) <= 2000)
);

CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  bubble_id UUID NOT NULL REFERENCES public.bubbles(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT comments_content_not_empty CHECK (char_length(trim(content)) > 0),
  CONSTRAINT comments_content_size CHECK (char_length(content) <= 1200)
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  bubble_id UUID REFERENCES public.bubbles(id) ON DELETE SET NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE SET NULL,
  comment_id UUID REFERENCES public.comments(id) ON DELETE SET NULL,
  invitation_id UUID REFERENCES public.bubble_invitations(id) ON DELETE SET NULL,
  type public.notification_type_social NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bubble_id UUID NOT NULL REFERENCES public.bubbles(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'comment', 'user')),
  target_id UUID NOT NULL,
  reason TEXT NOT NULL,
  status public.report_status_social NOT NULL DEFAULT 'pending',
  resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT blocks_unique_pair UNIQUE (blocker_id, blocked_id),
  CONSTRAINT blocks_no_self CHECK (blocker_id <> blocked_id)
);

CREATE TABLE IF NOT EXISTS public.bubble_lucioles (
  bubble_id UUID NOT NULL REFERENCES public.bubbles(id) ON DELETE CASCADE,
  luciole_id UUID NOT NULL REFERENCES public.lucioles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (bubble_id, luciole_id)
);

CREATE TABLE IF NOT EXISTS public.boxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  image_path TEXT,
  price_cents INTEGER NOT NULL DEFAULT 0 CHECK (price_cents >= 0),
  cadence TEXT NOT NULL DEFAULT 'one_shot' CHECK (cadence IN ('one_shot', 'monthly', 'quarterly')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.box_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bubble_id UUID NOT NULL REFERENCES public.bubbles(id) ON DELETE CASCADE,
  box_id UUID NOT NULL REFERENCES public.boxes(id) ON DELETE CASCADE,
  reason TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT box_recommendations_unique UNIQUE (bubble_id, box_id)
);

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS bubble_id UUID REFERENCES public.bubbles(id) ON DELETE SET NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS box_id UUID REFERENCES public.boxes(id) ON DELETE SET NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_kind TEXT NOT NULL DEFAULT 'gift';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS gift_for_email TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS note TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS subscription_interval TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'orders_order_kind_social_check'
      AND conrelid = 'public.orders'::regclass
  ) THEN
    ALTER TABLE public.orders
      ADD CONSTRAINT orders_order_kind_social_check
      CHECK (order_kind IN ('gift', 'subscription'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'orders_subscription_interval_social_check'
      AND conrelid = 'public.orders'::regclass
  ) THEN
    ALTER TABLE public.orders
      ADD CONSTRAINT orders_subscription_interval_social_check
      CHECK (
        subscription_interval IS NULL
        OR subscription_interval IN ('monthly', 'quarterly')
      );
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_bubbles_created_by ON public.bubbles(created_by);
CREATE INDEX IF NOT EXISTS idx_bubbles_type ON public.bubbles(bubble_type);
CREATE INDEX IF NOT EXISTS idx_bubble_members_user_id ON public.bubble_members(user_id);
CREATE INDEX IF NOT EXISTS idx_bubble_members_role ON public.bubble_members(bubble_id, role);
CREATE INDEX IF NOT EXISTS idx_bubble_invitations_bubble_status ON public.bubble_invitations(bubble_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bubble_invitations_email ON public.bubble_invitations(lower(email));
CREATE INDEX IF NOT EXISTS idx_posts_bubble_created_at ON public.posts(bubble_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post_created_at ON public.comments(post_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_comments_bubble_created_at ON public.comments(bubble_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read_created ON public.notifications(user_id, read_at, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_bubble_status ON public.reports(bubble_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blocks_blocker_id ON public.blocks(blocker_id);
CREATE INDEX IF NOT EXISTS idx_bubble_lucioles_bubble ON public.bubble_lucioles(bubble_id, status);
CREATE INDEX IF NOT EXISTS idx_box_recommendations_bubble ON public.box_recommendations(bubble_id);
CREATE INDEX IF NOT EXISTS idx_orders_social_bubble ON public.orders(bubble_id);
CREATE INDEX IF NOT EXISTS idx_orders_social_box ON public.orders(box_id);

CREATE OR REPLACE FUNCTION public.is_bubble_member(target_bubble UUID, target_user UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.bubble_members bm
    WHERE bm.bubble_id = target_bubble
      AND bm.user_id = target_user
  );
$$;

CREATE OR REPLACE FUNCTION public.is_bubble_admin(target_bubble UUID, target_user UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.bubble_members bm
    WHERE bm.bubble_id = target_bubble
      AND bm.user_id = target_user
      AND bm.role IN ('owner', 'admin')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_assigned_luciole(target_bubble UUID, target_user UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.bubble_lucioles bl
    JOIN public.lucioles l ON l.id = bl.luciole_id
    WHERE bl.bubble_id = target_bubble
      AND bl.status = 'active'
      AND l.status = 'approved'
      AND l.user_id = target_user
  );
$$;

CREATE OR REPLACE FUNCTION public.can_access_bubble(target_bubble UUID, target_user UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_bubble_member(target_bubble, target_user)
    OR public.is_assigned_luciole(target_bubble, target_user);
$$;

CREATE OR REPLACE FUNCTION public.respond_bubble_invitation(p_token TEXT, p_decision TEXT DEFAULT 'accepted')
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invitation public.bubble_invitations%ROWTYPE;
  v_user_id UUID := auth.uid();
  v_user_email TEXT := lower(coalesce(auth.jwt() ->> 'email', ''));
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  IF p_decision NOT IN ('accepted', 'rejected') THEN
    RAISE EXCEPTION 'invalid_decision';
  END IF;

  SELECT *
  INTO v_invitation
  FROM public.bubble_invitations
  WHERE token = p_token
  LIMIT 1
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'invitation_not_found';
  END IF;

  IF v_invitation.status <> 'pending' THEN
    RETURN v_invitation.bubble_id;
  END IF;

  IF v_invitation.expires_at < now() THEN
    UPDATE public.bubble_invitations
    SET status = 'expired',
        responded_at = now()
    WHERE id = v_invitation.id;
    RAISE EXCEPTION 'invitation_expired';
  END IF;

  IF v_invitation.email IS NOT NULL
     AND lower(v_invitation.email) <> v_user_email THEN
    RAISE EXCEPTION 'invitation_email_mismatch';
  END IF;

  IF p_decision = 'accepted' THEN
    INSERT INTO public.bubble_members (bubble_id, user_id, role, invited_by)
    VALUES (v_invitation.bubble_id, v_user_id, v_invitation.role, v_invitation.invited_by)
    ON CONFLICT (bubble_id, user_id)
    DO UPDATE SET role = EXCLUDED.role;

    UPDATE public.bubble_invitations
    SET status = 'accepted',
        accepted_by = v_user_id,
        responded_at = now()
    WHERE id = v_invitation.id;
  ELSE
    UPDATE public.bubble_invitations
    SET status = 'rejected',
        accepted_by = v_user_id,
        responded_at = now()
    WHERE id = v_invitation.id;
  END IF;

  INSERT INTO public.notifications (
    user_id,
    actor_id,
    bubble_id,
    invitation_id,
    type,
    payload
  )
  VALUES (
    v_invitation.invited_by,
    v_user_id,
    v_invitation.bubble_id,
    v_invitation.id,
    'invitation',
    jsonb_build_object('decision', p_decision, 'token', p_token)
  );

  RETURN v_invitation.bubble_id;
END;
$$;

REVOKE ALL ON FUNCTION public.respond_bubble_invitation(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.respond_bubble_invitation(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.respond_bubble_invitation(TEXT, TEXT) TO service_role;

CREATE OR REPLACE FUNCTION public.set_comment_bubble_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.bubble_id IS NULL THEN
    SELECT p.bubble_id INTO NEW.bubble_id FROM public.posts p WHERE p.id = NEW.post_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_comment_bubble_id ON public.comments;
CREATE TRIGGER trg_set_comment_bubble_id
BEFORE INSERT ON public.comments
FOR EACH ROW
EXECUTE FUNCTION public.set_comment_bubble_id();

CREATE OR REPLACE FUNCTION public.notify_new_post()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notifications (user_id, actor_id, bubble_id, post_id, type, payload)
  SELECT DISTINCT
    bm.user_id,
    NEW.author_id,
    NEW.bubble_id,
    NEW.id,
    'new_post',
    jsonb_build_object('content', left(NEW.content, 180))
  FROM public.bubble_members bm
  WHERE bm.bubble_id = NEW.bubble_id
    AND bm.user_id <> NEW.author_id
    AND NOT EXISTS (
      SELECT 1
      FROM public.blocks b
      WHERE b.blocker_id = bm.user_id
        AND b.blocked_id = NEW.author_id
    );

  INSERT INTO public.notifications (user_id, actor_id, bubble_id, post_id, type, payload)
  SELECT DISTINCT
    l.user_id,
    NEW.author_id,
    NEW.bubble_id,
    NEW.id,
    'new_post',
    jsonb_build_object('content', left(NEW.content, 180))
  FROM public.bubble_lucioles bl
  JOIN public.lucioles l ON l.id = bl.luciole_id
  WHERE bl.bubble_id = NEW.bubble_id
    AND bl.status = 'active'
    AND l.status = 'approved'
    AND l.user_id <> NEW.author_id
    AND NOT EXISTS (
      SELECT 1
      FROM public.blocks b
      WHERE b.blocker_id = l.user_id
        AND b.blocked_id = NEW.author_id
    );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_new_post ON public.posts;
CREATE TRIGGER trg_notify_new_post
AFTER INSERT ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.notify_new_post();

CREATE OR REPLACE FUNCTION public.notify_new_comment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_post_author UUID;
BEGIN
  SELECT p.author_id INTO v_post_author
  FROM public.posts p
  WHERE p.id = NEW.post_id;

  IF v_post_author IS NOT NULL AND v_post_author <> NEW.author_id THEN
    INSERT INTO public.notifications (user_id, actor_id, bubble_id, post_id, comment_id, type, payload)
    VALUES (
      v_post_author,
      NEW.author_id,
      NEW.bubble_id,
      NEW.post_id,
      NEW.id,
      'reply',
      jsonb_build_object('content', left(NEW.content, 180))
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_new_comment ON public.comments;
CREATE TRIGGER trg_notify_new_comment
AFTER INSERT ON public.comments
FOR EACH ROW
EXECUTE FUNCTION public.notify_new_comment();

CREATE OR REPLACE FUNCTION public.notify_new_report()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notifications (user_id, actor_id, bubble_id, type, payload)
  SELECT
    bm.user_id,
    NEW.reporter_id,
    NEW.bubble_id,
    'help_request',
    jsonb_build_object(
      'report_id', NEW.id,
      'target_type', NEW.target_type,
      'target_id', NEW.target_id,
      'reason', NEW.reason
    )
  FROM public.bubble_members bm
  WHERE bm.bubble_id = NEW.bubble_id
    AND bm.role IN ('owner', 'admin')
    AND bm.user_id <> NEW.reporter_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_new_report ON public.reports;
CREATE TRIGGER trg_notify_new_report
AFTER INSERT ON public.reports
FOR EACH ROW
EXECUTE FUNCTION public.notify_new_report();

CREATE OR REPLACE FUNCTION public.touch_social_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_bubbles_updated_at ON public.bubbles;
CREATE TRIGGER trg_bubbles_updated_at
BEFORE UPDATE ON public.bubbles
FOR EACH ROW
EXECUTE FUNCTION public.touch_social_updated_at();

DROP TRIGGER IF EXISTS trg_posts_updated_at ON public.posts;
CREATE TRIGGER trg_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.touch_social_updated_at();

DROP TRIGGER IF EXISTS trg_comments_updated_at ON public.comments;
CREATE TRIGGER trg_comments_updated_at
BEFORE UPDATE ON public.comments
FOR EACH ROW
EXECUTE FUNCTION public.touch_social_updated_at();

DROP TRIGGER IF EXISTS trg_boxes_updated_at ON public.boxes;
CREATE TRIGGER trg_boxes_updated_at
BEFORE UPDATE ON public.boxes
FOR EACH ROW
EXECUTE FUNCTION public.touch_social_updated_at();

ALTER TABLE public.bubbles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bubble_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bubble_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bubble_lucioles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.box_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- Bubbles
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'bubbles' AND policyname = 'bubbles_select_member_or_luciole') THEN
    EXECUTE 'CREATE POLICY "bubbles_select_member_or_luciole" ON public.bubbles FOR SELECT USING (auth.role() = ''authenticated'' AND public.can_access_bubble(id))';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'bubbles' AND policyname = 'bubbles_insert_owner') THEN
    EXECUTE 'CREATE POLICY "bubbles_insert_owner" ON public.bubbles FOR INSERT WITH CHECK (auth.role() = ''authenticated'' AND created_by = auth.uid())';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'bubbles' AND policyname = 'bubbles_update_admin') THEN
    EXECUTE 'CREATE POLICY "bubbles_update_admin" ON public.bubbles FOR UPDATE USING (auth.role() = ''authenticated'' AND public.is_bubble_admin(id)) WITH CHECK (auth.role() = ''authenticated'' AND public.is_bubble_admin(id))';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'bubbles' AND policyname = 'bubbles_delete_owner') THEN
    EXECUTE 'CREATE POLICY "bubbles_delete_owner" ON public.bubbles FOR DELETE USING (auth.role() = ''authenticated'' AND EXISTS (SELECT 1 FROM public.bubble_members bm WHERE bm.bubble_id = id AND bm.user_id = auth.uid() AND bm.role = ''owner''))';
  END IF;

  -- Bubble members
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'bubble_members' AND policyname = 'bubble_members_select_accessible') THEN
    EXECUTE 'CREATE POLICY "bubble_members_select_accessible" ON public.bubble_members FOR SELECT USING (auth.role() = ''authenticated'' AND public.can_access_bubble(bubble_id))';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'bubble_members' AND policyname = 'bubble_members_insert_admin_or_creator') THEN
    EXECUTE 'CREATE POLICY "bubble_members_insert_admin_or_creator" ON public.bubble_members FOR INSERT WITH CHECK (auth.role() = ''authenticated'' AND (public.is_bubble_admin(bubble_id) OR (auth.uid() = user_id AND role = ''owner'' AND EXISTS (SELECT 1 FROM public.bubbles b WHERE b.id = bubble_id AND b.created_by = auth.uid()))))';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'bubble_members' AND policyname = 'bubble_members_update_admin') THEN
    EXECUTE 'CREATE POLICY "bubble_members_update_admin" ON public.bubble_members FOR UPDATE USING (auth.role() = ''authenticated'' AND public.is_bubble_admin(bubble_id)) WITH CHECK (auth.role() = ''authenticated'' AND public.is_bubble_admin(bubble_id))';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'bubble_members' AND policyname = 'bubble_members_delete_admin') THEN
    EXECUTE 'CREATE POLICY "bubble_members_delete_admin" ON public.bubble_members FOR DELETE USING (auth.role() = ''authenticated'' AND public.is_bubble_admin(bubble_id))';
  END IF;

  -- Invitations
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'bubble_invitations' AND policyname = 'bubble_invitations_select_admin_or_email') THEN
    EXECUTE 'CREATE POLICY "bubble_invitations_select_admin_or_email" ON public.bubble_invitations FOR SELECT USING (auth.role() = ''authenticated'' AND (public.is_bubble_admin(bubble_id) OR accepted_by = auth.uid() OR (email IS NOT NULL AND lower(email) = lower(coalesce(auth.jwt() ->> ''email'', '''')))))';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'bubble_invitations' AND policyname = 'bubble_invitations_insert_admin') THEN
    EXECUTE 'CREATE POLICY "bubble_invitations_insert_admin" ON public.bubble_invitations FOR INSERT WITH CHECK (auth.role() = ''authenticated'' AND public.is_bubble_admin(bubble_id))';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'bubble_invitations' AND policyname = 'bubble_invitations_update_admin') THEN
    EXECUTE 'CREATE POLICY "bubble_invitations_update_admin" ON public.bubble_invitations FOR UPDATE USING (auth.role() = ''authenticated'' AND public.is_bubble_admin(bubble_id)) WITH CHECK (auth.role() = ''authenticated'' AND public.is_bubble_admin(bubble_id))';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'bubble_invitations' AND policyname = 'bubble_invitations_delete_admin') THEN
    EXECUTE 'CREATE POLICY "bubble_invitations_delete_admin" ON public.bubble_invitations FOR DELETE USING (auth.role() = ''authenticated'' AND public.is_bubble_admin(bubble_id))';
  END IF;

  -- Posts
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'posts' AND policyname = 'posts_select_member_or_luciole') THEN
    EXECUTE 'CREATE POLICY "posts_select_member_or_luciole" ON public.posts FOR SELECT USING (auth.role() = ''authenticated'' AND public.can_access_bubble(bubble_id))';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'posts' AND policyname = 'posts_insert_member') THEN
    EXECUTE 'CREATE POLICY "posts_insert_member" ON public.posts FOR INSERT WITH CHECK (auth.role() = ''authenticated'' AND author_id = auth.uid() AND public.is_bubble_member(bubble_id))';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'posts' AND policyname = 'posts_update_author_or_admin') THEN
    EXECUTE 'CREATE POLICY "posts_update_author_or_admin" ON public.posts FOR UPDATE USING (auth.role() = ''authenticated'' AND (author_id = auth.uid() OR public.is_bubble_admin(bubble_id))) WITH CHECK (auth.role() = ''authenticated'' AND (author_id = auth.uid() OR public.is_bubble_admin(bubble_id)))';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'posts' AND policyname = 'posts_delete_author_or_admin') THEN
    EXECUTE 'CREATE POLICY "posts_delete_author_or_admin" ON public.posts FOR DELETE USING (auth.role() = ''authenticated'' AND (author_id = auth.uid() OR public.is_bubble_admin(bubble_id)))';
  END IF;

  -- Comments
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'comments' AND policyname = 'comments_select_member_or_luciole') THEN
    EXECUTE 'CREATE POLICY "comments_select_member_or_luciole" ON public.comments FOR SELECT USING (auth.role() = ''authenticated'' AND public.can_access_bubble(bubble_id))';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'comments' AND policyname = 'comments_insert_member') THEN
    EXECUTE 'CREATE POLICY "comments_insert_member" ON public.comments FOR INSERT WITH CHECK (auth.role() = ''authenticated'' AND author_id = auth.uid() AND public.is_bubble_member(bubble_id))';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'comments' AND policyname = 'comments_update_author_or_admin') THEN
    EXECUTE 'CREATE POLICY "comments_update_author_or_admin" ON public.comments FOR UPDATE USING (auth.role() = ''authenticated'' AND (author_id = auth.uid() OR public.is_bubble_admin(bubble_id))) WITH CHECK (auth.role() = ''authenticated'' AND (author_id = auth.uid() OR public.is_bubble_admin(bubble_id)))';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'comments' AND policyname = 'comments_delete_author_or_admin') THEN
    EXECUTE 'CREATE POLICY "comments_delete_author_or_admin" ON public.comments FOR DELETE USING (auth.role() = ''authenticated'' AND (author_id = auth.uid() OR public.is_bubble_admin(bubble_id)))';
  END IF;
END $$;

DO $$
BEGIN
  -- Notifications
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'notifications' AND policyname = 'notifications_select_own') THEN
    EXECUTE 'CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT USING (auth.role() = ''authenticated'' AND user_id = auth.uid())';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'notifications' AND policyname = 'notifications_insert_actor_or_target') THEN
    EXECUTE 'CREATE POLICY "notifications_insert_actor_or_target" ON public.notifications FOR INSERT WITH CHECK (auth.role() = ''authenticated'' AND (actor_id = auth.uid() OR user_id = auth.uid()))';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'notifications' AND policyname = 'notifications_update_own') THEN
    EXECUTE 'CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE USING (auth.role() = ''authenticated'' AND user_id = auth.uid()) WITH CHECK (auth.role() = ''authenticated'' AND user_id = auth.uid())';
  END IF;

  -- Reports
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'reports' AND policyname = 'reports_select_admin') THEN
    EXECUTE 'CREATE POLICY "reports_select_admin" ON public.reports FOR SELECT USING (auth.role() = ''authenticated'' AND public.is_bubble_admin(bubble_id))';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'reports' AND policyname = 'reports_insert_member') THEN
    EXECUTE 'CREATE POLICY "reports_insert_member" ON public.reports FOR INSERT WITH CHECK (auth.role() = ''authenticated'' AND reporter_id = auth.uid() AND public.is_bubble_member(bubble_id))';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'reports' AND policyname = 'reports_update_admin') THEN
    EXECUTE 'CREATE POLICY "reports_update_admin" ON public.reports FOR UPDATE USING (auth.role() = ''authenticated'' AND public.is_bubble_admin(bubble_id)) WITH CHECK (auth.role() = ''authenticated'' AND public.is_bubble_admin(bubble_id))';
  END IF;

  -- Blocks
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'blocks' AND policyname = 'blocks_select_own') THEN
    EXECUTE 'CREATE POLICY "blocks_select_own" ON public.blocks FOR SELECT USING (auth.role() = ''authenticated'' AND blocker_id = auth.uid())';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'blocks' AND policyname = 'blocks_insert_own') THEN
    EXECUTE 'CREATE POLICY "blocks_insert_own" ON public.blocks FOR INSERT WITH CHECK (auth.role() = ''authenticated'' AND blocker_id = auth.uid())';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'blocks' AND policyname = 'blocks_delete_own') THEN
    EXECUTE 'CREATE POLICY "blocks_delete_own" ON public.blocks FOR DELETE USING (auth.role() = ''authenticated'' AND blocker_id = auth.uid())';
  END IF;

  -- Bubble lucioles
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'bubble_lucioles' AND policyname = 'bubble_lucioles_select_accessible') THEN
    EXECUTE 'CREATE POLICY "bubble_lucioles_select_accessible" ON public.bubble_lucioles FOR SELECT USING (auth.role() = ''authenticated'' AND (public.can_access_bubble(bubble_id) OR EXISTS (SELECT 1 FROM public.lucioles l WHERE l.id = luciole_id AND l.user_id = auth.uid())))';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'bubble_lucioles' AND policyname = 'bubble_lucioles_insert_admin') THEN
    EXECUTE 'CREATE POLICY "bubble_lucioles_insert_admin" ON public.bubble_lucioles FOR INSERT WITH CHECK (auth.role() = ''authenticated'' AND public.is_bubble_admin(bubble_id) AND EXISTS (SELECT 1 FROM public.lucioles l WHERE l.id = luciole_id AND l.status = ''approved''))';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'bubble_lucioles' AND policyname = 'bubble_lucioles_delete_admin') THEN
    EXECUTE 'CREATE POLICY "bubble_lucioles_delete_admin" ON public.bubble_lucioles FOR DELETE USING (auth.role() = ''authenticated'' AND public.is_bubble_admin(bubble_id))';
  END IF;

  -- Boxes
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'boxes' AND policyname = 'boxes_select_public') THEN
    EXECUTE 'CREATE POLICY "boxes_select_public" ON public.boxes FOR SELECT USING (is_active = true OR auth.role() = ''service_role'')';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'boxes' AND policyname = 'boxes_insert_service_only') THEN
    EXECUTE 'CREATE POLICY "boxes_insert_service_only" ON public.boxes FOR INSERT WITH CHECK (auth.role() = ''service_role'')';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'boxes' AND policyname = 'boxes_update_service_only') THEN
    EXECUTE 'CREATE POLICY "boxes_update_service_only" ON public.boxes FOR UPDATE USING (auth.role() = ''service_role'') WITH CHECK (auth.role() = ''service_role'')';
  END IF;

  -- Box recommendations
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'box_recommendations' AND policyname = 'box_recommendations_select_bubble_access') THEN
    EXECUTE 'CREATE POLICY "box_recommendations_select_bubble_access" ON public.box_recommendations FOR SELECT USING (auth.role() = ''authenticated'' AND public.can_access_bubble(bubble_id))';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'box_recommendations' AND policyname = 'box_recommendations_insert_admin') THEN
    EXECUTE 'CREATE POLICY "box_recommendations_insert_admin" ON public.box_recommendations FOR INSERT WITH CHECK (auth.role() = ''authenticated'' AND public.is_bubble_admin(bubble_id))';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'box_recommendations' AND policyname = 'box_recommendations_update_admin') THEN
    EXECUTE 'CREATE POLICY "box_recommendations_update_admin" ON public.box_recommendations FOR UPDATE USING (auth.role() = ''authenticated'' AND public.is_bubble_admin(bubble_id)) WITH CHECK (auth.role() = ''authenticated'' AND public.is_bubble_admin(bubble_id))';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'box_recommendations' AND policyname = 'box_recommendations_delete_admin') THEN
    EXECUTE 'CREATE POLICY "box_recommendations_delete_admin" ON public.box_recommendations FOR DELETE USING (auth.role() = ''authenticated'' AND public.is_bubble_admin(bubble_id))';
  END IF;

  -- Orders social access
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'orders' AND policyname = 'orders_social_select_bubble_access') THEN
    EXECUTE 'CREATE POLICY "orders_social_select_bubble_access" ON public.orders FOR SELECT USING (auth.role() = ''authenticated'' AND bubble_id IS NOT NULL AND public.can_access_bubble(bubble_id))';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'orders' AND policyname = 'orders_social_insert_member') THEN
    EXECUTE 'CREATE POLICY "orders_social_insert_member" ON public.orders FOR INSERT WITH CHECK (auth.role() = ''authenticated'' AND user_id = auth.uid() AND (bubble_id IS NULL OR public.is_bubble_member(bubble_id)))';
  END IF;
END $$;

DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
  EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_object THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
  EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_object THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_object THEN NULL;
  END;
END $$;
