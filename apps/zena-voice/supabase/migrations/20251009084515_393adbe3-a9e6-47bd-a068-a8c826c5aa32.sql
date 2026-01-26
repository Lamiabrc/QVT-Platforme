-- Corriger la vue pour éviter SECURITY DEFINER
DROP VIEW IF EXISTS public.qvt_analytics;

CREATE VIEW public.qvt_analytics 
WITH (security_invoker = true) AS
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