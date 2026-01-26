-- Phase 2: Modifier l'enum user_role et recréer les politiques importantes

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

-- Recréer les politiques importantes
CREATE POLICY "Only admins can create admin content" 
ON admin_content FOR INSERT 
WITH CHECK (is_user_admin(auth.uid()));

CREATE POLICY "Only admins can update admin content" 
ON admin_content FOR UPDATE 
USING (is_user_admin(auth.uid()));

CREATE POLICY "Only admins can delete admin content" 
ON admin_content FOR DELETE 
USING (is_user_admin(auth.uid()));

CREATE POLICY "Only authenticated admins can view admin content" 
ON admin_content FOR SELECT 
USING (auth.role() <> 'anonymous' AND EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Only admins can modify content" 
ON editable_content FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Only admins can view market research data" 
ON market_research_submissions FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));