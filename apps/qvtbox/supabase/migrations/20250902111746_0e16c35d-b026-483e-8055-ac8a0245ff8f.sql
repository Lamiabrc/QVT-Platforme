-- Insérer du contenu éditable d'exemple pour le CMS
INSERT INTO public.editable_content 
(page_name, section_name, content_key, content_type, content_value, default_value, description)
VALUES 
-- Page d'accueil - Section Hero
('index', 'hero', 'title', 'text', 
 'Découvrez l''univers poétique du bien-être',
 'Découvrez l''univers poétique du bien-être',
 'Titre principal de la section hero'
),
('index', 'hero', 'subtitle', 'text',
 'Transformez votre quotidien grâce à nos solutions innovantes de qualité de vie au travail',
 'Transformez votre quotidien grâce à nos solutions innovantes de qualité de vie au travail',
 'Sous-titre de la section hero'
),
('index', 'hero', 'cta_text', 'text',
 'Découvrir nos solutions',
 'Découvrir nos solutions',
 'Texte du bouton principal'
),

-- Page d'accueil - Section Features
('index', 'features', 'section_title', 'text',
 'Nos Solutions',
 'Nos Solutions',
 'Titre de la section des fonctionnalités'
),
('index', 'features', 'section_description', 'text',
 'Des outils pensés pour votre bien-être et celui de vos équipes',
 'Des outils pensés pour votre bien-être et celui de vos équipes',
 'Description de la section des fonctionnalités'
),

-- Page d'accueil - Section Footer
('index', 'footer', 'company_description', 'text',
 'QVT Box accompagne les entreprises et les particuliers dans leur quête de bien-être au quotidien.',
 'QVT Box accompagne les entreprises et les particuliers dans leur quête de bien-être au quotidien.',
 'Description de l''entreprise dans le footer'
),
('index', 'footer', 'contact_email', 'text',
 'contact@qvtbox.fr',
 'contact@qvtbox.fr',
 'Email de contact principal'
),

-- Page Contact
('contact', 'hero', 'title', 'text',
 'Contactez-nous',
 'Contactez-nous',
 'Titre de la page contact'
),
('contact', 'hero', 'description', 'text',
 'Nous sommes là pour répondre à toutes vos questions et vous accompagner dans votre démarche bien-être.',
 'Nous sommes là pour répondre à toutes vos questions et vous accompagner dans votre démarche bien-être.',
 'Description de la page contact'
),

-- Configuration générale
('global', 'navigation', 'logo_text', 'text',
 'QVT Box',
 'QVT Box',
 'Texte du logo dans la navigation'
),
('global', 'seo', 'site_title', 'text',
 'QVT Box - Solutions bien-être pour entreprises et particuliers',
 'QVT Box - Solutions bien-être pour entreprises et particuliers',
 'Titre principal du site pour le SEO'
),
('global', 'seo', 'site_description', 'text',
 'Découvrez nos solutions innovantes de qualité de vie au travail. Boxes bien-être, outils SaaS et boutique artisanale pour transformer votre quotidien.',
 'Découvrez nos solutions innovantes de qualité de vie au travail. Boxes bien-être, outils SaaS et boutique artisanale pour transformer votre quotidien.',
 'Meta description du site'
);