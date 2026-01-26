-- Ajouter la contrainte unique manquante et promouvoir l'utilisateur admin
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);

-- Promouvoir l'utilisateur lamia.brechet@outlook.fr comme admin
INSERT INTO public.user_roles (user_id, role)
SELECT au.id, 'admin'::user_role
FROM auth.users au
WHERE au.email = 'lamia.brechet@outlook.fr'
ON CONFLICT (user_id, role) DO NOTHING;