-- Phase 1: Suppression des politiques qui bloquent la migration

-- Trouver et supprimer les politiques qui dépendent de la colonne role
DROP POLICY IF EXISTS "Admins can manage all content" ON site_content;
DROP POLICY IF EXISTS "Only admins can create admin content" ON admin_content;
DROP POLICY IF EXISTS "Only admins can delete admin content" ON admin_content;
DROP POLICY IF EXISTS "Only admins can update admin content" ON admin_content;
DROP POLICY IF EXISTS "Only authenticated admins can view admin content" ON admin_content;
DROP POLICY IF EXISTS "Only admins can modify content" ON editable_content;
DROP POLICY IF EXISTS "Only admins can view market research data" ON market_research_submissions;

-- Supprimer les données existantes des rôles familiaux
DELETE FROM user_roles 
WHERE role IN ('parent', 'ado', 'enfant', 'grand_parent', 'tuteur', 'autre_referent', 'coach');

-- Supprimer les tables spécifiques aux familles
DROP TABLE IF EXISTS monthly_boxes CASCADE;

-- Supprimer les fonctions spécifiques aux familles
DROP FUNCTION IF EXISTS is_user_famille(uuid);

-- Supprimer les enums familiaux non utilisés
DROP TYPE IF EXISTS family_role CASCADE;
DROP TYPE IF EXISTS teen_mood CASCADE;