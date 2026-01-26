-- Ajouter une policy pour permettre aux employés de voir les analytics agrégées de leur entreprise
-- Ceci est nécessaire pour le QSH Dashboard accessible à tous les employés

-- D'abord, supprimer l'ancienne policy restrictive
DROP POLICY IF EXISTS "Company admins can view aggregated analytics" ON analytics_aggregated;

-- Créer une nouvelle policy qui permet à tous les employés de l'entreprise de voir les analytics
CREATE POLICY "Employees can view their company aggregated analytics"
ON analytics_aggregated
FOR SELECT
USING (company_id = get_user_company_id(auth.uid()));

-- Ajouter aussi une policy pour permettre aux employés de voir les RPS tracking anonymisés de leur entreprise
-- (nécessaire pour calculer les tendances en temps réel)
CREATE POLICY "Employees can view company RPS tracking"
ON rps_tracking
FOR SELECT
USING (
  user_id IN (
    SELECT id FROM employees 
    WHERE company_id = get_user_company_id(auth.uid())
  )
  OR user_id = auth.uid()
);