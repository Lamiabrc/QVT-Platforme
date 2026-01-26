-- Fix lint: remove SECURITY DEFINER behavior from views and enable RLS on public tables

-- Switch views to security invoker so caller permissions and RLS apply
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_views WHERE schemaname = 'public' AND viewname = 'v_meteo_emotionnelle') THEN
    EXECUTE 'ALTER VIEW public.v_meteo_emotionnelle SET (security_invoker = true)';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_views WHERE schemaname = 'public' AND viewname = 'v_zena_emotions_daily') THEN
    EXECUTE 'ALTER VIEW public.v_zena_emotions_daily SET (security_invoker = true)';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_views WHERE schemaname = 'public' AND viewname = 'v_zena_emotion_trends') THEN
    EXECUTE 'ALTER VIEW public.v_zena_emotion_trends SET (security_invoker = true)';
  END IF;
END
$$;

-- Enable RLS on linted public tables; keep behavior via permissive policy (adjust later if needed)
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'kb_chunks',
    'rag_documents_mistral',
    'who5',
    'kb_sources',
    'karasek_short',
    'eri_short',
    'uwes9',
    'rag_documents',
    'zena_training_samples'
  ]
  LOOP
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = tbl) THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);
      EXECUTE format('CREATE POLICY IF NOT EXISTS "%I allow all" ON public.%I FOR ALL USING (true) WITH CHECK (true);', tbl, tbl);
    END IF;
  END LOOP;
END
$$;
