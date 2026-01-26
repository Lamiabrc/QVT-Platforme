-- Fix security vulnerability: Remove public read access to teen_notifications
-- and implement proper family-based access controls

-- Drop the dangerous public read policy
DROP POLICY IF EXISTS "Enable read access for all users" ON public.teen_notifications;

-- Create secure family-based access policies
CREATE POLICY "Family members can view their family notifications" 
ON public.teen_notifications 
FOR SELECT 
USING (
  family_id IN (
    SELECT fm.family_id
    FROM family_members fm
    WHERE fm.user_id = auth.uid() 
    AND fm.is_approved = true
  )
);

-- Parents can create notifications for their family
CREATE POLICY "Parents can create family notifications" 
ON public.teen_notifications 
FOR INSERT 
WITH CHECK (
  family_id IN (
    SELECT fm.family_id
    FROM family_members fm
    WHERE fm.user_id = auth.uid() 
    AND fm.role = 'parent'
    AND fm.is_approved = true
  )
);

-- Parents can update notifications for their family
CREATE POLICY "Parents can update family notifications" 
ON public.teen_notifications 
FOR UPDATE 
USING (
  family_id IN (
    SELECT fm.family_id
    FROM family_members fm
    WHERE fm.user_id = auth.uid() 
    AND fm.role = 'parent'
    AND fm.is_approved = true
  )
);

-- Parents can delete notifications for their family
CREATE POLICY "Parents can delete family notifications" 
ON public.teen_notifications 
FOR DELETE 
USING (
  family_id IN (
    SELECT fm.family_id
    FROM family_members fm
    WHERE fm.user_id = auth.uid() 
    AND fm.role = 'parent'
    AND fm.is_approved = true
  )
);