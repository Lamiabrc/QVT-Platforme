-- Phase 1: Nettoyage prudent de la base de données

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

-- Enlever la valeur par défaut avant de changer le type
ALTER TABLE user_roles ALTER COLUMN role DROP DEFAULT;

-- Nettoyer l'enum user_role pour garder seulement les rôles entreprise
ALTER TYPE user_role RENAME TO user_role_old;

CREATE TYPE user_role AS ENUM ('admin', 'user', 'salarié', 'responsable_qvt', 'rh');

-- Mettre à jour la table user_roles avec une conversion explicite
ALTER TABLE user_roles ALTER COLUMN role TYPE user_role USING 
  CASE 
    WHEN role::text = 'admin' THEN 'admin'::user_role
    WHEN role::text = 'user' THEN 'user'::user_role
    WHEN role::text = 'salarié' THEN 'salarié'::user_role
    WHEN role::text = 'responsable_qvt' THEN 'responsable_qvt'::user_role
    WHEN role::text = 'rh' THEN 'rh'::user_role
    ELSE 'user'::user_role  -- valeur par défaut pour les autres cas
  END;

-- Remettre la valeur par défaut
ALTER TABLE user_roles ALTER COLUMN role SET DEFAULT 'user'::user_role;

-- Supprimer l'ancien type
DROP TYPE user_role_old;