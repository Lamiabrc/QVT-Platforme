-- Fix critical security vulnerability: Remove specific overly permissive RLS policies
-- Drop the specific dangerous policies that allow public access

-- Remove dangerous conversation policies
DROP POLICY IF EXISTS "Allow visitors and admins to view conversations" ON public.conversations;
DROP POLICY IF EXISTS "Allow conversation updates" ON public.conversations;
DROP POLICY IF EXISTS "Visitors can create their own conversations" ON public.conversations;

-- Remove dangerous message policies  
DROP POLICY IF EXISTS "Allow visitors and admins to view messages" ON public.messages;
DROP POLICY IF EXISTS "Anyone can create messages in active conversations" ON public.messages;

-- Create secure conversation policies (only if they don't exist)
DO $$ 
BEGIN
    -- Secure conversation creation policy
    BEGIN
        CREATE POLICY "Secure visitors can create conversations" ON public.conversations
        FOR INSERT 
        WITH CHECK (
          visitor_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'visitor_id'::text)
          OR auth.uid() IS NOT NULL
        );
    EXCEPTION WHEN duplicate_object THEN
        -- Policy already exists, skip
    END;
    
    -- Secure conversation update policy (admin only)
    BEGIN
        CREATE POLICY "Secure admin conversation updates" ON public.conversations
        FOR UPDATE 
        USING (is_admin(auth.uid()))
        WITH CHECK (is_admin(auth.uid()));
    EXCEPTION WHEN duplicate_object THEN
        -- Policy already exists, skip
    END;
END $$;

-- Create secure message policies (only if they don't exist)
DO $$ 
BEGIN
    -- Secure message creation policy
    BEGIN
        CREATE POLICY "Secure participants can create messages" ON public.messages
        FOR INSERT 
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM public.conversations 
            WHERE conversations.id = messages.conversation_id 
            AND conversations.status = 'active'
            AND (
              conversations.visitor_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'visitor_id'::text)
              OR is_admin(auth.uid())
            )
          )
        );
    EXCEPTION WHEN duplicate_object THEN
        -- Policy already exists, skip
    END;
    
    -- Secure message updates (admin only)
    BEGIN
        CREATE POLICY "Secure admin message updates" ON public.messages
        FOR UPDATE 
        USING (is_admin(auth.uid()))
        WITH CHECK (is_admin(auth.uid()));
    EXCEPTION WHEN duplicate_object THEN
        -- Policy already exists, skip
    END;
    
    -- Secure message deletion (admin only)
    BEGIN
        CREATE POLICY "Secure admin message deletion" ON public.messages
        FOR DELETE 
        USING (is_admin(auth.uid()));
    EXCEPTION WHEN duplicate_object THEN
        -- Policy already exists, skip
    END;
END $$;