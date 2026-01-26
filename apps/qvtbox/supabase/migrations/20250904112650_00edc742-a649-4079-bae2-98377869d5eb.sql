-- Add unique constraint for user_id and then insert admin role
ALTER TABLE cms_user_roles ADD CONSTRAINT cms_user_roles_user_id_key UNIQUE (user_id);

-- Insert admin role for lamia.brechet@outlook.fr
INSERT INTO cms_user_roles (user_id, role, granted_by)
SELECT 
  id,
  'admin'::user_role_cms_enum,
  id
FROM auth.users 
WHERE email = 'lamia.brechet@outlook.fr'
ON CONFLICT (user_id) DO UPDATE SET 
  role = 'admin'::user_role_cms_enum,
  created_at = now();