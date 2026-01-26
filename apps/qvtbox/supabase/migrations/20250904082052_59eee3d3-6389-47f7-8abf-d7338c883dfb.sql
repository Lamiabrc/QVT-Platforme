-- Phase 5: Supprimer TOUTES les politiques dépendantes identifiées

-- Politiques sur site_themes
DROP POLICY IF EXISTS "Only admins can modify themes" ON site_themes;

-- Politiques sur user_roles
DROP POLICY IF EXISTS "Only admins can insert user roles" ON user_roles;
DROP POLICY IF EXISTS "Only admins can update user roles" ON user_roles;
DROP POLICY IF EXISTS "Only admins can delete user roles" ON user_roles;

-- Politiques sur security_audit_log
DROP POLICY IF EXISTS "Only admins can view audit logs" ON security_audit_log;

-- Politiques sur storage.objects
DROP POLICY IF EXISTS "Admins can upload content images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update content images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete content images" ON storage.objects;

-- Maintenant créer le nouvel enum et migrer
CREATE TYPE enterprise_user_role AS ENUM ('admin', 'user', 'salarié', 'responsable_qvt', 'rh');

ALTER TABLE user_roles ADD COLUMN new_role enterprise_user_role DEFAULT 'user'::enterprise_user_role;

UPDATE user_roles SET new_role = 
  CASE 
    WHEN role::text = 'admin' THEN 'admin'::enterprise_user_role
    WHEN role::text = 'user' THEN 'user'::enterprise_user_role
    WHEN role::text = 'salarié' THEN 'salarié'::enterprise_user_role
    WHEN role::text = 'responsable_qvt' THEN 'responsable_qvt'::enterprise_user_role
    WHEN role::text = 'rh' THEN 'rh'::enterprise_user_role
    ELSE 'user'::enterprise_user_role
  END;

ALTER TABLE user_roles DROP COLUMN role;
ALTER TABLE user_roles RENAME COLUMN new_role TO role;
ALTER TABLE user_roles ALTER COLUMN role SET NOT NULL;

-- Supprimer l'ancien type
DROP TYPE user_role;