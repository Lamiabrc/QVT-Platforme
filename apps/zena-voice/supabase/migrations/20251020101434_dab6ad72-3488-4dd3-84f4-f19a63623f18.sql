-- Créer la table pour les codes d'invitation entreprise
CREATE TABLE IF NOT EXISTS public.company_invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Index pour recherche rapide par code
CREATE INDEX idx_company_invite_codes_code ON public.company_invite_codes(code);

-- RLS
ALTER TABLE public.company_invite_codes ENABLE ROW LEVEL SECURITY;

-- Les admins d'entreprise peuvent gérer leurs codes
CREATE POLICY "Company admins can manage their invite codes"
ON public.company_invite_codes
FOR ALL
USING (company_id = get_user_company_id(auth.uid()) AND has_role(auth.uid(), 'company_admin'::app_role));

-- Tout le monde peut lire les codes actifs (pour validation)
CREATE POLICY "Anyone can read active invite codes"
ON public.company_invite_codes
FOR SELECT
USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));