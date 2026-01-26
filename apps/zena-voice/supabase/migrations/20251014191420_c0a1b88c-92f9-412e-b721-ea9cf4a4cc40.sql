-- ============================================
-- SYSTÈME D'ANALYSE RPS & PRÉVENTION BURNOUT
-- ============================================

-- 1. Table de tracking RPS longitudinal
CREATE TABLE IF NOT EXISTS public.rps_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES conversation_sessions(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Scores RPS (6 dimensions légales) - 0 à 100
  intensity_work_score INT CHECK (intensity_work_score >= 0 AND intensity_work_score <= 100),
  emotional_demands_score INT CHECK (emotional_demands_score >= 0 AND emotional_demands_score <= 100),
  autonomy_score INT CHECK (autonomy_score >= 0 AND autonomy_score <= 100),
  social_relations_score INT CHECK (social_relations_score >= 0 AND social_relations_score <= 100),
  value_conflicts_score INT CHECK (value_conflicts_score >= 0 AND value_conflicts_score <= 100),
  job_insecurity_score INT CHECK (job_insecurity_score >= 0 AND job_insecurity_score <= 100),
  
  -- Indices globaux
  burnout_risk_score INT CHECK (burnout_risk_score >= 0 AND burnout_risk_score <= 100),
  motivation_index INT CHECK (motivation_index >= 0 AND motivation_index <= 100),
  global_risk_level TEXT CHECK (global_risk_level IN ('faible', 'modéré', 'élevé', 'critique')),
  
  -- Patterns détectés
  detected_patterns JSONB DEFAULT '[]'::jsonb,
  keywords_detected TEXT[] DEFAULT '{}',
  
  -- Recommandations générées
  recommended_actions TEXT[] DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX idx_rps_tracking_user_id ON public.rps_tracking(user_id);
CREATE INDEX idx_rps_tracking_timestamp ON public.rps_tracking(timestamp DESC);
CREATE INDEX idx_rps_tracking_risk_level ON public.rps_tracking(global_risk_level);
CREATE INDEX idx_rps_tracking_burnout_score ON public.rps_tracking(burnout_risk_score DESC);

-- RLS pour rps_tracking
ALTER TABLE public.rps_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own RPS tracking"
ON public.rps_tracking FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "System can insert RPS tracking"
ON public.rps_tracking FOR INSERT
WITH CHECK (true);

-- 2. Table d'alertes RH (anonymisées)
CREATE TABLE IF NOT EXISTS public.hr_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  
  alert_level TEXT NOT NULL CHECK (alert_level IN ('modéré', 'élevé', 'critique')),
  alert_type TEXT NOT NULL CHECK (alert_type IN ('burnout', 'démotivation', 'isolement_social', 'surcharge', 'conflits_valeurs')),
  
  -- Données anonymisées
  anonymous_count INT NOT NULL DEFAULT 1, -- Nombre de personnes concernées
  aggregated_data JSONB, -- Données agrégées (jamais de noms)
  
  -- Recommandations
  recommendations JSONB,
  
  -- Suivi
  acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_at TIMESTAMPTZ,
  acknowledged_by UUID REFERENCES auth.users(id),
  
  -- Actions prises
  actions_taken TEXT,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_hr_alerts_company ON public.hr_alerts(company_id);
CREATE INDEX idx_hr_alerts_level ON public.hr_alerts(alert_level);
CREATE INDEX idx_hr_alerts_resolved ON public.hr_alerts(resolved);
CREATE INDEX idx_hr_alerts_created ON public.hr_alerts(created_at DESC);

ALTER TABLE public.hr_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company admins can view their alerts"
ON public.hr_alerts FOR SELECT
USING (
  company_id = get_user_company_id(auth.uid()) 
  AND has_role(auth.uid(), 'company_admin'::app_role)
);

CREATE POLICY "Company admins can update their alerts"
ON public.hr_alerts FOR UPDATE
USING (
  company_id = get_user_company_id(auth.uid()) 
  AND has_role(auth.uid(), 'company_admin'::app_role)
);

CREATE POLICY "System can insert HR alerts"
ON public.hr_alerts FOR INSERT
WITH CHECK (true);

-- 3. Table de logs des interventions
CREATE TABLE IF NOT EXISTS public.intervention_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES conversation_sessions(id) ON DELETE SET NULL,
  
  protocol_key TEXT NOT NULL, -- 'burnout_prevention', 'burnout_intervention', etc.
  protocol_level TEXT CHECK (protocol_level IN ('moderate', 'elevated', 'critical')),
  
  -- Actions exécutées
  actions_taken JSONB NOT NULL, -- Détail des actions du protocole
  
  -- Contexte déclencheur
  trigger_conditions JSONB,
  rps_snapshot JSONB, -- État RPS au moment de l'intervention
  
  -- Résultat
  outcome TEXT CHECK (outcome IN ('successful', 'partial', 'failed', 'pending')),
  user_feedback TEXT, -- Retour utilisateur si disponible
  
  -- Suivi
  follow_up_required BOOLEAN DEFAULT FALSE,
  follow_up_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_intervention_logs_user ON public.intervention_logs(user_id);
CREATE INDEX idx_intervention_logs_protocol ON public.intervention_logs(protocol_key);
CREATE INDEX idx_intervention_logs_outcome ON public.intervention_logs(outcome);
CREATE INDEX idx_intervention_logs_created ON public.intervention_logs(created_at DESC);

ALTER TABLE public.intervention_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own intervention logs"
ON public.intervention_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can insert intervention logs"
ON public.intervention_logs FOR INSERT
WITH CHECK (true);

-- 4. Table pour analytics agrégées (performance)
CREATE TABLE IF NOT EXISTS public.analytics_aggregated (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  
  aggregation_period TEXT NOT NULL CHECK (aggregation_period IN ('daily', 'weekly', 'monthly')),
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  
  -- Métriques RPS moyennes
  avg_burnout_risk NUMERIC(5,2),
  avg_motivation_index NUMERIC(5,2),
  avg_intensity_work NUMERIC(5,2),
  avg_emotional_demands NUMERIC(5,2),
  avg_autonomy NUMERIC(5,2),
  avg_social_relations NUMERIC(5,2),
  avg_value_conflicts NUMERIC(5,2),
  avg_job_insecurity NUMERIC(5,2),
  
  -- Compteurs
  total_users INT,
  at_risk_users INT, -- burnout_risk >= 51
  critical_users INT, -- burnout_risk >= 71
  
  -- Distributions
  risk_distribution JSONB, -- {'faible': 10, 'modéré': 5, ...}
  mood_distribution JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(company_id, department_id, aggregation_period, period_start)
);

CREATE INDEX idx_analytics_company ON public.analytics_aggregated(company_id);
CREATE INDEX idx_analytics_period ON public.analytics_aggregated(period_start DESC);

ALTER TABLE public.analytics_aggregated ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company admins can view aggregated analytics"
ON public.analytics_aggregated FOR SELECT
USING (
  company_id = get_user_company_id(auth.uid()) 
  AND has_role(auth.uid(), 'company_admin'::app_role)
);

-- 5. Fonction pour calculer les analytics agrégées
CREATE OR REPLACE FUNCTION calculate_aggregated_analytics(
  p_company_id UUID,
  p_department_id UUID DEFAULT NULL,
  p_period TEXT DEFAULT 'daily'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_period_start TIMESTAMPTZ;
  v_period_end TIMESTAMPTZ;
BEGIN
  -- Calculer les dates selon la période
  IF p_period = 'daily' THEN
    v_period_start := date_trunc('day', NOW());
    v_period_end := v_period_start + INTERVAL '1 day';
  ELSIF p_period = 'weekly' THEN
    v_period_start := date_trunc('week', NOW());
    v_period_end := v_period_start + INTERVAL '1 week';
  ELSE
    v_period_start := date_trunc('month', NOW());
    v_period_end := v_period_start + INTERVAL '1 month';
  END IF;

  -- Insérer ou mettre à jour les analytics
  INSERT INTO analytics_aggregated (
    company_id,
    department_id,
    aggregation_period,
    period_start,
    period_end,
    avg_burnout_risk,
    avg_motivation_index,
    avg_intensity_work,
    avg_emotional_demands,
    avg_autonomy,
    avg_social_relations,
    avg_value_conflicts,
    avg_job_insecurity,
    total_users,
    at_risk_users,
    critical_users
  )
  SELECT
    p_company_id,
    p_department_id,
    p_period,
    v_period_start,
    v_period_end,
    AVG(rt.burnout_risk_score),
    AVG(rt.motivation_index),
    AVG(rt.intensity_work_score),
    AVG(rt.emotional_demands_score),
    AVG(rt.autonomy_score),
    AVG(rt.social_relations_score),
    AVG(rt.value_conflicts_score),
    AVG(rt.job_insecurity_score),
    COUNT(DISTINCT rt.user_id),
    COUNT(DISTINCT CASE WHEN rt.burnout_risk_score >= 51 THEN rt.user_id END),
    COUNT(DISTINCT CASE WHEN rt.burnout_risk_score >= 71 THEN rt.user_id END)
  FROM rps_tracking rt
  INNER JOIN employees e ON e.id = rt.user_id
  WHERE e.company_id = p_company_id
    AND (p_department_id IS NULL OR e.department_id = p_department_id)
    AND rt.timestamp >= v_period_start
    AND rt.timestamp < v_period_end
  ON CONFLICT (company_id, department_id, aggregation_period, period_start)
  DO UPDATE SET
    avg_burnout_risk = EXCLUDED.avg_burnout_risk,
    avg_motivation_index = EXCLUDED.avg_motivation_index,
    avg_intensity_work = EXCLUDED.avg_intensity_work,
    avg_emotional_demands = EXCLUDED.avg_emotional_demands,
    avg_autonomy = EXCLUDED.avg_autonomy,
    avg_social_relations = EXCLUDED.avg_social_relations,
    avg_value_conflicts = EXCLUDED.avg_value_conflicts,
    avg_job_insecurity = EXCLUDED.avg_job_insecurity,
    total_users = EXCLUDED.total_users,
    at_risk_users = EXCLUDED.at_risk_users,
    critical_users = EXCLUDED.critical_users;
END;
$$;