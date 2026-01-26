// src/hooks/useMoodEntries.ts
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

interface MoodEntry {
  id: string;
  date: string; // YYYY-MM-DD
  energy_level: number;
  stress_level: number;
  motivation: number;
  social_connection: number;
  work_satisfaction: number;
  comment?: string;
  created_at: string;
}

interface DailyBubble {
  id: string;
  date: string; // YYYY-MM-DD
  bubble_type: string;
  intensity: number;
  message: string;
  ritual_suggestion?: string;
  created_at: string;
}

type CreateMoodEntry = Omit<MoodEntry, 'id' | 'created_at'>;

export const useMoodEntries = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [dailyBubbles, setDailyBubbles] = useState<DailyBubble[]>([]);
  const [loading, setLoading] = useState(true);

  const cancelledRef = useRef(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const sortByDateDesc = <T extends { date: string }>(rows: T[]) =>
    [...rows].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  const fetchMoodEntries = useCallback(async () => {
    if (!user) return [];
    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    if (error) throw error;
    return data as MoodEntry[] | null;
  }, [user]);

  const fetchDailyBubbles = useCallback(async () => {
    if (!user) return [];
    const { data, error } = await supabase
      .from('daily_bubbles')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    if (error) throw error;
    return data as DailyBubble[] | null;
  }, [user]);

  const fetchAll = useCallback(async () => {
    if (!user) {
      setMoodEntries([]);
      setDailyBubbles([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [moods, bubbles] = await Promise.all([fetchMoodEntries(), fetchDailyBubbles()]);
      if (!cancelledRef.current) {
        setMoodEntries(sortByDateDesc(moods ?? []));
        setDailyBubbles(sortByDateDesc(bubbles ?? []));
      }
    } catch (e) {
      console.error('Mood fetch error:', e);
      if (!cancelledRef.current) {
        toast({
          title: 'Erreur',
          description: 'Impossible de charger vos données bien-être.',
          variant: 'destructive',
        });
      }
    } finally {
      if (!cancelledRef.current) setLoading(false);
    }
  }, [user, fetchMoodEntries, fetchDailyBubbles, toast]);

  // Realtime: écouter INSERT/UPDATE/DELETE sur les deux tables pour ce user
  useEffect(() => {
    cancelledRef.current = false;

    // Clean ancien channel
    channelRef.current?.unsubscribe();
    if (!user) {
      setMoodEntries([]);
      setDailyBubbles([]);
      setLoading(false);
      return;
    }

    const upsertLocal = <T extends { id: string }>(arr: T[], row: T, key: keyof T & 'id') => {
      const idx = arr.findIndex((x) => x[key] === row[key]);
      if (idx === -1) return [row, ...arr];
      const next = [...arr];
      next[idx] = row;
      return next;
    };

    const channel = supabase
      .channel(`mood-realtime-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'mood_entries', filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const row = payload.new as MoodEntry;
            setMoodEntries((prev) => sortByDateDesc(upsertLocal(prev, row, 'id')));
          } else if (payload.eventType === 'DELETE') {
            const oldRow = payload.old as MoodEntry;
            setMoodEntries((prev) => prev.filter((m) => m.id !== oldRow.id));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'daily_bubbles', filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const row = payload.new as DailyBubble;
            setDailyBubbles((prev) => sortByDateDesc(upsertLocal(prev, row, 'id')));
          } else if (payload.eventType === 'DELETE') {
            const oldRow = payload.old as DailyBubble;
            setDailyBubbles((prev) => prev.filter((d) => d.id !== oldRow.id));
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      cancelledRef.current = true;
      channel.unsubscribe();
      channelRef.current = null;
    };
  }, [user]);

  // Chargement initial (et quand l’utilisateur change)
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const createMoodEntry = useCallback(
    async (moodData: CreateMoodEntry) => {
      if (!user) return null;
      try {
        const { data, error } = await supabase
          .from('mood_entries')
          .upsert(
            { user_id: user.id, ...moodData },
            { onConflict: 'user_id,date' } // nécessite contrainte unique (user_id, date)
          )
          .select()
          .single();

        if (error) throw error;

        // L’upsert remontera via Realtime, mais on peut aussi MAJ localement pour réactivité
        setMoodEntries((prev) => {
          const next = prev.filter((m) => m.id !== (data as MoodEntry).id);
          return sortByDateDesc([data as MoodEntry, ...next]);
        });

        // Si ta base génère les daily_bubbles via trigger, elles arriveront en Realtime.
        // On force un refetch léger en backup :
        fetchDailyBubbles().then((bubs) => {
          if (!cancelledRef.current && bubs) setDailyBubbles(sortByDateDesc(bubs));
        });

        return data as MoodEntry;
      } catch (error) {
        console.error('Error creating mood entry:', error);
        toast({
          title: 'Erreur',
          description: "Impossible d'enregistrer votre humeur du jour.",
          variant: 'destructive',
        });
        throw error;
      }
    },
    [user, toast, fetchDailyBubbles]
  );

  // BONUS: suppression (optionnelle)
  const deleteMoodEntry = useCallback(
    async (id: string) => {
      if (!user) return false;
      try {
        const { error } = await supabase.from('mood_entries').delete().eq('id', id).eq('user_id', user.id);
        if (error) throw error;
        // Realtime gérera la synchro; on met aussi à jour localement
        setMoodEntries((prev) => prev.filter((m) => m.id !== id));
        return true;
      } catch (e) {
        console.error('Delete mood entry error:', e);
        toast({
          title: 'Erreur',
          description: "Impossible de supprimer l'entrée.",
          variant: 'destructive',
        });
        return false;
      }
    },
    [user, toast]
  );

  const latestMood = useMemo(() => (moodEntries.length ? moodEntries[0] : null), [moodEntries]);

  return {
    moodEntries,
    dailyBubbles,
    loading,
    createMoodEntry,
    // Bonus non-cassants :
    deleteMoodEntry,
    latestMood,
    refetch: fetchAll,
  };
};
