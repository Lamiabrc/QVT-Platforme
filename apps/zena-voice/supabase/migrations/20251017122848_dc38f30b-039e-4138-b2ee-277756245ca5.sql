-- Create support_resources table for crisis and wellbeing resources
CREATE TABLE IF NOT EXISTS public.support_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type TEXT NOT NULL CHECK (resource_type IN ('urgence', 'medecin', 'rh', 'externe', 'psychologue')),
  name TEXT NOT NULL,
  phone TEXT,
  url TEXT,
  description TEXT NOT NULL,
  country TEXT DEFAULT 'FR',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.support_resources ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view support resources (public resources)
CREATE POLICY "Anyone can view support resources"
  ON public.support_resources
  FOR SELECT
  USING (true);

-- Insert default French resources
INSERT INTO public.support_resources (resource_type, name, phone, url, description, country) VALUES
('urgence', '3114 - Numéro national de prévention du suicide', '3114', 'https://3114.fr', 'Ligne d''écoute gratuite et confidentielle, disponible 24h/24 et 7j/7 pour toute personne en détresse psychologique.', 'FR'),
('urgence', 'SOS Amitié', '09 72 39 40 50', 'https://www.sos-amitie.com', 'Service d''écoute par téléphone pour les personnes en détresse, anonyme et confidentiel.', 'FR'),
('psychologue', 'Santé Psy Étudiant', NULL, 'https://santepsy.etudiant.gouv.fr', 'Dispositif de soutien psychologique gratuit pour les étudiants (8 séances remboursées).', 'FR'),
('medecin', 'Médecine du travail', NULL, NULL, 'Votre médecin du travail est là pour vous accompagner en cas de difficultés professionnelles. Contactez le service de santé au travail de votre entreprise.', 'FR'),
('rh', 'Service RH de votre entreprise', NULL, NULL, 'N''hésitez pas à prendre contact avec votre service RH pour échanger sur vos conditions de travail en toute confidentialité.', 'FR'),
('externe', 'Écoute Santé Travail', '0800 00 47 87', 'https://www.istnf.fr/ecoute-sante-travail', 'Service d''écoute gratuit et anonyme pour les salariés en difficulté (stress, harcèlement, burnout).', 'FR');

-- Trigger for updated_at
CREATE TRIGGER update_support_resources_updated_at
  BEFORE UPDATE ON public.support_resources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();