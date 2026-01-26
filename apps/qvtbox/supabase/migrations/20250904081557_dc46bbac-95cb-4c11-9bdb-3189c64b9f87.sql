-- Phase 4: Nouvelle approche - créer un nouvel enum avec nom différent

-- Créer un nouveau type enum pour les rôles entreprise
CREATE TYPE enterprise_user_role AS ENUM ('admin', 'user', 'salarié', 'responsable_qvt', 'rh');

-- Ajouter une nouvelle colonne avec le nouveau type
ALTER TABLE user_roles ADD COLUMN new_role enterprise_user_role DEFAULT 'user'::enterprise_user_role;

-- Migrer les données vers la nouvelle colonne
UPDATE user_roles SET new_role = 
  CASE 
    WHEN role::text = 'admin' THEN 'admin'::enterprise_user_role
    WHEN role::text = 'user' THEN 'user'::enterprise_user_role
    WHEN role::text = 'salarié' THEN 'salarié'::enterprise_user_role
    WHEN role::text = 'responsable_qvt' THEN 'responsable_qvt'::enterprise_user_role
    WHEN role::text = 'rh' THEN 'rh'::enterprise_user_role
    ELSE 'user'::enterprise_user_role
  END;

-- Supprimer l'ancienne colonne role
ALTER TABLE user_roles DROP COLUMN role;

-- Renommer la nouvelle colonne
ALTER TABLE user_roles RENAME COLUMN new_role TO role;

-- Mettre NOT NULL sur la nouvelle colonne
ALTER TABLE user_roles ALTER COLUMN role SET NOT NULL;