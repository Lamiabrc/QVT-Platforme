-- Phase 3: Approche alternative - désactiver RLS temporairement

-- Désactiver RLS sur user_roles temporairement
ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;

-- Maintenant modifier l'enum user_role
ALTER TABLE user_roles ALTER COLUMN role DROP DEFAULT;

ALTER TYPE user_role RENAME TO user_role_old;

CREATE TYPE user_role AS ENUM ('admin', 'user', 'salarié', 'responsable_qvt', 'rh');

-- Mettre à jour la table user_roles 
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

-- Réactiver RLS et créer de nouvelles politiques essentielles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Créer des politiques simples et efficaces pour les rôles
CREATE POLICY "Users can view their own roles" ON user_roles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all user roles" ON user_roles
FOR ALL USING (is_user_admin(auth.uid()))
WITH CHECK (is_user_admin(auth.uid()));

-- Recréer quelques politiques importantes supprimées
CREATE POLICY "Only admins can modify content" ON editable_content
FOR ALL USING (is_user_admin(auth.uid()));

CREATE POLICY "Only admins can modify themes" ON site_themes
FOR ALL USING (is_user_admin(auth.uid()));