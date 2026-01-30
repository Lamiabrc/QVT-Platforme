// src/pages/FamilleInvitePage.tsx
import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const ROUTES = {
  famille: "/famille",
  create: "/famille/creer",
  invite: "/famille/inviter",
  join: "/famille/rejoindre",
  dashboard: "/famille/dashboard",
  login: "/auth/login",
};

const generateInviteCode = () => {
  // 8 chars A-Z/0-9
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => (b % 36).toString(36))
    .join("")
    .toUpperCase();
};

function formatDateFR(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("fr-FR");
}

type Invitation = {
  id: string;
  code: string;
  role: string;
  expires_at: string | null;
  used_at: string | null;
  created_at: string | null;
};

export default function FamilleInvitePage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [familyId, setFamilyId] = useState<string | null>(null);
  const [familyName, setFamilyName] = useState<string | null>(null);

  const [role, setRole] = useState<"teen" | "child" | "tutor">("teen");
  const [loading, setLoading] = useState(false);

  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [generatedExpiresAt, setGeneratedExpiresAt] = useState<string | null>(null);

  const [invites, setInvites] = useState<Invitation[]>([]);
  const [loadingInvites, setLoadingInvites] = useState(false);

  const canGenerate = Boolean(isAuthenticated && user?.id && familyId);

  const inviteLink = useMemo(() => {
    if (!generatedCode) return null;
    if (typeof window === "undefined") return `/famille/rejoindre`;
    return `${window.location.origin}${ROUTES.join}?code=${encodeURIComponent(generatedCode)}`;
  }, [generatedCode]);

  const activeInvites = useMemo(() => {
    const now = Date.now();
    return invites.filter((inv) => {
      if (inv.used_at) return false;
      if (!inv.expires_at) return true;
      const exp = new Date(inv.expires_at).getTime();
      return !Number.isNaN(exp) && exp > now;
    });
  }, [invites]);

  const loadFamilyId = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from("family_members")
      .select("family_id")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(error);
      setFamilyId(null);
      return;
    }

    const fid = data?.family_id ?? null;
    setFamilyId(fid);

    if (fid) {
      const { data: fam } = await supabase
        .from("families")
        .select("name")
        .eq("id", fid)
        .maybeSingle();

      setFamilyName(fam?.name ?? null);
    } else {
      setFamilyName(null);
    }
  };

  const loadInvites = async (fid: string) => {
    setLoadingInvites(true);
    try {
      const { data, error } = await supabase
        .from("family_invitations")
        .select("id, code, role, expires_at, used_at, created_at")
        .eq("family_id", fid)
        .order("created_at", { ascending: false })
        .limit(8);

      if (error) throw error;
      setInvites((data ?? []) as Invitation[]);
    } catch (e) {
      console.error(e);
      setInvites([]);
    } finally {
      setLoadingInvites(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !user?.id) return;

    loadFamilyId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated, user?.id]);

  useEffect(() => {
    if (!familyId) return;
    loadInvites(familyId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [familyId]);

  const safeCopy = async (text: string, successMsg: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: successMsg });
    } catch {
      toast({
        title: "Impossible de copier automatiquement",
        description: "Copiez manuellement le contenu affiché.",
        variant: "destructive",
      });
    }
  };

  const handleGenerate = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!canGenerate) {
      toast({
        title: "Accès impossible",
        description: !isAuthenticated
          ? "Connectez-vous pour générer un code."
          : "Aucun espace Famille associé. Créez d'abord un espace Famille.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setGeneratedCode(null);
    setGeneratedExpiresAt(null);

    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      // ✅ on retente si collision (code déjà utilisé)
      let code = "";
      let lastError: any = null;

      for (let attempt = 0; attempt < 5; attempt++) {
        code = generateInviteCode();

        const { error } = await supabase.from("family_invitations").insert({
          family_id: familyId,
          code,
          role,
          expires_at: expiresAt.toISOString(),
          created_by: user?.id ?? null,
        });

        if (!error) {
          lastError = null;
          break;
        }

        lastError = error;
        // si collision unique, on retente ; sinon on stop
        if (
          !String(error.message || "").toLowerCase().includes("duplicate") &&
          !String(error.code || "").toLowerCase().includes("23505")
        ) {
          break;
        }
      }

      if (lastError) throw lastError;

      setGeneratedCode(code);
      setGeneratedExpiresAt(expiresAt.toISOString());

      toast({
        title: "Code généré",
        description: "Partagez ce code avec la personne à inviter.",
      });

      // refresh liste
      if (familyId) loadInvites(familyId);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error?.message ?? "Impossible de générer le code.",
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

          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold">
                Inviter un proche
              </h1>
              <p className="text-sm text-[#6F6454] mt-3">
                Générez un code d’invitation pour un ado, un enfant ou un tuteur.
                {familyName ? ` (Espace : ${familyName})` : ""}
              </p>
            </div>

            <Link
              to={ROUTES.dashboard}
              className="inline-flex items-center justify-center rounded-full border border-[#1B1A18]/20 bg-white px-5 py-2 text-sm font-semibold text-[#1B1A18] hover:border-[#1B1A18]/40 transition"
            >
              Retour dashboard
            </Link>
          </div>

          {/* Image douce (consolidation) */}
          <div className="mt-8 relative overflow-hidden rounded-3xl border border-[#E8DCC8] bg-white shadow-sm">
            <img
              src="/famille-still.jpg"
              alt="Lien familial et soutien"
              className="h-44 w-full object-cover"
              loading="lazy"
            />
            <div className="p-4">
              <p className="text-xs text-[#9C8D77]">
                Invitation = lien protégé. Partagez le code uniquement avec la personne concernée.
              </p>
            </div>
          </div>

          {/* États non connectés / pas de famille */}
          {!authLoading && !isAuthenticated ? (
            <div className="mt-8 rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Connexion requise</h2>
              <p className="text-sm text-[#6F6454] mt-1">
                Vous devez être connecté pour générer un code d’invitation.
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
                  Créer un espace Famille
                </Link>
              </div>
            </div>
          ) : !authLoading && isAuthenticated && !familyId ? (
            <div className="mt-8 rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Aucun espace Famille associé</h2>
              <p className="text-sm text-[#6F6454] mt-1">
                Pour inviter quelqu’un, votre compte doit être rattaché à une famille.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to={ROUTES.create}
                  className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
                >
                  Créer mon espace Famille
                </Link>
                <Link
                  to={ROUTES.join}
                  className="inline-flex items-center justify-center rounded-full border border-[#1B1A18]/20 bg-white px-6 py-3 text-sm font-semibold text-[#1B1A18] hover:border-[#1B1A18]/40 transition"
                >
                  Rejoindre une famille
                </Link>
              </div>
            </div>
          ) : null}

          {/* Form génération */}
          <form className="mt-8 grid gap-4" onSubmit={handleGenerate}>
            <label className="text-sm font-semibold">Rôle de la personne invitée</label>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as any)}
              className="w-full rounded-2xl border border-[#E8DCC8] bg-white px-4 py-3 text-sm"
              disabled={!canGenerate || loading}
            >
              <option value="teen">Ado</option>
              <option value="child">Enfant</option>
              <option value="tutor">Tuteur / Tutrice</option>
            </select>

            <button
              type="submit"
              disabled={loading || !canGenerate}
              className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-6 py-3 text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Génération..." : "Générer un code"}
            </button>

            <p className="text-xs text-[#9C8D77]">
              Le code est valable 7 jours. Une fois utilisé, il expire.
            </p>
          </form>

          {/* Résultat */}
          {generatedCode ? (
            <div className="mt-6 rounded-3xl border border-[#E8DCC8] bg-white p-6">
              <div className="text-xs uppercase tracking-[0.24em] text-[#9C8D77]">
                Code d’invitation
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-lg font-semibold tracking-[0.35em]">
                  {generatedCode}
                </span>

                <button
                  type="button"
                  onClick={() => safeCopy(generatedCode, "Code copié")}
                  className="text-xs underline text-[#1B1A18]"
                >
                  Copier
                </button>
              </div>

              <div className="mt-3 text-xs text-[#6F6454]">
                Expire le {formatDateFR(generatedExpiresAt)}
              </div>

              {inviteLink ? (
                <div className="mt-4 rounded-2xl border border-[#E8DCC8] bg-[#FAF6EE] px-4 py-3">
                  <div className="text-xs font-semibold text-[#1B1A18]">
                    Lien direct (optionnel)
                  </div>
                  <div className="mt-2 text-xs break-all text-[#6F6454]">
                    {inviteLink}
                  </div>
                  <button
                    type="button"
                    onClick={() => safeCopy(inviteLink, "Lien copié")}
                    className="mt-3 inline-flex items-center justify-center rounded-full border border-[#1B1A18]/20 bg-white px-3 py-1 text-[11px] font-semibold text-[#1B1A18]"
                  >
                    Copier le lien
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Liste invitations actives */}
          {familyId ? (
            <div className="mt-8 rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Invitations actives</h2>
                  <p className="text-sm text-[#6F6454] mt-1">
                    {loadingInvites
                      ? "Chargement..."
                      : `${activeInvites.length} active(s) (dernières 8 affichées)`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => loadInvites(familyId)}
                  className="inline-flex items-center justify-center rounded-full border border-[#1B1A18]/20 bg-white px-4 py-2 text-xs font-semibold text-[#1B1A18] hover:border-[#1B1A18]/40 transition"
                >
                  Rafraîchir
                </button>
              </div>

              <div className="mt-4 grid gap-3">
                {!loadingInvites && invites.length === 0 ? (
                  <div className="rounded-2xl border border-[#E8DCC8] bg-[#FAF6EE] px-4 py-3 text-sm text-[#6F6454]">
                    Aucune invitation pour le moment.
                  </div>
                ) : (
                  invites.map((inv) => (
                    <div
                      key={inv.id}
                      className="rounded-2xl border border-[#E8DCC8] bg-[#FAF6EE] px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold tracking-[0.25em]">
                            {inv.code}
                          </div>
                          <div className="text-xs text-[#6F6454] mt-1">
                            {inv.used_at
                              ? "Utilisée"
                              : inv.expires_at
                              ? `Expire le ${formatDateFR(inv.expires_at)}`
                              : "Valable sans expiration"}{" "}
                            • rôle : <span className="uppercase">{inv.role}</span>
                          </div>
                        </div>

                        {!inv.used_at ? (
                          <button
                            type="button"
                            onClick={() => safeCopy(inv.code, "Code copié")}
                            className="inline-flex items-center justify-center rounded-full border border-[#1B1A18]/20 bg-white px-3 py-1 text-[11px] font-semibold text-[#1B1A18]"
                          >
                            Copier
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : null}

          <div className="mt-8 text-sm text-[#6F6454]">
            J’ai déjà un code ?{" "}
            <Link to={ROUTES.join} className="underline">
              Rejoindre une famille
            </Link>
            <span className="mx-2">•</span>
            <Link to={ROUTES.dashboard} className="underline">
              Retour au dashboard
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
