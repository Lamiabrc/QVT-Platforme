import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
  useCallback,
} from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const isBrowser = typeof window !== "undefined";
const AUTH_CONFIRMED_KEY = "qvtbox.auth.confirmed";

const isSessionValid = (session: Session | null) => {
  if (!session) return false;
  if (session.expires_at && session.expires_at * 1000 <= Date.now()) return false;
  return true;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const mountedRef = useRef(true);

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // On garde l'info, mais on ne bloque plus la session dessus
  const [authConfirmed, setAuthConfirmed] = useState(() => {
    if (!isBrowser) return true;
    return window.localStorage.getItem(AUTH_CONFIRMED_KEY) === "1";
  });

  const setConfirmed = useCallback((value: boolean) => {
    if (!isBrowser) return;
    if (value) window.localStorage.setItem(AUTH_CONFIRMED_KEY, "1");
    else window.localStorage.removeItem(AUTH_CONFIRMED_KEY);
  }, []);

  const applySession = useCallback(
    (nextSession: Session | null) => {
      if (!mountedRef.current) return;

      if (isSessionValid(nextSession)) {
        setSession(nextSession);
        setUser(nextSession?.user ?? null);

        // ✅ Auto-confirm : évite l'état "session existe mais app croit être déconnectée"
        if (!authConfirmed) {
          setConfirmed(true);
          setAuthConfirmed(true);
        }
      } else {
        setSession(null);
        setUser(null);
      }

      setLoading(false);
    },
    [authConfirmed, setConfirmed]
  );

  useEffect(() => {
    mountedRef.current = true;

    // Session initiale
    (async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        applySession(session);
      } catch (e) {
        console.error("supabase.auth.getSession failed:", e);
        applySession(null);
      }
    })();

    // Listener auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      applySession(nextSession);
    });

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, [applySession]);

  const confirmAuth = useCallback(async () => {
    setConfirmed(true);
    setAuthConfirmed(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();
    applySession(session);
  }, [applySession, setConfirmed]);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // ✅ Même si Supabase échoue, on nettoie l'état local
      console.error("supabase.auth.signOut failed:", e);
    } finally {
      setConfirmed(false);
      setAuthConfirmed(false);

      if (mountedRef.current) {
        setSession(null);
        setUser(null);
        setLoading(false);
      }
    }
  }, [setConfirmed]);

  const signInWithMagicLink = useCallback(async (email: string) => {
    const redirect = isBrowser
      ? `${window.location.origin}/auth/callback`
      : undefined;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirect,
        shouldCreateUser: true,
      },
    });

    return { error };
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const redirectTo = isBrowser
      ? `${window.location.origin}/reset-password`
      : undefined;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    return { error };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        // ✅ Auth réelle basée sur session valide + user
        isAuthenticated: Boolean(isSessionValid(session) && user),
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
