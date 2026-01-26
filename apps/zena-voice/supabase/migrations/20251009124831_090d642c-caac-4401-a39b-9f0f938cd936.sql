-- ============================================
-- MIGRATION : Contenus éducatifs et outils QVT
-- ============================================

-- Table : Textes de loi QVT
CREATE TABLE IF NOT EXISTS public.legal_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  reference TEXT NOT NULL, -- "Article L4121-1"
  category TEXT NOT NULL CHECK (category IN ('obligation', 'droit', 'prevention')),
  summary TEXT NOT NULL,
  full_text TEXT NOT NULL,
  effective_date DATE NOT NULL,
  related_topics TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table : Articles de blog bien-être
CREATE TABLE IF NOT EXISTS public.blog_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('stress', 'burnout', 'nutrition', 'sleep', 'exercise', 'mental-health')),
  author TEXT NOT NULL DEFAULT 'ZÉNA',
  read_time INTEGER NOT NULL, -- en minutes
  published_at TIMESTAMPTZ NOT NULL,
  thumbnail TEXT,
  summary TEXT NOT NULL,
  content TEXT NOT NULL, -- Markdown
  tags TEXT[] DEFAULT '{}',
  related_articles TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table : Conseils santé express
CREATE TABLE IF NOT EXISTS public.health_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('hydration', 'posture', 'breathing', 'break', 'sleep')),
  icon TEXT NOT NULL,
  short_description TEXT NOT NULL,
  actionable_tip TEXT NOT NULL,
  frequency TEXT CHECK (frequency IN ('daily', 'hourly', 'weekly')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table : Résultats des tests burnout
CREATE TABLE IF NOT EXISTS public.burnout_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT now(),
  personal_score INTEGER NOT NULL,
  work_score INTEGER NOT NULL,
  client_score INTEGER NOT NULL,
  total_score INTEGER NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'moderate', 'high', 'critical')),
  zena_insight TEXT,
  recommendations TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table : Check-lists vacances
CREATE TABLE IF NOT EXISTS public.vacation_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  items_checked INTEGER NOT NULL DEFAULT 0,
  total_items INTEGER NOT NULL DEFAULT 7,
  completion_percentage INTEGER GENERATED ALWAYS AS ((items_checked * 100) / NULLIF(total_items, 0)) STORED
);

-- Table : Check-ins quotidiens stress
CREATE TABLE IF NOT EXISTS public.daily_stress_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  checkin_date DATE NOT NULL,
  mood_emoji TEXT NOT NULL,
  energy_level INTEGER NOT NULL CHECK (energy_level >= 0 AND energy_level <= 10),
  keyword TEXT,
  sleep_quality TEXT CHECK (sleep_quality IN ('good', 'medium', 'poor')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, checkin_date) -- Un seul check-in par jour
);

-- Table : Historique de lecture d'articles
CREATE TABLE IF NOT EXISTS public.user_article_reads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id UUID REFERENCES public.blog_articles(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT now(),
  read_duration INTEGER, -- secondes
  UNIQUE(user_id, article_id) -- Un utilisateur ne peut lire un article qu'une fois (comptabilisé)
);

-- ============================================
-- RLS POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.legal_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.burnout_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vacation_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_stress_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_article_reads ENABLE ROW LEVEL SECURITY;

-- Contenus éducatifs : lecture publique (pas d'authentification requise)
CREATE POLICY "Anyone can view legal contents"
  ON public.legal_contents FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view blog articles"
  ON public.blog_articles FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view health tips"
  ON public.health_tips FOR SELECT
  USING (true);

-- Tests burnout : utilisateur peut créer et voir ses propres tests
CREATE POLICY "Users can insert their own burnout tests"
  ON public.burnout_tests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own burnout tests"
  ON public.burnout_tests FOR SELECT
  USING (auth.uid() = user_id);

-- Checklists vacances : utilisateur peut gérer ses propres checklists
CREATE POLICY "Users can manage their own vacation checklists"
  ON public.vacation_checklists FOR ALL
  USING (auth.uid() = user_id);

-- Check-ins stress : utilisateur peut gérer ses propres check-ins
CREATE POLICY "Users can manage their own stress checkins"
  ON public.daily_stress_checkins FOR ALL
  USING (auth.uid() = user_id);

-- Historique de lecture : utilisateur peut gérer son historique
CREATE POLICY "Users can manage their own article reads"
  ON public.user_article_reads FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- TRIGGERS pour updated_at
-- ============================================

CREATE TRIGGER update_legal_contents_updated_at
  BEFORE UPDATE ON public.legal_contents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_articles_updated_at
  BEFORE UPDATE ON public.blog_articles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_health_tips_updated_at
  BEFORE UPDATE ON public.health_tips
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- INDEXES pour performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_blog_articles_slug ON public.blog_articles(slug);
CREATE INDEX IF NOT EXISTS idx_blog_articles_category ON public.blog_articles(category);
CREATE INDEX IF NOT EXISTS idx_blog_articles_published_at ON public.blog_articles(published_at DESC);

CREATE INDEX IF NOT EXISTS idx_burnout_tests_user_id ON public.burnout_tests(user_id);
CREATE INDEX IF NOT EXISTS idx_burnout_tests_completed_at ON public.burnout_tests(completed_at DESC);

CREATE INDEX IF NOT EXISTS idx_daily_stress_checkins_user_date ON public.daily_stress_checkins(user_id, checkin_date DESC);

CREATE INDEX IF NOT EXISTS idx_user_article_reads_user_id ON public.user_article_reads(user_id);

-- ============================================
-- FIN MIGRATION
-- ============================================