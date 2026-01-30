import React, { useState, useEffect, createContext, useContext } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<{ error?: any }>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
  confirmAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAuthenticated: false,
  signOut: async () => {},
  signInWithMagicLink: async () => ({}),
  resetPassword: async () => ({}),
  confirmAuth: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const isBrowser = typeof window !== 'undefined';
const AUTH_CONFIRMED_KEY = 'qvtbox.auth.confirmed';

const isSessionValid = (session: Session | null) => {
  if (!session) return false;
  if (session.expires_at && session.expires_at * 1000 <= Date.now()) {
    return false;
  }
  return true;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authConfirmed, setAuthConfirmed] = useState(() => {
    if (!isBrowser) return false;
    return window.localStorage.getItem(AUTH_CONFIRMED_KEY) === '1';
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (isSessionValid(session) && authConfirmed) {
          setSession(session);
          setUser(session?.user ?? null);
        } else {
          setSession(null);
          setUser(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isSessionValid(session) && authConfirmed) {
        setSession(session);
        setUser(session?.user ?? null);
      } else {
        setSession(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [authConfirmed]);

  const confirmAuth = async () => {
    if (isBrowser) {
      window.localStorage.setItem(AUTH_CONFIRMED_KEY, '1');
    }
    setAuthConfirmed(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (isSessionValid(session)) {
      setSession(session);
      setUser(session?.user ?? null);
    } else {
      setSession(null);
      setUser(null);
    }
  };

  const clearConfirmedAuth = () => {
    if (isBrowser) {
      window.localStorage.removeItem(AUTH_CONFIRMED_KEY);
    }
    setAuthConfirmed(false);
    setSession(null);
    setUser(null);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    clearConfirmedAuth();
  };

  const signInWithMagicLink = async (email: string) => {
    const redirect = isBrowser ? `${window.location.origin}/auth/callback` : undefined;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirect }
    });
    return { error };
  };

  const resetPassword = async (email: string) => {
    const redirectTo = isBrowser ? `${window.location.origin}/reset-password` : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    return { error };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAuthenticated: !!user && authConfirmed,
        signOut,
        signInWithMagicLink,
        resetPassword,
        confirmAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
