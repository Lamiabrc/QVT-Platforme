// src/hooks/useEditableContent.ts
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface EditableContentItem {
  id: string;
  page_name: string;
  section_name: string;
  content_key: string;
  content_type: string;   // ex: 'text' | 'html' | 'json' | 'number' | 'boolean'
  content_value: any;
  default_value: any;
  description?: string;
  created_at: string;
  updated_at: string;
}

type BySection = Record<string, EditableContentItem[]>;

const isBrowser = typeof window !== 'undefined';

export const useEditableContent = (pageName?: string) => {
  const [contents, setContents] = useState<EditableContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const cancelledRef = useRef(false);

  const sortItems = useCallback((rows: EditableContentItem[]) => {
    return [...rows].sort((a, b) => {
      if (a.section_name === b.section_name) {
        return a.content_key.localeCompare(b.content_key);
      }
      return a.section_name.localeCompare(b.section_name);
    });
  }, []);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from('editable_content').select('*');

      if (pageName) {
        query = query.eq('page_name', pageName);
      }

      // Tri côté serveur puis second tri de sécurité côté client
      const { data, error } = await query
        .order('section_name', { ascending: true })
        .order('content_key', { ascending: true });

      if (error) throw error;

      if (!cancelledRef.current) {
        setContents(sortItems(data || []));
      }
    } catch (e: any) {
      if (!cancelledRef.current) {
        setError(e?.message ?? 'Erreur inattendue');
        toast({
          title: 'Erreur',
          description: "Impossible de charger le contenu éditable.",
          variant: 'destructive',
        });
      }
    } finally {
      if (!cancelledRef.current) setLoading(false);
    }
  }, [pageName, sortItems, toast]);

  const updateContent = useCallback(
    async (id: string, newValue: any) => {
      try {
        const { data, error } = await supabase
          .from('editable_content')
          .update({
            content_value: newValue,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;

        setContents(prev =>
          prev.map(item => (item.id === id ? (data as EditableContentItem) : item))
        );

        toast({
          title: 'Succès',
          description: 'Contenu mis à jour avec succès.',
        });
      } catch (e) {
        console.error('Erreur lors de la mise à jour:', e);
        toast({
          title: 'Erreur',
          description: 'Impossible de mettre à jour le contenu.',
          variant: 'destructive',
        });
      }
    },
    [toast]
  );

  const createContent = useCallback(
    async (
      contentData: Omit<EditableContentItem, 'id' | 'created_at' | 'updated_at'>
    ) => {
      try {
        const { data, error } = await supabase
          .from('editable_content')
          .insert(contentData)
          .select()
          .single();

        if (error) throw error;

        setContents(prev => sortItems([...(prev || []), data as EditableContentItem]));
        toast({
          title: 'Succès',
          description: 'Nouveau contenu créé avec succès.',
        });

        return data as EditableContentItem;
      } catch (e) {
        console.error('Erreur lors de la création:', e);
        toast({
          title: 'Erreur',
          description: 'Impossible de créer le contenu.',
          variant: 'destructive',
        });
      }
    },
    [sortItems, toast]
  );

  // Upsert par clé (pratique quand on ne connaît pas l'id)
  const upsertByKey = useCallback(
    async (params: {
      page_name: string;
      section_name: string;
      content_key: string;
      content_value: any;
      content_type?: string;
      default_value?: any;
      description?: string;
    }) => {
      const {
        page_name,
        section_name,
        content_key,
        content_value,
        content_type = 'text',
        default_value = null,
        description,
      } = params;

      try {
        // 1) Chercher s'il existe déjà
        const { data: existing, error: selErr } = await supabase
          .from('editable_content')
          .select('id')
          .eq('page_name', page_name)
          .eq('section_name', section_name)
          .eq('content_key', content_key)
          .limit(1);

        if (selErr && selErr.code !== 'PGRST116') throw selErr;

        if (existing && existing.length > 0) {
          // 2) Update
          const id = (existing[0] as any).id as string;
          await updateContent(id, content_value);
          return id;
        } else {
          // 3) Insert
          const created = await createContent({
            page_name,
            section_name,
            content_key,
            content_value,
            content_type,
            default_value,
            description,
            // Les champs id/created_at/updated_at sont gérés par la DB
          } as any);
          return created?.id;
        }
      } catch (e) {
        console.error('Erreur upsertByKey:', e);
        toast({
          title: 'Erreur',
          description: "Impossible d'enregistrer cette clé de contenu.",
          variant: 'destructive',
        });
      }
    },
    [createContent, updateContent, toast]
  );

  const removeContent = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase.from('editable_content').delete().eq('id', id);
        if (error) throw error;
        setContents(prev => prev.filter(item => item.id !== id));
        toast({ title: 'Supprimé', description: 'Contenu supprimé.' });
      } catch (e) {
        console.error('Erreur suppression contenu:', e);
        toast({
          title: 'Erreur',
          description: 'Impossible de supprimer ce contenu.',
          variant: 'destructive',
        });
      }
    },
    [toast]
  );

  // Realtime: s’abonner aux changements sur la table
  useEffect(() => {
    cancelledRef.current = false;

    // (ré)abonnement à chaque changement de pageName
    channelRef.current?.unsubscribe();

    const filter = pageName ? { filter: `page_name=eq.${pageName}` } : {};
    const channel = supabase
      .channel(`editable-content-${pageName || 'all'}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'editable_content', ...filter },
        payload => {
          const row = payload.new as EditableContentItem;
          setContents(prev => {
            // éviter doublons
            const exists = prev.some(i => i.id === row.id);
            const next = exists ? prev : [...prev, row];
            return sortItems(next);
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'editable_content', ...filter },
        payload => {
          const row = payload.new as EditableContentItem;
          setContents(prev => sortItems(prev.map(i => (i.id === row.id ? row : i))));
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'editable_content', ...filter },
        payload => {
          const row = payload.old as EditableContentItem;
          setContents(prev => prev.filter(i => i.id !== row.id));
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      cancelledRef.current = true;
      channel.unsubscribe();
      channelRef.current = null;
    };
  }, [pageName, sortItems]);

  // Initial fetch
  useEffect(() => {
    fetchContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageName]);

  // Regroupement par section (utile pour les UIs)
  const bySection: BySection = useMemo(() => {
    return contents.reduce((acc, item) => {
      (acc[item.section_name] ||= []).push(item);
      return acc;
    }, {} as BySection);
  }, [contents]);

  // Lecture conviviale d’une valeur (valeur > défaut > fallback)
  const getValue = useCallback(
    (key: string, fallback?: any) => {
      const item = contents.find(i => i.content_key === key);
      return item?.content_value ?? item?.default_value ?? fallback;
    },
    [contents]
  );

  return {
    contents,
    bySection,
    loading,
    error,
    updateContent,
    createContent,
    upsertByKey,
    removeContent,
    getValue,
    refetch: fetchContent,
  };
};
