-- Phase 2b: Supprimer toutes les politiques qui utilisent la colonne role

-- Supprimer la politique qui bloque sur site_themes
DROP POLICY IF EXISTS "Only admins can modify themes" ON site_themes;

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