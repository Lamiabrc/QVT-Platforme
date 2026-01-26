-- Phase 2c: Supprimer TOUTES les politiques sur user_roles et modifier l'enum

-- Supprimer toutes les politiques sur la table user_roles
DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can manage user roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;
DROP POLICY IF EXISTS "Only admins can delete user roles" ON user_roles;
DROP POLICY IF EXISTS "Only admins can update user roles" ON user_roles;
DROP POLICY IF EXISTS "Only authenticated users can read their role" ON user_roles;
DROP POLICY IF EXISTS "Users can delete their own roles" ON user_roles;
DROP POLICY IF EXISTS "Users can see own role" ON user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON user_roles;
DROP POLICY IF EXISTS "Users can view their own role" ON user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
DROP POLICY IF EXISTS "Only admins can insert user roles" ON user_roles;

-- Supprimer les politiques génériques
DROP POLICY IF EXISTS "authenticated_delete" ON user_roles;
DROP POLICY IF EXISTS "authenticated_select" ON user_roles;
DROP POLICY IF EXISTS "authenticated_update" ON user_roles;
DROP POLICY IF EXISTS "authenticated_insert" ON user_roles;

-- Maintenant modifier l'enum user_role
ALTER TABLE user_roles ALTER COLUMN role DROP DEFAULT;

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
    ELSE 'user'::user_role
  END;

ALTER TABLE user_roles ALTER COLUMN role SET DEFAULT 'user'::user_role;

DROP TYPE user_role_old;