-- Fix: prevent inserting event_participants for other users unless admin invites

ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "event_participants_insert_member" ON public.event_participants;

CREATE POLICY "event_participants_insert_member"
ON public.event_participants
FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated'
  AND (
    (
      user_id = auth.uid()
      AND EXISTS (
        SELECT 1
        FROM public.calendar_events ce
        WHERE ce.id = event_id
          AND public.is_bubble_member(ce.bubble_id)
      )
    )
    OR
    (
      invited_by = auth.uid()
      AND EXISTS (
        SELECT 1
        FROM public.calendar_events ce
        WHERE ce.id = event_id
          AND public.is_bubble_admin(ce.bubble_id)
      )
    )
  )
);
