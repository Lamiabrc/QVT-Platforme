-- Create evaluation and alert system for QVT Box

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

CREATE POLICY "Managers can view team checks (aggregated)" ON public.mood_checks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM enterprise_members em1
      JOIN enterprise_members em2 ON em1.enterprise_id = em2.enterprise_id
      WHERE em1.user_id = auth.uid() 
      AND em1.role IN ('manager', 'hr', 'admin')
      AND em2.user_id = mood_checks.user_id
      AND em1.is_approved = true
      AND em2.is_approved = true
    )
  );

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

CREATE POLICY "Managers can view aggregated team scores" ON public.risk_scores
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM enterprise_members em1
      JOIN enterprise_members em2 ON em1.enterprise_id = em2.enterprise_id
      WHERE em1.user_id = auth.uid() 
      AND em1.role IN ('manager', 'hr', 'admin')
      AND em2.user_id = risk_scores.user_id
      AND em1.is_approved = true
      AND em2.is_approved = true
    )
  );

-- RLS Policies for alerts
CREATE POLICY "Users can view their own alerts" ON public.alerts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their consent" ON public.alerts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "HR/Managers can view consented alerts" ON public.alerts
  FOR SELECT USING (
    user_consent = true AND
    EXISTS (
      SELECT 1 FROM enterprise_members em1
      JOIN enterprise_members em2 ON em1.enterprise_id = em2.enterprise_id
      WHERE em1.user_id = auth.uid() 
      AND em1.role IN ('manager', 'hr', 'admin')
      AND em2.user_id = alerts.user_id
      AND em1.is_approved = true
      AND em2.is_approved = true
    )
  );

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

-- Insert sample questions
INSERT INTO public.question_bank (axis, text, question_type, weight) VALUES
-- Charge & Rythme
('charge_rythme', 'Comment évaluez-vous votre charge de travail actuelle ?', 'likert_5', 1.0),
('charge_rythme', 'Avez-vous suffisamment de temps pour réaliser correctement vos tâches ?', 'likert_5', 1.2),
('charge_rythme', 'Les imprévus perturbent-ils régulièrement votre organisation ?', 'likert_5', 1.0),

-- Pénibilité & Ergonomie
('penibilite_ergonomie', 'Ressentez-vous des gênes physiques liées à votre travail ?', 'likert_5', 1.5),
('penibilite_ergonomie', 'Votre poste de travail est-il adapté à vos besoins ?', 'likert_5', 1.0),
('penibilite_ergonomie', 'Récupérez-vous suffisamment entre les journées de travail ?', 'likert_5', 1.0),

-- Climat & reconnaissance
('climat_reconnaissance', 'Vous sentez-vous soutenu(e) par votre équipe ?', 'likert_5', 1.0),
('climat_reconnaissance', 'Votre travail est-il reconnu à sa juste valeur ?', 'likert_5', 1.3),
('climat_reconnaissance', 'Les relations avec votre hiérarchie sont-elles satisfaisantes ?', 'likert_5', 1.0),

-- Déconnexion & tension
('deconnexion_tension', 'Arrivez-vous à déconnecter en dehors des heures de travail ?', 'likert_5', 1.2),
('deconnexion_tension', 'Les sollicitations numériques vous dérangent-elles hors du travail ?', 'likert_5', 1.0),

-- Humeur & énergie  
('humeur_energie', 'Comment décririez-vous votre niveau d\'énergie au travail ?', 'smiley_5', 1.0),
('humeur_energie', 'Vous sentez-vous épuisé(e) en fin de journée ?', 'likert_5', 1.0);

-- Insert sample resources
INSERT INTO public.resources (axis, title, description, resource_type, audience) VALUES
('charge_rythme', 'Guide ANACT - Gestion de la charge de travail', 'Méthodes pour évaluer et réguler la charge de travail', 'guide', 'manager'),
('penibilite_ergonomie', 'Fiche INRS - Aménagement du poste de travail', 'Conseils ergonomiques pour prévenir les TMS', 'guide', 'employee'),
('climat_reconnaissance', 'Atelier Reconnaissance au travail', 'Formation sur les pratiques de reconnaissance', 'workshop', 'manager'),
('deconnexion_tension', 'Charte du droit à la déconnexion', 'Cadre légal et bonnes pratiques', 'guide', 'all'),
('humeur_energie', 'Box QVT Focus & Reset', 'Produits pour récupération et gestion du stress', 'box_product', 'employee');

-- Triggers for automatic scoring calculation
CREATE OR REPLACE FUNCTION calculate_risk_scores()
RETURNS TRIGGER AS $$
DECLARE
    check_record RECORD;
    axis_scores JSONB := '{}';
    overall_score NUMERIC := 0;
    axis_name TEXT;
    axis_score NUMERIC;
    top_axis TEXT;
    max_score NUMERIC := 0;
BEGIN
    -- Get the mood check info
    SELECT * INTO check_record FROM mood_checks WHERE id = NEW.check_id;
    
    -- Calculate scores for each axis
    FOR axis_name IN SELECT DISTINCT qb.axis FROM question_bank qb 
                     JOIN mood_answers ma ON qb.id = ma.question_id 
                     WHERE ma.check_id = NEW.check_id LOOP
        
        SELECT AVG(ma.value * qb.weight) INTO axis_score
        FROM mood_answers ma
        JOIN question_bank qb ON ma.question_id = qb.id
        WHERE ma.check_id = NEW.check_id AND qb.axis = axis_name;
        
        -- Convert to 0-100 scale (assuming 1-5 Likert scale)
        axis_score := (axis_score - 1) * 25;
        
        axis_scores := axis_scores || jsonb_build_object(axis_name, axis_score);
        
        IF axis_score > max_score THEN
            max_score := axis_score;
            top_axis := axis_name;
        END IF;
        
        overall_score := overall_score + axis_score;
    END LOOP;
    
    -- Average the axis scores
    overall_score := overall_score / 5;
    
    -- Insert or update risk score
    INSERT INTO risk_scores (
        user_id, period_start, period_end, overall_score,
        charge_rythme_score, penibilite_ergonomie_score, 
        climat_reconnaissance_score, deconnexion_tension_score, 
        humeur_energie_score, top_risk_axis
    ) VALUES (
        check_record.user_id, check_record.period_start, check_record.period_end, 
        overall_score,
        (axis_scores->>'charge_rythme')::NUMERIC,
        (axis_scores->>'penibilite_ergonomie')::NUMERIC,
        (axis_scores->>'climat_reconnaissance')::NUMERIC,
        (axis_scores->>'deconnexion_tension')::NUMERIC,
        (axis_scores->>'humeur_energie')::NUMERIC,
        top_axis
    )
    ON CONFLICT (user_id, period_start, period_end) 
    DO UPDATE SET
        overall_score = EXCLUDED.overall_score,
        charge_rythme_score = EXCLUDED.charge_rythme_score,
        penibilite_ergonomie_score = EXCLUDED.penibilite_ergonomie_score,
        climat_reconnaissance_score = EXCLUDED.climat_reconnaissance_score,
        deconnexion_tension_score = EXCLUDED.deconnexion_tension_score,
        humeur_energie_score = EXCLUDED.humeur_energie_score,
        top_risk_axis = EXCLUDED.top_risk_axis,
        updated_at = now();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_scores_trigger
    AFTER INSERT OR UPDATE ON mood_answers
    FOR EACH ROW
    EXECUTE FUNCTION calculate_risk_scores();

-- Add unique constraint to prevent duplicate risk scores
ALTER TABLE public.risk_scores 
ADD CONSTRAINT unique_user_period UNIQUE (user_id, period_start, period_end);