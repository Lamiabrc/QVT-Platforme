-- Insérer quelques produits d'exemple pour tester la boutique
INSERT INTO public.products (name, slug, description, short_description, price, origin, category_id, inventory_quantity, is_featured) 
SELECT 
  'Huile essentielle de Lavande Bio',
  'huile-lavande-bio',
  'Huile essentielle de lavande certifiée bio, distillée artisanalement en Provence. Apaisante et relaxante, parfaite pour la détente après une journée de travail.',
  'Huile essentielle bio apaisante',
  12.90,
  'Provence, France',
  c.id,
  50,
  true
FROM public.categories c WHERE c.slug = 'bien-etre';

INSERT INTO public.products (name, slug, description, short_description, price, origin, category_id, inventory_quantity) 
SELECT 
  'Infusion Relaxante aux Plantes',
  'infusion-relaxante',
  'Mélange de plantes bio soigneusement sélectionnées pour favoriser la détente et un sommeil réparateur.',
  'Tisane détente bio',
  8.50,
  'Auvergne, France',
  c.id,
  30
FROM public.categories c WHERE c.slug = 'bien-etre';

INSERT INTO public.products (name, slug, description, short_description, price, origin, category_id, inventory_quantity) 
SELECT 
  'Bol en Céramique Provençale',
  'bol-ceramique-provence',
  'Bol artisanal en céramique émaillée, façonné à la main par un potier provençal. Chaque pièce est unique.',
  'Céramique artisanale unique',
  22.00,
  'Provence, France',
  c.id,
  15
FROM public.categories c WHERE c.slug = 'artisanat';

INSERT INTO public.products (name, slug, description, short_description, price, origin, category_id, inventory_quantity) 
SELECT 
  'Miel d''Acacia du Gâtinais',
  'miel-acacia-gatinais',
  'Miel d''acacia récolté dans les forêts du Gâtinais par un apiculteur passionné depuis 3 générations.',
  'Miel artisanal de famille',
  16.90,
  'Gâtinais, France',
  c.id,
  25
FROM public.categories c WHERE c.slug = 'gastronomie';