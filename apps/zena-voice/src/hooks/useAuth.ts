import { useState, useEffect } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- Auth listener ---
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  // --- Sign up ---
  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    companyCode?: string
  ) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      let companyId: string;

      // Si un code entreprise est fourni
      if (companyCode?.trim()) {
        const { data: inviteData, error: inviteError } = await supabase
          .from("company_invite_codes")
          .select("company_id")
          .eq("code", companyCode.toUpperCase())
          .maybeSingle();

        if (inviteError || !inviteData) {
          toast.error("Code entreprise invalide");
          return { error: new Error("Code entreprise invalide") };
        }
        companyId = inviteData.company_id;
      } else {
        // Crée une entreprise personnelle
        const { data: company, error: companyError } = await supabase
          .from("companies")
          .insert({
            name: `Compte personnel - ${firstName} ${lastName}`,
            industry: "Individual",
            employee_count: 1,
          })
          .select("id")
          .single();

        if (companyError) {
          toast.error("Erreur lors de la création de votre espace");
          return { error: companyError };
        }
        companyId = company.id;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            company_id: companyId,
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) throw error;

      // Lien avec données anonymes éventuelles
      if (data.user) {
        await linkAnonymousData(data.user.id);
        toast.success("Compte créé avec succès !");
        navigate("/zena-chat");
      }

      return { error: null };
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error("Erreur signup:", error);
      toast.error(error.message || "Erreur lors de l'inscription");
      return { error };
    }
  };

  // --- Sign in ---
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast.success("Connexion réussie !");
        navigate("/zena-chat");
      }

      return { error: null };
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (error.message?.includes("Invalid login credentials")) {
        toast.error("Email ou mot de passe incorrect");
      } else {
        toast.error(error.message || "Erreur de connexion");
      }
      return { error };
    }
  };

  // --- Sign out ---
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success("Déconnexion réussie");
      navigate("/auth");
      return { error: null };
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error(error.message || "Erreur lors de la déconnexion");
      return { error };
    }
  };

  // --- Lier données anonymes (Zéna anonyme -> utilisateur) ---
  const linkAnonymousData = async (userId: string) => {
    const sessionToken = localStorage.getItem("anonymous_session_token");
    if (!sessionToken) return;

    try {
      await supabase
        .from("conversation_sessions")
        .update({ user_id: userId })
        .eq("id", sessionToken)
        .is("user_id", null);

      localStorage.removeItem("anonymous_session_token");
    } catch (error) {
      console.error("Erreur liaison données anonymes:", error);
    }
  };

  // --- Connexion anonyme (Zéna mode écoute libre) ---
  const signInAnonymously = async () => {
    try {
      // 🔹 On n'appelle pas supabase.auth.signIn ici (pas nécessaire)
      // On crée juste une "session" logique locale
      const anonId = crypto.randomUUID();
      localStorage.setItem("anonymous_session_token", anonId);

      toast("Mode anonyme activé", {
        description:
          "Zéna t’écoute de façon confidentielle. Tes données ne sont pas liées à un compte.",
      });
      return anonId;
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error("Erreur connexion anonyme:", error);
      toast.error("Impossible d'activer le mode anonyme");
      return null;
    }
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    signInAnonymously, // ✅ pour Zéna en mode libre
  };
};
// ✅ compatibilité anonyme
export async function signInAnonymously(): Promise<string> {
  const { data, error } = await supabase
    .from("conversation_sessions")
    .insert([{ persona: "zena", language: "fr" }])
    .select("id")
    .single();
  if (error) throw error;
  localStorage.setItem("zena_session_id", data.id);
  return data.id;
}
