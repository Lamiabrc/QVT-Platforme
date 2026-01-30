// src/hooks/useUserRole.ts
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'user' | 'salarié' | 'responsable_qvt' | 'rh' | null;

interface UserRoleHook {
  role: UserRole;
  loading: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  isSalarié: boolean;
  isResponsableQVT: boolean;
  isRH: boolean;
  checkRole: (requiredRole: UserRole) => boolean;
  refreshRole: () => Promise<void>;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

const isBrowser = typeof window !== 'undefined';

// Hiérarchie des rôles
const ROLE_RANK: Record<NonNullable<UserRole>, number> = {
  admin: 5,
  rh: 4,
  responsable_qvt: 3,
  'salarié': 2,
  user: 1,
};

// Normalise une chaîne en rôle connu (gère "salarie" sans accent)
const normalizeRoleString = (r?: string | null): NonNullable<UserRole> => {
  if (!r) return 'user';
  const s = r
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // retire les diacritiques
  if (s === 'admin') return 'admin';
  if (s === 'rh') return 'rh';
  if (s === 'responsable_qvt' || s === 'responsable-qvt') return 'responsable_qvt';
  if (s === 'salarie' || s === 'salarié') return 'salarié';
  if (s === 'user' || s === 'utilisateur') return 'user';
  return 'user';
};

export const useUserRole = (): UserRoleHook => {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  const cancelledRef = useRef(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchUserRole = useCallback(async () => {
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cancelledRef.current) return;

      if (error) throw error;

      const finalRole = normalizeRoleString(data?.role ?? 'user');
      setRole(finalRole);
    } catch (e) {
      if (!cancelledRef.current) {
        // Par sécurité, on retombe sur "user"
        setRole('user');
      }
    } finally {
      if (!cancelledRef.current) setLoading(false);
    }
  }, [user?.id]);

  const refreshRole = useCallback(async () => {
    await fetchUserRole();
  }, [fetchUserRole]);

  useEffect(() => {
    cancelledRef.current = false;
    // (ré)abonnement realtime sur ce user
    channelRef.current?.unsubscribe();

    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }

    // Charger une première fois
    fetchUserRole();

    const channel = supabase
      .channel(`user-role-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_roles', filter: `user_id=eq.${user.id}` },
        () => {
          // À chaque changement, on recharge
          fetchUserRole();
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      cancelledRef.current = true;
      channel.unsubscribe();
      channelRef.current = null;
    };
  }, [user?.id, fetchUserRole]);

  const checkRole = useCallback(
    (requiredRole: UserRole): boolean => {
      if (!requiredRole || !role) return false;
      const current = ROLE_RANK[(role ?? 'user') as NonNullable<UserRole>] ?? 0;
      const need = ROLE_RANK[(normalizeRoleString(requiredRole) as NonNullable<UserRole>)] ?? 0;
      return current >= need;
    },
    [role]
  );

  const hasAnyRole = useCallback(
    (roles: UserRole[]): boolean => roles.some(r => checkRole(r)),
    [checkRole]
  );

  // Dérivés mémorisés
  const isAdmin = useMemo(() => role === 'admin', [role]);
  const isRH = useMemo(() => role === 'rh' || isAdmin, [role, isAdmin]);
  const isResponsableQVT = useMemo(() => role === 'responsable_qvt' || isAdmin, [role, isAdmin]);
  const isSalarié = useMemo(
    () => role === 'salarié' || isResponsableQVT || isRH || isAdmin,
    [role, isResponsableQVT, isRH, isAdmin]
  );
  const isModerator = useMemo(() => isAdmin || isRH || isResponsableQVT, [isAdmin, isRH, isResponsableQVT]);

  return {
    role,
    loading,
    isAdmin,
    isModerator,
    isSalarié,
    isResponsableQVT,
    isRH,
    checkRole,
    refreshRole,
    hasAnyRole,
  };
};
