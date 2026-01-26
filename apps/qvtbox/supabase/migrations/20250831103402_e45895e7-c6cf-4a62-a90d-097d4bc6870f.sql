-- CRITICAL SECURITY FIX: Remove public access to teens_profiles table
-- This table contains highly sensitive personal information about minors

-- Drop the dangerous public read policy that allows anyone to access teen personal data
DROP POLICY IF EXISTS "Enable read access for all users" ON public.teens_profiles;

-- Create secure family-based access controls for teens_profiles

-- Only approved family members can view teen profiles in their family
CREATE POLICY "Family members can view teen profiles in their family" 
ON public.teens_profiles 
FOR SELECT 
USING (
  user_id IN (
    SELECT tm.user_id
    FROM family_members tm
    WHERE tm.family_id IN (
      SELECT fm.family_id
      FROM family_members fm
      WHERE fm.user_id = auth.uid() 
      AND fm.is_approved = true
    )
    AND tm.is_approved = true
  )
);

-- Only parents can create teen profiles
CREATE POLICY "Parents can create teen profiles for their family" 
ON public.teens_profiles 
FOR INSERT 
WITH CHECK (
  user_id IN (
    SELECT tm.user_id
    FROM family_members tm
    WHERE tm.family_id IN (
      SELECT fm.family_id
      FROM family_members fm
      WHERE fm.user_id = auth.uid() 
      AND fm.role = 'parent'
      AND fm.is_approved = true
    )
    AND tm.is_approved = true
  )
);

-- Only parents can update teen profiles in their family
CREATE POLICY "Parents can update teen profiles in their family" 
ON public.teens_profiles 
FOR UPDATE 
USING (
  user_id IN (
    SELECT tm.user_id
    FROM family_members tm
    WHERE tm.family_id IN (
      SELECT fm.family_id
      FROM family_members fm
      WHERE fm.user_id = auth.uid() 
      AND fm.role = 'parent'
      AND fm.is_approved = true
    )
    AND tm.is_approved = true
  )
);

-- Only parents can delete teen profiles in their family
CREATE POLICY "Parents can delete teen profiles in their family" 
ON public.teens_profiles 
FOR DELETE 
USING (
  user_id IN (
    SELECT tm.user_id
    FROM family_members tm
    WHERE tm.family_id IN (
      SELECT fm.family_id
      FROM family_members fm
      WHERE fm.user_id = auth.uid() 
      AND fm.role = 'parent'
      AND fm.is_approved = true
    )
    AND tm.is_approved = true
  )
);