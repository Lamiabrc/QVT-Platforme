// src/pages/FamilleJoinPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const ROUTES = {
  famille: "/famille",
  create: "/famille/creer",
  join: "/famille/rejoindre",
  dashboard: "/famille/dashboard",
  login: "/auth/login",
};

type Invitation = {
  id: string;
  family_id: string;
  role: string;
  expires_at: string | null;
  used_at: string | null;
  // used_by peut exister ou non selon ton schéma
  used_by?: string | null;
};

function formatCode(raw: string) {
  return raw.trim().toUpperCase().replace(/\s+/g, "");
}

export default function FamilleJoinPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();

  const initialCodeFromUrl = useMemo(() => {
    const c = searchParams.get("code");
    return c ? formatCode(c) : "";
  }, [searchParams]);

  const [code, setCode] = useState(initialCodeFromUrl);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // si l’URL change (ou arrive après), on garde l’input sync
    if (initialCodeFromUrl && !code) setCode(initialCodeFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCodeFromUrl]);

  const ensureProfile = async (userId: string, email?: string | null) => {
    const { data: profile, error: readError } = await supabase
      .from("profiles")
      .select("id, family_id")
      .eq("id", userId)
      .maybeSingle();

    if (readError) throw readError;

    if (!profile) {
      const { error: insertError } = await supabase.from("profiles").insert({
        id: userId,
        email: email ?? null,
        role: "teen", // valeur par défaut (sera cohérente ensuite via family_members.role)
      });

      if (insertError) throw insertError;
      return { family_id: null as string | null };
    }

    return { family_id: (profile as any).family_id ?? null };
  };

  const markInvitationUsed = async (inviteId: string, userId: string) => {
    // 1) On tente used_at + used_by (si colonne existe)
    const now = new Date().toISOString();

    const attempt1 = await supabase
      .from("family_invitations")
      .update({ used_at: now, used_by: userId } as any)
      .eq("id", inviteId);

    if (!attempt1.error) return;

    // 2) Fallback : used_at seulement (si used_by n’existe pas)
    const attempt2 = await supabase
      .from("family_invitations")
      .update({ used_at: now })
      .eq("id", inviteId);

    if (attempt2.error) throw attempt2.error;
  };

  const handleJoin = async (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedCode = formatCode(code);
    if (!normalizedCode) {
      toast({
        title: "Code requis",
        description: "Entrez un code d'invitation.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // 1) Vérifie l’invitation (même si pas connecté, ça permet de donner un bon message)
      const { data: invite, error: inviteError } = await supabase
        .from("family_invitations")
        .select("id, family_id, role, expires_at, used_at")
        .eq("code", normalizedCode)
        .maybeSingle();

      if (inviteError) throw inviteError;
      if (!invite) throw new Error("Code invalide.");

      const inv = invite as Invitation;

      if (inv.used_at) {
        throw new Error("Ce code a déjà été utilisé.");
      }

      if (inv.expires_at && new Date(inv.expires_at).getTime() < Date.now()) {
        throw new Error("Ce code a expiré.");
      }

      // 2) Si pas connecté → on demande de se connecter (sans bloquer la page)
      if (!isAuthenticated || !user?.id) {
        toast({
          title: "Connexion requise",
          description:
            "Connectez-vous (ou créez un compte) puis revenez sur cette page pour rejoindre la famille.",
          variant: "destructive",
        });
        return;
      }

      // 3) Profil (idempotent)
      const profile = await ensureProfile(user.id, user.email);

      // 4) Si déjà rattaché à une famille (via profil) → on redirige
      if (profile.family_id) {
        navigate(ROUTES.dashboard, { replace: true });
        return;
      }

      // 5) Ajout membre (si déjà membre, on continue sans casser)
      const insertRes = await supabase.from("family_members").insert({
        family_id: inv.family_id,
        user_id: user.id,
        role: inv.role,
      });

      if (insertRes.error) {
        const msg = String(insertRes.error.message || "").toLowerCase();
        const codeStr = String((insertRes.error as any).code || "");
        const isDuplicate =
          msg.includes("duplicate") || codeStr.includes("23505") || msg.includes("already exists");

        if (!isDuplicate) throw insertRes.error;
        // duplicate => déjà membre, on continue
      }

      // 6) Update profile.family_id (idempotent)
      const upd = await supabase
        .from("profiles")
        .update({ family_id: inv.family_id })
        .eq("id", user.id);

      if (upd.error) throw upd.error;

      // 7) Marque l’invitation utilisée (pour éviter toute réutilisation)
      await markInvitationUsed(inv.id, user.id);

      toast({
        title: "Bienvenue",
        description: "Vous avez rejoint la famille.",
      });

      navigate(ROUTES.dashboard);
    } catch (error: any) {
      toast({
        title: "Impossible de rejoindre",
        description: error?.message ?? "Réessayez plus tard.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
            Rejoindre une famille
          </h1>

          <p className="text-sm text-[#6F6454] mt-3">
            Entrez le code d&apos;invitation reçu pour rejoindre un espace Famille.
          </p>

          {/* Image “consolidation” (discrète) */}
          <div className="mt-8 relative overflow-hidden rounded-3xl border border-[#E8DCC8] bg-white shadow-sm">
            <img
              src="/famille-still.jpg"
              alt="Lien familial, soutien et confiance"
              className="h-44 w-full object-cover"
              loading="lazy"
            />
            <div className="p-4">
              <p className="text-xs text-[#9C8D77]">
                Astuce : si vous avez reçu un lien, le code peut déjà être pré-rempli.
              </p>
            </div>
          </div>

          {/* Si pas connecté, on explique clairement */}
          {!authLoading && !isAuthenticated ? (
            <div className="mt-8 rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Connexion nécessaire</h2>
              <p className="text-sm text-[#6F6454] mt-1">
                Vous pouvez saisir le code maintenant, puis vous connecter pour finaliser l&apos;adhésion.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to={ROUTES.login}
                  className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
                >
                  Se connecter
                </Link>
                <Link
                  to={ROUTES.create}
                  className="inline-flex items-center justify-center rounded-full border border-[#1B1A18]/20 bg-white px-6 py-3 text-sm font-semibold text-[#1B1A18] hover:border-[#1B1A18]/40 transition"
                >
                  Créer un compte Famille
                </Link>
              </div>
            </div>
          ) : null}

          <form className="mt-8 grid gap-4" onSubmit={handleJoin}>
            <input
              type="text"
              placeholder="Code d'invitation"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              className="w-full rounded-2xl border border-[#E8DCC8] bg-white px-4 py-3 text-sm uppercase tracking-[0.2em]"
            />

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-6 py-3 text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Connexion en cours..." : "Rejoindre la famille"}
            </button>

            <p className="text-xs text-[#9C8D77]">
              Si vous n’êtes pas connecté, connectez-vous puis cliquez à nouveau sur “Rejoindre”.
            </p>
          </form>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-[#6F6454]">
            <Link to={ROUTES.create} className="underline">
              Créer un compte Famille
            </Link>
            <span>•</span>
            <Link to={ROUTES.famille} className="underline">
              Retour à l'offre Famille
            </Link>
            <span>•</span>
            <Link to={ROUTES.dashboard} className="underline">
              Aller au dashboard
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
