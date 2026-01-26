-- Tables pour la collecte de données ZÉNA/ZÉNO

-- 1. Sessions de conversation
CREATE TABLE public.conversation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  persona TEXT NOT NULL CHECK (persona IN ('zena', 'zeno')),
  language TEXT NOT NULL DEFAULT 'fr-FR',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  message_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Messages de conversation
CREATE TABLE public.conversation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.conversation_sessions(id) ON DELETE CASCADE,
  from_role TEXT NOT NULL CHECK (from_role IN ('user', 'zena', 'zeno')),
  text TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. États émotionnels détectés
CREATE TABLE public.emotional_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.conversation_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  mood TEXT NOT NULL CHECK (mood IN ('positive', 'negative', 'neutral')),
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 15),
  keywords_detected TEXT[] DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Recommandations de box QVT
CREATE TABLE public.box_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.conversation_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  box_name TEXT NOT NULL,
  box_theme TEXT NOT NULL,
  box_description TEXT NOT NULL,
  reason TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index pour performances
CREATE INDEX idx_conversation_sessions_user_id ON public.conversation_sessions(user_id);
CREATE INDEX idx_conversation_sessions_company_id ON public.conversation_sessions(company_id);
CREATE INDEX idx_conversation_sessions_started_at ON public.conversation_sessions(started_at);
CREATE INDEX idx_conversation_messages_session_id ON public.conversation_messages(session_id);
CREATE INDEX idx_emotional_snapshots_session_id ON public.emotional_snapshots(session_id);
CREATE INDEX idx_emotional_snapshots_user_id ON public.emotional_snapshots(user_id);
CREATE INDEX idx_box_recommendations_session_id ON public.box_recommendations(session_id);

-- Enable RLS
ALTER TABLE public.conversation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emotional_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.box_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies pour collecte anonyme

-- conversation_sessions
CREATE POLICY "Anyone can insert sessions" 
  ON public.conversation_sessions FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can view their own sessions" 
  ON public.conversation_sessions FOR SELECT 
  USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can update their own sessions" 
  ON public.conversation_sessions FOR UPDATE 
  USING (user_id = auth.uid() OR user_id IS NULL);

-- conversation_messages
CREATE POLICY "Anyone can insert messages" 
  ON public.conversation_messages FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can view messages from their session" 
  ON public.conversation_messages FOR SELECT 
  USING (
    session_id IN (
      SELECT id FROM public.conversation_sessions 
      WHERE user_id = auth.uid() OR user_id IS NULL
    )
  );

-- emotional_snapshots
CREATE POLICY "Anyone can insert emotional snapshots" 
  ON public.emotional_snapshots FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can view their own emotional data" 
  ON public.emotional_snapshots FOR SELECT 
  USING (user_id = auth.uid() OR user_id IS NULL);

-- box_recommendations
CREATE POLICY "Anyone can insert box recommendations" 
  ON public.box_recommendations FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can view their own recommendations" 
  ON public.box_recommendations FOR SELECT 
  USING (user_id = auth.uid() OR user_id IS NULL);

-- Vue agrégée pour dashboards (score QVT moyen)
CREATE OR REPLACE VIEW public.qvt_analytics AS
SELECT 
  DATE_TRUNC('day', es.timestamp) as date,
  es.user_id,
  cs.company_id,
  cs.persona,
  AVG(es.score) as avg_qvt_score,
  COUNT(DISTINCT cs.id) as session_count,
  COUNT(es.id) as snapshot_count,
  MODE() WITHIN GROUP (ORDER BY es.mood) as dominant_mood
FROM public.emotional_snapshots es
JOIN public.conversation_sessions cs ON es.session_id = cs.id
GROUP BY DATE_TRUNC('day', es.timestamp), es.user_id, cs.company_id, cs.persona;