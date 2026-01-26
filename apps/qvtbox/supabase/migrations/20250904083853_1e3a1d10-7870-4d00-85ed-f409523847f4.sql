-- Phase 7: Migration complète avec création du type

-- Créer le nouveau type enum pour les rôles entreprise
CREATE TYPE enterprise_user_role AS ENUM ('admin', 'user', 'salarié', 'responsable_qvt', 'rh');

-- Ajouter nouvelles colonnes pour les deux tables
ALTER TABLE user_roles ADD COLUMN new_role enterprise_user_role DEFAULT 'user'::enterprise_user_role;
ALTER TABLE profiles ADD COLUMN new_user_role enterprise_user_role DEFAULT 'user'::enterprise_user_role;

-- Migrer les données user_roles
UPDATE user_roles SET new_role = 
  CASE 
    WHEN role::text = 'admin' THEN 'admin'::enterprise_user_role
    WHEN role::text = 'user' THEN 'user'::enterprise_user_role
    WHEN role::text = 'salarié' THEN 'salarié'::enterprise_user_role
    WHEN role::text = 'responsable_qvt' THEN 'responsable_qvt'::enterprise_user_role
    WHEN role::text = 'rh' THEN 'rh'::enterprise_user_role
    ELSE 'user'::enterprise_user_role
  END;

-- Migrer les données profiles (si la colonne existe)
UPDATE profiles SET new_user_role = 
  CASE 
    WHEN user_role::text = 'admin' THEN 'admin'::enterprise_user_role
    WHEN user_role::text = 'user' THEN 'user'::enterprise_user_role
    WHEN user_role::text = 'salarié' THEN 'salarié'::enterprise_user_role
    WHEN user_role::text = 'responsable_qvt' THEN 'responsable_qvt'::enterprise_user_role
    WHEN user_role::text = 'rh' THEN 'rh'::enterprise_user_role
    ELSE 'user'::enterprise_user_role
  END
WHERE user_role IS NOT NULL;

-- Supprimer les anciennes colonnes
ALTER TABLE user_roles DROP COLUMN role;
ALTER TABLE profiles DROP COLUMN IF EXISTS user_role;

-- Renommer les nouvelles colonnes
ALTER TABLE user_roles RENAME COLUMN new_role TO role;
ALTER TABLE profiles RENAME COLUMN new_user_role TO user_role;

-- Contraintes NOT NULL
ALTER TABLE user_roles ALTER COLUMN role SET NOT NULL;

-- Supprimer l'ancien type
DROP TYPE user_role;