-- Phase 1: Nettoyage de la base de données - Suppression des rôles familiaux

-- Supprimer les données existantes des rôles familiaux
DELETE FROM user_roles 
WHERE role IN ('parent', 'ado', 'enfant', 'grand_parent', 'tuteur', 'autre_referent', 'coach');

-- Supprimer les tables spécifiques aux familles
DROP TABLE IF EXISTS monthly_boxes CASCADE;

-- Nettoyer l'enum user_role pour garder seulement les rôles entreprise
ALTER TYPE user_role RENAME TO user_role_old;

CREATE TYPE user_role AS ENUM ('admin', 'user', 'salarié', 'responsable_qvt', 'rh');

-- Mettre à jour la table user_roles
ALTER TABLE user_roles ALTER COLUMN role TYPE user_role USING role::text::user_role;

-- Supprimer l'ancien type
DROP TYPE user_role_old;

-- Supprimer les enums familiaux non utilisés
DROP TYPE IF EXISTS family_role CASCADE;
DROP TYPE IF EXISTS teen_mood CASCADE;

-- Supprimer les fonctions spécifiques aux familles
DROP FUNCTION IF EXISTS is_user_famille(uuid);

-- Mettre à jour l'enum subscription_type pour enlever 'family'
ALTER TYPE subscription_type RENAME TO subscription_type_old;

CREATE TYPE subscription_type AS ENUM ('basic', 'premium');

-- Si la table utilise ce type, la mettre à jour
-- (à adapter selon la structure réelle)

DROP TYPE IF EXISTS subscription_type_old;