-- Fix critical security vulnerability: Remove overly permissive RLS policies
-- that allow anyone to read customer support conversations and messages

-- Drop the dangerous policies that allow public access to conversations
DROP POLICY IF EXISTS "Allow visitors and admins to view conversations" ON public.conversations;
DROP POLICY IF EXISTS "Allow conversation updates" ON public.conversations;
DROP POLICY IF EXISTS "Visitors can create their own conversations" ON public.conversations;

-- Drop the dangerous policy that allows public access to messages
DROP POLICY IF EXISTS "Allow visitors and admins to view messages" ON public.messages;
DROP POLICY IF EXISTS "Anyone can create messages in active conversations" ON public.messages;
DROP POLICY IF EXISTS "Allow authenticated users to delete messages" ON public.messages;
DROP POLICY IF EXISTS "Allow authenticated users to insert messages" ON public.messages;
DROP POLICY IF EXISTS "Allow authenticated users to select messages" ON public.messages;
DROP POLICY IF EXISTS "Allow authenticated users to update messages" ON public.messages;

-- Create secure policies for conversations
-- Only admins can view all conversations
CREATE POLICY "Admins can view all conversations" ON public.conversations
FOR SELECT 
USING (is_admin(auth.uid()));

-- Conversation participants can view their own conversations
CREATE POLICY "Visitors can view their own conversations" ON public.conversations
FOR SELECT 
USING (
  visitor_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'visitor_id'::text)
  OR is_admin(auth.uid())
);

-- Only visitors can create conversations for themselves
CREATE POLICY "Visitors can create conversations" ON public.conversations
FOR INSERT 
WITH CHECK (
  visitor_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'visitor_id'::text)
  OR auth.uid() IS NOT NULL
);

-- Only admins can update conversations
CREATE POLICY "Admins can update conversations" ON public.conversations
FOR UPDATE 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Create secure policies for messages
-- Only conversation participants can view messages
CREATE POLICY "Conversation participants can view messages" ON public.messages
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (
      conversations.visitor_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'visitor_id'::text)
      OR is_admin(auth.uid())
    )
  )
);

-- Only authenticated users (visitors or admins) can create messages in their conversations
CREATE POLICY "Participants can create messages" ON public.messages
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

-- Only admins can update messages
CREATE POLICY "Admins can update messages" ON public.messages
FOR UPDATE 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Only admins can delete messages
CREATE POLICY "Admins can delete messages" ON public.messages
FOR DELETE 
USING (is_admin(auth.uid()));