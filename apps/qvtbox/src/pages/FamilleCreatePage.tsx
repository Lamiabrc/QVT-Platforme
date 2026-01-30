// src/pages/FamilleCreatePage.tsx
import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const ROUTES = {
  famille: "/famille",
  create: "/famille/creer",
  invite: "/famille/inviter",
  join: "/famille/rejoindre",
  dashboard: "/famille/dashboard",
  choisirSphere: "/choisir-sphere",
};

export default function FamilleCreatePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, confirmAuth } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);

  const [checkingExisting, setCheckingExisting] = useState(false);
  const [creatingForLoggedIn, setCreatingForLoggedIn] = useState(false);
  const [alreadyHasFamily, setAlreadyHasFamily] = useState<boolean | null>(null);

  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  const ensureProfile = async (userId: string, userEmail: string, name: string) => {
    const { data: profile, error: readError } = await supabase
      .from("profiles")
      .select("id, family_id")
      .eq("id", userId)
      .maybeSingle();

    if (readError) throw readError;

    if (!profile) {
      const { error } = await supabase.from("profiles").insert({
        id: userId,
        email: userEmail,
        full_name: name,
        role: "parent",
      });

      if (error) throw error;
      return { family_id: null as string | null };
    }

    return { family_id: (profile as any).family_id ?? null };
  };

  const createFamilyAndMembership = async (userId: string, name: string, userEmail: string) => {
    // 1) Profile (idempotent)
    const profileInfo = await ensureProfile(userId, userEmail, name);

    // Si déjà rattaché à une famille → on file au dashboard
    if (profileInfo.family_id) {
      return { familyId: profileInfo.family_id };
    }

    // 2) Create family
    const familyName = `Famille de ${name}`.trim() || "Ma Famille";

    const { data: family, error: familyError } = await supabase
      .from("families")
      .insert({ name: familyName, created_by: userId })
      .select("id")
      .single();

    if (familyError) throw familyError;

    // 3) Create membership
    const { error: membershipError } = await supabase.from("family_members").insert({
      family_id: family.id,
      user_id: userId,
      role: "parent",
    });

    if (membershipError) throw membershipError;

    // 4) Attach profile to family
    const { error: updateProfileError } = await supabase
      .from("profiles")
      .update({ family_id: family.id })
      .eq("id", userId);

    if (updateProfileError) throw updateProfileError;

    return { familyId: family.id as string };
  };

  // ✅ Si l’utilisateur est déjà connecté, on vérifie s’il a déjà une famille.
  useEffect(() => {
    const run = async () => {
      if (!isAuthenticated || !user?.id) return;

      setCheckingExisting(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("family_id")
          .eq("id", user.id)
          .maybeSingle();

        if (error) throw error;

        const famId = (data as any)?.family_id ?? null;
        if (famId) {
          setAlreadyHasFamily(true);
          // petit confort : si déjà configuré, on redirige direct
          navigate(ROUTES.dashboard, { replace: true });
        } else {
          setAlreadyHasFamily(false);
        }
      } catch (e) {
        console.error(e);
        // si on ne peut pas lire le profil, on laisse la page afficher le mode “Créer”
        setAlreadyHasFamily(false);
      } finally {
        setCheckingExisting(false);
      }
    };

    run();
  }, [isAuthenticated, user?.id, navigate]);

  const validateForm = () => {
    if (!fullName.trim() || !normalizedEmail || !password) {
      toast({
        title: "Champs incomplets",
        description: "Merci de renseigner nom, email et mot de passe.",
        variant: "destructive",
      });
      return false;
    }

    if (password.length < 6) {
      toast({
        title: "Mot de passe trop court",
        description: "Utilisez au moins 6 caractères.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setPendingEmail(null);

    try {
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : undefined;

      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            full_name: fullName.trim(),
            default_sphere: "family",
          },
        },
      });

      if (error) throw error;

      // Supabase peut renvoyer session = null si confirmation email requise
      const sessionUser = data.session?.user ?? null;

      if (!sessionUser) {
        setPendingEmail(normalizedEmail);
        toast({
          title: "Vérification email requise",
          description:
            "Votre compte est créé. Vérifiez votre email pour finaliser l'inscription, puis revenez ici ou connectez-vous.",
        });
        return;
      }

      // ✅ Confirme l’auth côté app (même si auto-confirm existe)
      await confirmAuth();

      const userId = sessionUser.id;

      await createFamilyAndMembership(userId, fullName.trim(), normalizedEmail);

      toast({
        title: "Espace famille créé",
        description: "Votre espace Famille est prêt.",
      });

      navigate(ROUTES.dashboard);
    } catch (error: any) {
      toast({
        title: "Impossible de créer le compte",
        description: error?.message ?? "Réessayez plus tard.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFamilyForLoggedInUser = async () => {
    if (!user?.id) return;

    setCreatingForLoggedIn(true);
    try {
      const emailToUse = (user.email ?? normalizedEmail ?? "").toLowerCase().trim();
      const nameToUse = fullName.trim() || (user.user_metadata as any)?.full_name || "Parent";

      const { familyId } = await createFamilyAndMembership(user.id, nameToUse, emailToUse);

      toast({
        title: "Espace famille créé",
        description: "Votre espace Famille est prêt.",
      });

      navigate(ROUTES.dashboard);
      return familyId;
    } catch (error: any) {
      toast({
        title: "Impossible de créer l'espace Famille",
        description: error?.message ?? "Réessayez plus tard.",
        variant: "destructive",
      });
    } finally {
      setCreatingForLoggedIn(false);
    }
  };

  const handleResend = async () => {
    if (!pendingEmail) return;
    setResendLoading(true);

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: pendingEmail,
      });

      if (error) throw error;

      toast({
        title: "Email renvoyé",
        description: "Vérifiez votre boîte de réception (et vos spams).",
      });
    } catch (error: any) {
      toast({
        title: "Impossible de renvoyer",
        description: error?.message ?? "Réessayez plus tard.",
        variant: "destructive",
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF6EE] text-[#1B1A18]">
      <Navigation />

      <main className="py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-xs uppercase tracking-[0.28em] text-[#9C8D77]">
            Sphère Famille
          </p>

          <h1 className="text-3xl md:text-4xl font-semibold mt-4">
            Créer votre espace Famille &amp; Ado
          </h1>

          <p className="text-sm text-[#6F6454] mt-3">
            MVP : démarrez un essai sans paiement pour configurer votre espace
            et inviter un ado ou un tuteur.
          </p>

          {/* ✅ Mode “déjà connecté” : création d’espace famille sans re-créer un compte */}
          {isAuthenticated ? (
            <div className="mt-8 rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm">
              <div className="text-sm text-[#6F6454]">
                <div className="font-semibold text-[#1B1A18]">
                  Vous êtes déjà connecté.
                </div>
                <p className="mt-1">
                  Créez votre espace Famille en un clic (ou accédez-y si vous l’avez déjà).
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={creatingForLoggedIn || checkingExisting || alreadyHasFamily === true}
                    onClick={handleCreateFamilyForLoggedInUser}
                    className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-6 py-3 text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
                  >
                    {checkingExisting
                      ? "Vérification..."
                      : alreadyHasFamily
                      ? "Espace déjà configuré"
                      : creatingForLoggedIn
                      ? "Création..."
                      : "Créer mon espace Famille"}
                  </button>

                  <Link
                    to={ROUTES.dashboard}
                    className="inline-flex items-center justify-center rounded-full border border-[#1B1A18]/20 bg-white px-6 py-3 text-sm font-semibold text-[#1B1A18] hover:border-[#1B1A18]/40 transition"
                  >
                    Aller au dashboard
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 md:grid-cols-[1fr,0.9fr]">
              <form className="grid gap-4" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Nom et prénom"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="w-full rounded-2xl border border-[#E8DCC8] bg-white px-4 py-3 text-sm"
                  autoComplete="name"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-[#E8DCC8] bg-white px-4 py-3 text-sm"
                  autoComplete="email"
                />
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-[#E8DCC8] bg-white px-4 py-3 text-sm"
                  autoComplete="new-password"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-6 py-3 text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
                >
                  {loading ? "Création en cours..." : "Démarrer mon essai"}
                </button>

                {pendingEmail ? (
                  <div className="rounded-2xl border border-[#E8DCC8] bg-white px-4 py-3 text-xs text-[#6F6454]">
                    <div className="font-semibold text-[#1B1A18]">
                      Vérification email requise
                    </div>
                    <p className="mt-1">
                      Votre compte est créé. Vérifiez votre email pour finaliser
                      l&apos;inscription, puis connectez-vous.
                    </p>
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resendLoading}
                      className="mt-3 inline-flex items-center justify-center rounded-full border border-[#1B1A18]/20 bg-white px-3 py-1 text-[11px] font-semibold text-[#1B1A18] disabled:opacity-60"
                    >
                      {resendLoading ? "Envoi..." : "Renvoyer l'email"}
                    </button>
                  </div>
                ) : null}
              </form>

              <div className="rounded-3xl border border-[#E8DCC8] bg-white p-6 text-sm text-[#6F6454] shadow-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-[#9C8D77]">
                  Parcours en 3 étapes
                </p>
                <ol className="mt-4 space-y-3">
                  <li>1. Créez votre compte famille (parent/tuteur).</li>
                  <li>2. Générez un code pour inviter un ado ou un proche.</li>
                  <li>3. Activez les alertes et le planning partagé.</li>
                </ol>
                <p className="mt-4 text-xs text-[#9C8D77]">
                  ZÉNA ne remplace pas les urgences. En cas de danger immédiat,
                  contactez les secours.
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-[#6F6454]">
            <Link to={ROUTES.famille} className="underline">
              Retour à l'offre Famille
            </Link>
            <span>•</span>
            <Link to={ROUTES.choisirSphere} className="underline">
              Choisir un autre univers
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
