-- Phase 2d: Supprimer TOUTES les politiques qui mentionnent 'role' dans la base

-- Supprimer toutes les politiques qui peuvent utiliser role sur différentes tables
DROP POLICY IF EXISTS "Only admins can modify themes" ON site_themes;
DROP POLICY IF EXISTS "Admins can manage themes" ON site_themes; 
DROP POLICY IF EXISTS "Admin can modify themes" ON site_themes;

-- Supprimer toute référence à role dans les politiques enterprise_role
DROP POLICY IF EXISTS "Les admins/RH/managers peuvent gérer les membres" ON enterprise_members;
DROP POLICY IF EXISTS "Les admins/RH/managers peuvent voir les autres membres" ON enterprise_members;

-- Vérifier et supprimer d'autres politiques potentielles
DROP POLICY IF EXISTS "Admins can select all rows" ON some_table;

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