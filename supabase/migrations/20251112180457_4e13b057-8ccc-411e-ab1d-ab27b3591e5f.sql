-- Politique RLS pour permettre l'auto-attribution du rôle lors de l'inscription
CREATE POLICY "Users can set their own role on signup"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);