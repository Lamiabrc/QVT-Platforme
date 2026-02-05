-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for user roles (SECURITY)
CREATE TYPE public.app_role AS ENUM ('parent', 'ado');

-- Create enum for family member roles
CREATE TYPE public.family_role AS ENUM ('parent', 'ado', 'enfant', 'parrain', 'tuteur', 'autre');

-- Create enum for emotion types
CREATE TYPE public.emotion_type AS ENUM ('calme', 'fatigue', 'joie', 'stress', 'motivation', 'tristesse', 'colere', 'anxiete');

-- Create enum for weather types
CREATE TYPE public.weather_type AS ENUM ('soleil', 'nuages', 'pluie', 'eclaircies');

-- Create enum for nudge types
CREATE TYPE public.nudge_type AS ENUM ('message', 'drawing', 'sound');

-- Table: user_roles (CRITICAL FOR SECURITY)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Table: profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Table: family_groups
CREATE TABLE public.family_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.family_groups ENABLE ROW LEVEL SECURITY;

-- Table: family_members
CREATE TABLE public.family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES public.family_groups(id) ON DELETE CASCADE NOT NULL,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role family_role NOT NULL,
  display_name TEXT NOT NULL,
  age_range TEXT,
  is_account_holder BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

-- Table: emotions
CREATE TABLE public.emotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_member_id UUID REFERENCES public.family_members(id) ON DELETE CASCADE NOT NULL,
  emotion emotion_type NOT NULL,
  intensity INT CHECK (intensity >= 1 AND intensity <= 15) NOT NULL,
  note TEXT,
  color TEXT NOT NULL,
  is_shared BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.emotions ENABLE ROW LEVEL SECURITY;

-- Table: conversations
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_member_id UUID REFERENCES public.family_members(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  started_at TIMESTAMPTZ DEFAULT now(),
  last_message_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Table: messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
  content TEXT NOT NULL,
  emotion_detected TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Table: family_nudges (coups de pouce)
CREATE TABLE public.family_nudges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_member_id UUID REFERENCES public.family_members(id) ON DELETE CASCADE NOT NULL,
  to_member_id UUID REFERENCES public.family_members(id) ON DELETE CASCADE NOT NULL,
  type nudge_type NOT NULL,
  content TEXT NOT NULL,
  media_url TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.family_nudges ENABLE ROW LEVEL SECURITY;

-- Table: shared_journal
CREATE TABLE public.shared_journal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES public.family_groups(id) ON DELETE CASCADE NOT NULL,
  member_id UUID REFERENCES public.family_members(id) ON DELETE CASCADE NOT NULL,
  weather weather_type NOT NULL,
  content TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.shared_journal ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for family_groups
CREATE POLICY "Users can view families they belong to"
  ON public.family_groups FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE family_members.family_id = family_groups.id
        AND family_members.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can create family groups"
  ON public.family_groups FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Family creators can update their families"
  ON public.family_groups FOR UPDATE
  USING (auth.uid() = created_by);

-- RLS Policies for family_members
CREATE POLICY "Users can view members of their families"
  ON public.family_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members fm
      WHERE fm.family_id = family_members.family_id
        AND fm.profile_id = auth.uid()
    )
  );

CREATE POLICY "Parents can add family members"
  ON public.family_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'parent'
    )
  );

CREATE POLICY "Users can update their own member profile"
  ON public.family_members FOR UPDATE
  USING (profile_id = auth.uid());

-- RLS Policies for emotions
CREATE POLICY "Users can view emotions in their families"
  ON public.emotions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members fm1
      JOIN public.family_members fm2 ON fm1.family_id = fm2.family_id
      WHERE fm1.profile_id = auth.uid()
        AND fm2.id = emotions.family_member_id
        AND emotions.is_shared = true
    )
    OR
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE family_members.id = emotions.family_member_id
        AND family_members.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own emotions"
  ON public.emotions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE family_members.id = family_member_id
        AND family_members.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own emotions"
  ON public.emotions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE family_members.id = family_member_id
        AND family_members.profile_id = auth.uid()
    )
  );

-- RLS Policies for conversations
CREATE POLICY "Users can view their own conversations"
  ON public.conversations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE family_members.id = family_member_id
        AND family_members.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can create conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE family_members.id = family_member_id
        AND family_members.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own conversations"
  ON public.conversations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE family_members.id = family_member_id
        AND family_members.profile_id = auth.uid()
    )
  );

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their conversations"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      JOIN public.family_members fm ON c.family_member_id = fm.id
      WHERE c.id = conversation_id
        AND fm.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in their conversations"
  ON public.messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations c
      JOIN public.family_members fm ON c.family_member_id = fm.id
      WHERE c.id = conversation_id
        AND fm.profile_id = auth.uid()
    )
  );

-- RLS Policies for family_nudges
CREATE POLICY "Users can view nudges sent to them"
  ON public.family_nudges FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE family_members.id = to_member_id
        AND family_members.profile_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE family_members.id = from_member_id
        AND family_members.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can send nudges to family members"
  ON public.family_nudges FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.family_members fm1
      JOIN public.family_members fm2 ON fm1.family_id = fm2.family_id
      WHERE fm1.id = from_member_id
        AND fm1.profile_id = auth.uid()
        AND fm2.id = to_member_id
    )
  );

CREATE POLICY "Users can update nudges sent to them"
  ON public.family_nudges FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE family_members.id = to_member_id
        AND family_members.profile_id = auth.uid()
    )
  );

-- RLS Policies for shared_journal
CREATE POLICY "Users can view journal entries in their families"
  ON public.shared_journal FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE family_members.family_id = shared_journal.family_id
        AND family_members.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can create journal entries in their families"
  ON public.shared_journal FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE family_members.id = member_id
        AND family_members.profile_id = auth.uid()
        AND family_members.family_id = family_id
    )
  );

CREATE POLICY "Users can update their own journal entries"
  ON public.shared_journal FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE family_members.id = member_id
        AND family_members.profile_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for messages (for chat)
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;