// src/pages/FamilleDashboardPage.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Family {
  id: string;
  name: string | null;
  created_at: string | null;
}

interface FamilyMember {
  family_id: string;
  user_id: string;
  role: string;
  created_at: string | null;
}

type MemberWithProfile = FamilyMember & {
  profiles?: {
    full_name?: string | null;
    email?: string | null;
    role?: string | null;
  } | null;
};

interface FamilyInvitation {
  id: string;
  code: string;
  role: string;
  expires_at: string | null;
  used_at: string | null;
  created_at: string | null;
}

interface FamilyAlert {
  id: string;
  category: string | null;
  severity: string | null;
  status: string | null;
  created_at: string | null;
  message: string | null;
}

const ROUTES = {
  famille: "/famille",
  create: "/famille/creer",
  invite: "/famille/inviter",
  join: "/famille/rejoindre",
  dashboard: "/famille/dashboard",
};

function formatDateFR(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("fr-FR");
}

function severityLabel(sev?: string | null) {
  const s = (sev ?? "").toLowerCase();
  if (["critique", "critical", "high"].includes(s)) return "critique";
  if (["elevee", "élevée", "medium"].includes(s)) return "élevée";
  if (["faible", "low"].includes(s)) return "faible";
  return s || "ouverte";
}

function severityBadgeClass(sev?: string | null) {
  const s = severityLabel(sev);
  if (s === "critique") return "bg-red-100 text-red-800 border-red-200";
  if (s === "élevée") return "bg-orange-100 text-orange-800 border-orange-200";
  if (s === "faible") return "bg-emerald-100 text-emerald-800 border-emerald-200";
  return "bg-[#FAF6EE] text-[#6F6454] border-[#E8DCC8]";
}

export default function FamilleDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [family, setFamily] = useState<Family | null>(null);
  const [familyId, setFamilyId] = useState<string | null>(null);

  const [members, setMembers] = useState<MemberWithProfile[]>([]);
  const [invitations, setInvitations] = useState<FamilyInvitation[]>([]);
  const [alerts, setAlerts] = useState<FamilyAlert[]>([]);

  const [loading, setLoading] = useState(true);
  const [noFamily, setNoFamily] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeInvitations = useMemo(() => {
    const now = Date.now();
    return invitations.filter((inv) => {
      if (inv.used_at) return false;
      if (!inv.expires_at) return true;
      const exp = new Date(inv.expires_at).getTime();
      return !Number.isNaN(exp) && exp > now;
    });
  }, [invitations]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copié",
        description: "Le code a été copié dans le presse-papier.",
      });
    } catch {
      toast({
        title: "Impossible de copier",
        description: "Copiez manuellement le code affiché.",
        variant: "destructive",
      });
    }
  };

  const fetchMembershipFamilyId = useCallback(async (userId: string) => {
    const { data: membership, error: membershipError } = await supabase
      .from("family_members")
      .select("family_id")
      .eq("user_id", userId)
      .limit(1)
      .maybeSingle();

    if (membershipError) throw membershipError;
    if (!membership?.family_id) return null;
    return membership.family_id as string;
  }, []);

  const fetchFamily = useCallback(async (fid: string) => {
    const { data, error } = await supabase
      .from("families")
      .select("id, name, created_at")
      .eq("id", fid)
      .maybeSingle();

    if (error) throw error;
    return (data ?? null) as Family | null;
  }, []);

  const fetchMembers = useCallback(async (fid: string) => {
    // ✅ Tentative 1 : join profiles (si FK existe)
    const joined = await supabase
      .from("family_members")
      .select("family_id, user_id, role, created_at, profiles(full_name,email,role)")
      .eq("family_id", fid)
      .order("created_at", { ascending: true });

    if (!joined.error && joined.data) {
      return joined.data as MemberWithProfile[];
    }

    // ✅ Fallback : sans join (pas de FK / join non dispo)
    const fallback = await supabase
      .from("family_members")
      .select("family_id, user_id, role, created_at")
      .eq("family_id", fid)
      .order("created_at", { ascending: true });

    if (fallback.error) throw fallback.error;
    return (fallback.data ?? []) as MemberWithProfile[];
  }, []);

  const fetchInvitations = useCallback(async (fid: string) => {
    const { data, error } = await supabase
      .from("family_invitations")
      .select("id, code, role, expires_at, used_at, created_at")
      .eq("family_id", fid)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []) as FamilyInvitation[];
  }, []);

  const fetchAlerts = useCallback(async (fid: string) => {
    const { data, error } = await supabase
      .from("alerts")
      .select("id, category, severity, status, created_at, message")
      .eq("family_id", fid)
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) throw error;
    return (data ?? []) as FamilyAlert[];
  }, []);

  const loadFamilyData = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setErrorMsg(null);
    setNoFamily(false);

    try {
      const fid = await fetchMembershipFamilyId(user.id);

      if (!fid) {
        setFamily(null);
        setFamilyId(null);
        setMembers([]);
        setInvitations([]);
        setAlerts([]);
        setNoFamily(true);
        return;
      }

      setFamilyId(fid);

      const [fam, mem, inv, al] = await Promise.all([
        fetchFamily(fid),
        fetchMembers(fid),
        fetchInvitations(fid),
        fetchAlerts(fid),
      ]);

      setFamily(fam);
      setMembers(mem);
      setInvitations(inv);
      setAlerts(al);
    } catch (e: any) {
      const msg = e?.message ?? "Impossible de charger la famille.";
      setErrorMsg(msg);

      toast({
        title: "Chargement impossible",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, fetchMembershipFamilyId, fetchFamily, fetchMembers, fetchInvitations, fetchAlerts, toast]);

  useEffect(() => {
    if (authLoading) return;

    // Route déjà protégée : si jamais on arrive ici sans user, on stoppe
    if (!user?.id) {
      setLoading(false);
      return;
    }

    loadFamilyData();
  }, [authLoading, user?.id, loadFamilyData]);

  return (
    <div className="bg-[#FAF6EE] text-[#1B1A18]">
      <Navigation />

      <main className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          {/* Header + image consolidation */}
          <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr] items-start">
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-[0.28em] text-[#9C8D77]">
                Dashboard Famille
              </p>

              <h1 className="text-3xl md:text-4xl font-semibold">
                {family?.name || "Votre espace Famille"}
              </h1>

              <p className="text-sm text-[#6F6454] max-w-2xl">
                Ici, vous voyez les membres, les invitations, et les alertes récentes.
                C’est le point central pour consolider le lien et organiser l’essentiel.
              </p>

              <div className="mt-2 flex flex-wrap gap-3">
                <Link
                  to={ROUTES.invite}
                  className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
                >
                  Générer un code d'invitation
                </Link>

                <button
                  type="button"
                  onClick={loadFamilyData}
                  className="inline-flex items-center justify-center rounded-full border border-[#1B1A18]/20 bg-white px-6 py-3 text-sm font-semibold text-[#1B1A18] hover:border-[#1B1A18]/40 transition"
                >
                  Rafraîchir
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-[#F3E0B9]/40 via-transparent to-[#CFECE8]/40 blur-2xl" />
              <div className="relative overflow-hidden rounded-[32px] border border-white/70 shadow-[0_24px_60px_rgba(27,26,24,0.18)]">
                <img
                  src="/famille-still.jpg"
                  alt="Consolidation familiale : soutien et lien"
                  className="h-[220px] w-full object-cover md:h-[260px]"
                  loading="lazy"
                />
              </div>
              <p className="mt-3 text-xs text-[#9C8D77] text-center">
                Le lien est la base : on veille, doucement, ensemble.
              </p>
            </div>
          </div>

          {/* États */}
          {loading ? (
            <div className="mt-10 text-sm text-[#6F6454]">Chargement...</div>
          ) : !user?.id ? (
            <div className="mt-10 rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Connexion requise</h2>
              <p className="text-sm text-[#6F6454] mt-1">
                Vous devez être connecté pour accéder au dashboard Famille.
              </p>
              <div className="mt-4">
                <Link
                  to="/auth/login"
                  className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
                >
                  Se connecter
                </Link>
              </div>
            </div>
          ) : noFamily ? (
            <div className="mt-10 rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Aucun espace Famille trouvé</h2>
              <p className="text-sm text-[#6F6454] mt-1">
                Ce compte n’est rattaché à aucune famille pour le moment.
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
          ) : errorMsg ? (
            <div className="mt-10 rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Erreur de chargement</h2>
              <p className="text-sm text-[#6F6454] mt-1">{errorMsg}</p>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={loadFamilyData}
                  className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
                >
                  Réessayer
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
              {/* Membres */}
              <section className="rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">Membres de la famille</h2>
                    <p className="text-sm text-[#6F6454] mt-1">
                      {members.length} membre(s) enregistrés.
                    </p>
                  </div>
                  <Link
                    to={ROUTES.invite}
                    className="inline-flex items-center justify-center rounded-full border border-[#1B1A18]/20 bg-white px-4 py-2 text-xs font-semibold text-[#1B1A18] hover:border-[#1B1A18]/40 transition"
                  >
                    Inviter
                  </Link>
                </div>

                <div className="mt-4 grid gap-3">
                  {members.length === 0 ? (
                    <div className="rounded-2xl border border-[#E8DCC8] bg-[#FAF6EE] px-4 py-3 text-sm text-[#6F6454]">
                      Aucun membre listé pour le moment. Générez un code pour inviter un ado ou un proche.
                    </div>
                  ) : (
                    members.map((member) => {
                      const displayName =
                        member.profiles?.full_name ||
                        member.profiles?.email ||
                        member.user_id;

                      const displayEmail =
                        member.profiles?.email && member.profiles?.full_name
                          ? member.profiles.email
                          : null;

                      return (
                        <div
                          key={`${member.family_id}-${member.user_id}`}
                          className="flex items-center justify-between gap-4 rounded-2xl border border-[#E8DCC8] bg-[#FAF6EE] px-4 py-3"
                        >
                          <div className="min-w-0">
                            <div className="text-sm font-medium truncate">
                              {displayName}
                            </div>
                            <div className="text-xs text-[#9C8D77]">
                              {displayEmail ? displayEmail : `ID: ${member.user_id}`}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-xs uppercase text-[#9C8D77]">
                              {member.role}
                            </div>
                            <div className="text-[11px] text-[#6F6454]">
                              depuis {formatDateFR(member.created_at)}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="mt-6 rounded-2xl border border-[#E8DCC8] bg-white px-4 py-3">
                  <div className="text-sm font-semibold">Espace commun</div>
                  <p className="text-xs text-[#6F6454] mt-1">
                    Prochaine étape : messages, calendrier partagé et activités familiales.
                    On le branche juste après les invitations / rejoindre.
                  </p>
                </div>
              </section>

              {/* Colonne droite */}
              <section className="space-y-6">
                {/* Invitations */}
                <div className="rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold">Invitations</h2>
                      <p className="text-sm text-[#6F6454] mt-1">
                        {activeInvitations.length} active(s) • {invitations.length} au total
                      </p>
                    </div>
                    <Link
                      to={ROUTES.invite}
                      className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-4 py-2 text-xs font-semibold hover:opacity-90 transition"
                    >
                      Créer
                    </Link>
                  </div>

                  <div className="mt-4 grid gap-3">
                    {invitations.length === 0 ? (
                      <div className="rounded-2xl border border-[#E8DCC8] bg-[#FAF6EE] px-4 py-3 text-sm text-[#6F6454]">
                        Aucune invitation pour le moment. Créez un code pour inviter un ado ou un proche.
                      </div>
                    ) : (
                      invitations.slice(0, 6).map((invite) => (
                        <div
                          key={invite.id}
                          className="rounded-2xl border border-[#E8DCC8] bg-[#FAF6EE] px-4 py-3 text-sm"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-semibold tracking-[0.25em]">
                              {invite.code}
                            </span>

                            <span className="text-xs uppercase text-[#9C8D77]">
                              {invite.role}
                            </span>
                          </div>

                          <div className="mt-2 flex items-center justify-between gap-3">
                            <div className="text-xs text-[#6F6454]">
                              {invite.used_at
                                ? "Utilisée"
                                : invite.expires_at
                                ? `Expire le ${formatDateFR(invite.expires_at)}`
                                : "Valable sans expiration"}
                            </div>

                            {!invite.used_at ? (
                              <button
                                type="button"
                                onClick={() => copyToClipboard(invite.code)}
                                className="inline-flex items-center justify-center rounded-full border border-[#1B1A18]/20 bg-white px-3 py-1 text-[11px] font-semibold text-[#1B1A18] hover:border-[#1B1A18]/40 transition"
                              >
                                Copier
                              </button>
                            ) : null}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <p className="mt-4 text-xs text-[#9C8D77]">
                    Conseil : partagez le code uniquement avec la personne concernée.
                  </p>
                </div>

                {/* Alertes */}
                <div className="rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-semibold">Alertes récentes</h2>
                  <p className="text-sm text-[#6F6454] mt-1">
                    {alerts.length} alerte(s) ouvertes ou récentes.
                  </p>

                  <div className="mt-4 grid gap-3">
                    {alerts.length === 0 ? (
                      <div className="rounded-2xl border border-[#E8DCC8] bg-[#FAF6EE] px-4 py-3 text-sm text-[#6F6454]">
                        Aucune alerte récente. Tout va bien pour le moment.
                      </div>
                    ) : (
                      alerts.map((alert) => (
                        <div
                          key={alert.id}
                          className="rounded-2xl border border-[#E8DCC8] bg-[#FAF6EE] px-4 py-3 text-sm"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-medium">
                              {alert.category || "Alerte"}
                            </span>

                            <span
                              className={[
                                "text-xs uppercase px-2 py-1 rounded-full border",
                                severityBadgeClass(alert.severity || alert.status),
                              ].join(" ")}
                            >
                              {severityLabel(alert.severity || alert.status)}
                            </span>
                          </div>

                          {alert.message ? (
                            <p className="text-xs text-[#6F6454] mt-2">
                              {alert.message}
                            </p>
                          ) : null}

                          <p className="text-[11px] text-[#9C8D77] mt-2">
                            {formatDateFR(alert.created_at)}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  <p className="mt-4 text-xs text-[#9C8D77]">
                    ZÉNA ne remplace pas les urgences. En cas de danger immédiat, contactez les secours.
                  </p>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
