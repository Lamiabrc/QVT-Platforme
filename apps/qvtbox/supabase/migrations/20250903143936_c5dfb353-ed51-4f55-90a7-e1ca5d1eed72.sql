-- Create evaluation and alert system for QVT Box (without accents)

-- Question bank for continuous evaluation
CREATE TABLE public.question_bank (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  axis TEXT NOT NULL CHECK (axis IN ('charge_rythme', 'penibilite_ergonomie', 'climat_reconnaissance', 'deconnexion_tension', 'humeur_energie')),
  text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('likert_5', 'smiley_5', 'yes_no', 'open_text')),
  weight NUMERIC DEFAULT 1.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Mood checks (evaluation sessions)
CREATE TABLE public.mood_checks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Individual answers
CREATE TABLE public.mood_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  check_id UUID NOT NULL REFERENCES public.mood_checks(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.question_bank(id) ON DELETE CASCADE,
  value NUMERIC, -- For Likert scales and smiley ratings
  text_value TEXT, -- For open text responses
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Risk scores calculated from answers
CREATE TABLE public.risk_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  overall_score NUMERIC NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  charge_rythme_score NUMERIC,
  penibilite_ergonomie_score NUMERIC,
  climat_reconnaissance_score NUMERIC,
  deconnexion_tension_score NUMERIC,
  humeur_energie_score NUMERIC,
  top_risk_axis TEXT,
  trend_direction TEXT CHECK (trend_direction IN ('up', 'down', 'stable')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Alerts for individuals
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('amber', 'red')),
  primary_axis TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'acknowledged', 'in_progress', 'resolved')),
  user_consent BOOLEAN DEFAULT false,
  target_role TEXT CHECK (target_role IN ('hr', 'manager', 'cse', 'qvt_referent')),
  anonymized_message BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Resources library
CREATE TABLE public.resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  axis TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT CHECK (resource_type IN ('guide', 'hotline', 'workshop', 'box_product', 'external_link')),
  url TEXT,
  audience TEXT CHECK (audience IN ('employee', 'manager', 'hr', 'all')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Organization settings for thresholds and parameters
CREATE TABLE public.org_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID,
  amber_threshold NUMERIC DEFAULT 40,
  red_threshold NUMERIC DEFAULT 60,
  min_sample_size INTEGER DEFAULT 5,
  evaluation_frequency_days INTEGER DEFAULT 7,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.question_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for question_bank
CREATE POLICY "Anyone can view active questions" ON public.question_bank
  FOR SELECT USING (is_active = true);

CREATE POLICY "Only admins can manage questions" ON public.question_bank
  FOR ALL USING (is_user_admin(auth.uid()));

-- RLS Policies for mood_checks
CREATE POLICY "Users can view their own checks" ON public.mood_checks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own checks" ON public.mood_checks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for mood_answers
CREATE POLICY "Users can manage their own answers" ON public.mood_answers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM mood_checks 
      WHERE mood_checks.id = mood_answers.check_id 
      AND mood_checks.user_id = auth.uid()
    )
  );

-- RLS Policies for risk_scores
CREATE POLICY "Users can view their own scores" ON public.risk_scores
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create and update scores" ON public.risk_scores
  FOR ALL USING (true);

-- RLS Policies for alerts
CREATE POLICY "Users can view their own alerts" ON public.alerts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their consent" ON public.alerts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create alerts" ON public.alerts
  FOR INSERT WITH CHECK (true);

-- RLS Policies for resources
CREATE POLICY "Everyone can view active resources" ON public.resources
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage resources" ON public.resources
  FOR ALL USING (is_user_admin(auth.uid()));

-- RLS Policies for org_settings
CREATE POLICY "Admins can manage org settings" ON public.org_settings
  FOR ALL USING (is_user_admin(auth.uid()));

-- Insert sample questions (without accents)
INSERT INTO public.question_bank (axis, text, question_type, weight) VALUES
-- Charge & Rythme
('charge_rythme', 'Comment evaluez-vous votre charge de travail actuelle ?', 'likert_5', 1.0),
('charge_rythme', 'Avez-vous suffisamment de temps pour realiser correctement vos taches ?', 'likert_5', 1.2),
('charge_rythme', 'Les imprevus perturbent-ils regulierement votre organisation ?', 'likert_5', 1.0),

-- Penibilite & Ergonomie
('penibilite_ergonomie', 'Ressentez-vous des genes physiques liees a votre travail ?', 'likert_5', 1.5),
('penibilite_ergonomie', 'Votre poste de travail est-il adapte a vos besoins ?', 'likert_5', 1.0),
('penibilite_ergonomie', 'Recuperez-vous suffisamment entre les journees de travail ?', 'likert_5', 1.0),

-- Climat & reconnaissance
('climat_reconnaissance', 'Vous sentez-vous soutenu(e) par votre equipe ?', 'likert_5', 1.0),
('climat_reconnaissance', 'Votre travail est-il reconnu a sa juste valeur ?', 'likert_5', 1.3),
('climat_reconnaissance', 'Les relations avec votre hierarchie sont-elles satisfaisantes ?', 'likert_5', 1.0),

-- Deconnexion & tension
('deconnexion_tension', 'Arrivez-vous a deconnecter en dehors des heures de travail ?', 'likert_5', 1.2),
('deconnexion_tension', 'Les sollicitations numeriques vous derangent-elles hors du travail ?', 'likert_5', 1.0),

-- Humeur & energie  
('humeur_energie', 'Comment decririez-vous votre niveau d energie au travail ?', 'smiley_5', 1.0),
('humeur_energie', 'Vous sentez-vous epuise(e) en fin de journee ?', 'likert_5', 1.0);

-- Insert sample resources
INSERT INTO public.resources (axis, title, description, resource_type, audience) VALUES
('charge_rythme', 'Guide ANACT - Gestion de la charge de travail', 'Methodes pour evaluer et reguler la charge de travail', 'guide', 'manager'),
('penibilite_ergonomie', 'Fiche INRS - Amenagement du poste de travail', 'Conseils ergonomiques pour prevenir les TMS', 'guide', 'employee'),
('climat_reconnaissance', 'Atelier Reconnaissance au travail', 'Formation sur les pratiques de reconnaissance', 'workshop', 'manager'),
('deconnexion_tension', 'Charte du droit a la deconnexion', 'Cadre legal et bonnes pratiques', 'guide', 'all'),
('humeur_energie', 'Box QVT Focus & Reset', 'Produits pour recuperation et gestion du stress', 'box_product', 'employee');

-- Add unique constraint to prevent duplicate risk scores
ALTER TABLE public.risk_scores 
ADD CONSTRAINT unique_user_period UNIQUE (user_id, period_start, period_end);