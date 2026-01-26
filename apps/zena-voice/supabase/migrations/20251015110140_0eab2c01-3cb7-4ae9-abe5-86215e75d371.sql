-- Fix security issues - remove anonymous access to sensitive data

-- Fix conversation_sessions - remove anonymous access
DROP POLICY IF EXISTS "Users can view their own sessions" ON conversation_sessions;
DROP POLICY IF EXISTS "Users can view their own authenticated sessions" ON conversation_sessions;
DROP POLICY IF EXISTS "Anyone can insert sessions" ON conversation_sessions;
DROP POLICY IF EXISTS "Users can insert their own sessions" ON conversation_sessions;

CREATE POLICY "Users can view only their own authenticated sessions"
ON conversation_sessions
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert only their own authenticated sessions"
ON conversation_sessions
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Fix conversation_messages - restrict to authenticated user sessions only
DROP POLICY IF EXISTS "Anyone can view messages from their session" ON conversation_messages;
DROP POLICY IF EXISTS "Users can view messages from their own sessions" ON conversation_messages;

CREATE POLICY "Users can view messages only from their own sessions"
ON conversation_messages
FOR SELECT
TO authenticated
USING (session_id IN (
  SELECT id FROM conversation_sessions WHERE user_id = auth.uid()
));

-- Fix emotional_snapshots - remove anonymous access
DROP POLICY IF EXISTS "Users can view their own emotional data" ON emotional_snapshots;
DROP POLICY IF EXISTS "Users can view only their own emotional data" ON emotional_snapshots;

CREATE POLICY "Users can view only their authenticated emotional data"
ON emotional_snapshots
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Fix box_recommendations - remove anonymous access
DROP POLICY IF EXISTS "Users can view their own recommendations" ON box_recommendations;
DROP POLICY IF EXISTS "Users can view only their own recommendations" ON box_recommendations;

CREATE POLICY "Users can view only their authenticated recommendations"
ON box_recommendations
FOR SELECT
TO authenticated
USING (user_id = auth.uid());