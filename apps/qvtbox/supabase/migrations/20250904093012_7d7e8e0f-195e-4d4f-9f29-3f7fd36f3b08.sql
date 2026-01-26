-- Create tables for QVT Box CTA flows

-- Table for needs assessments (simulator results)
CREATE TABLE public.needs_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  email TEXT,
  entreprise TEXT,
  scores_sante INTEGER CHECK (scores_sante >= 0 AND scores_sante <= 100),
  scores_orga INTEGER CHECK (scores_orga >= 0 AND scores_orga <= 100),
  scores_cohesion INTEGER CHECK (scores_cohesion >= 0 AND scores_cohesion <= 100),
  scores_devperso INTEGER CHECK (scores_devperso >= 0 AND scores_devperso <= 100),
  box_recommandee TEXT NOT NULL,
  note_globale INTEGER CHECK (note_globale >= 0 AND note_globale <= 100),
  source TEXT NOT NULL DEFAULT 'simulateur_box'
);

-- Table for demo leads (contact form)
CREATE TABLE public.leads_demo (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  entreprise TEXT,
  message TEXT NOT NULL,
  source_page TEXT NOT NULL DEFAULT '/contact'
);

-- Table for partner applications
CREATE TABLE public.partners_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  societe TEXT NOT NULL,
  contact_nom TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_tel TEXT,
  site_web TEXT,
  categorie TEXT CHECK (categorie IN ('physique', 'virtuel', 'evenementiel')),
  origine TEXT CHECK (origine IN ('FR', 'UE', 'OCDE')) NOT NULL,
  type_offre TEXT CHECK (type_offre IN ('premium_fr_local', 'standard_ocde')) NOT NULL,
  certifications TEXT,
  moq TEXT,
  prix_b2b TEXT,
  delais TEXT,
  logistique_echantillons TEXT,
  description_courte TEXT CHECK (length(description_courte) <= 500),
  charte_acceptee BOOLEAN NOT NULL DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE public.needs_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads_demo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners_applications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public inserts (forms submission)
CREATE POLICY "Anyone can submit needs assessment" 
ON public.needs_assessments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can submit demo lead" 
ON public.leads_demo 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can submit partner application" 
ON public.partners_applications 
FOR INSERT 
WITH CHECK (true);

-- Admin policies for viewing data
CREATE POLICY "Admins can view needs assessments" 
ON public.needs_assessments 
FOR SELECT 
USING (is_user_admin(auth.uid()));

CREATE POLICY "Admins can view demo leads" 
ON public.leads_demo 
FOR SELECT 
USING (is_user_admin(auth.uid()));

CREATE POLICY "Admins can view partner applications" 
ON public.partners_applications 
FOR SELECT 
USING (is_user_admin(auth.uid()));

-- Add updated_at triggers
CREATE TRIGGER update_needs_assessments_updated_at
    BEFORE UPDATE ON public.needs_assessments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leads_demo_updated_at
    BEFORE UPDATE ON public.leads_demo
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_partners_applications_updated_at
    BEFORE UPDATE ON public.partners_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();