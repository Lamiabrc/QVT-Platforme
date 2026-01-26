-- Insérer du contenu éditable d'exemple pour le CMS
INSERT INTO public.editable_content 
(page_name, section_name, content_key, content_type, content_value, default_value, description)
VALUES 
-- Page d'accueil - Section Hero
('index', 'hero', 'title', 'text', 
 '{"text": "Découvrez l''univers poétique du bien-être"}'::jsonb,
 '{"text": "Découvrez l''univers poétique du bien-être"}'::jsonb,
 'Titre principal de la section hero'
),
('index', 'hero', 'subtitle', 'text',
 '{"text": "Transformez votre quotidien grâce à nos solutions innovantes de qualité de vie au travail"}'::jsonb,
 '{"text": "Transformez votre quotidien grâce à nos solutions innovantes de qualité de vie au travail"}'::jsonb,
 'Sous-titre de la section hero'
),
('index', 'hero', 'cta_text', 'text',
 '{"text": "Découvrir nos solutions"}'::jsonb,
 '{"text": "Découvrir nos solutions"}'::jsonb,
 'Texte du bouton principal'
),

-- Page d'accueil - Section Features
('index', 'features', 'section_title', 'text',
 '{"text": "Nos Solutions"}'::jsonb,
 '{"text": "Nos Solutions"}'::jsonb,
 'Titre de la section des fonctionnalités'
),
('index', 'features', 'section_description', 'text',
 '{"text": "Des outils pensés pour votre bien-être et celui de vos équipes"}'::jsonb,
 '{"text": "Des outils pensés pour votre bien-être et celui de vos équipes"}'::jsonb,
 'Description de la section des fonctionnalités'
),

-- Page d'accueil - Section Footer
('index', 'footer', 'company_description', 'text',
 '{"text": "QVT Box accompagne les entreprises et les particuliers dans leur quête de bien-être au quotidien."}'::jsonb,
 '{"text": "QVT Box accompagne les entreprises et les particuliers dans leur quête de bien-être au quotidien."}'::jsonb,
 'Description de l''entreprise dans le footer'
),
('index', 'footer', 'contact_email', 'text',
 '{"text": "contact@qvtbox.fr"}'::jsonb,
 '{"text": "contact@qvtbox.fr"}'::jsonb,
 'Email de contact principal'
),

-- Page Contact
('contact', 'hero', 'title', 'text',
 '{"text": "Contactez-nous"}'::jsonb,
 '{"text": "Contactez-nous"}'::jsonb,
 'Titre de la page contact'
),
('contact', 'hero', 'description', 'text',
 '{"text": "Nous sommes là pour répondre à toutes vos questions et vous accompagner dans votre démarche bien-être."}'::jsonb,
 '{"text": "Nous sommes là pour répondre à toutes vos questions et vous accompagner dans votre démarche bien-être."}'::jsonb,
 'Description de la page contact'
),

-- Configuration générale
('global', 'navigation', 'logo_text', 'text',
 '{"text": "QVT Box"}'::jsonb,
 '{"text": "QVT Box"}'::jsonb,
 'Texte du logo dans la navigation'
),
('global', 'seo', 'site_title', 'text',
 '{"text": "QVT Box - Solutions bien-être pour entreprises et particuliers"}'::jsonb,
 '{"text": "QVT Box - Solutions bien-être pour entreprises et particuliers"}'::jsonb,
 'Titre principal du site pour le SEO'
),
('global', 'seo', 'site_description', 'text',
 '{"text": "Découvrez nos solutions innovantes de qualité de vie au travail. Boxes bien-être, outils SaaS et boutique artisanale pour transformer votre quotidien."}'::jsonb,
 '{"text": "Découvrez nos solutions innovantes de qualité de vie au travail. Boxes bien-être, outils SaaS et boutique artisanale pour transformer votre quotidien."}'::jsonb,
 'Meta description du site'
);