-- Promouvoir l'utilisateur lamia.brechet@outlook.fr comme admin
INSERT INTO public.user_roles (user_id, role)
SELECT au.id, 'admin'::user_role
FROM auth.users au
WHERE au.email = 'lamia.brechet@outlook.fr'
ON CONFLICT (user_id, role) DO NOTHING;