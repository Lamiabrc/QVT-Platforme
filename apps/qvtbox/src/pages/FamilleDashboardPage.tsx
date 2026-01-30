// src/pages/FamilleDashboardPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AuthGuard from "@/components/AuthGuard";
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

export default function FamilleDashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [family, setFamily] = useState<Family | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [invitations, setInvitations] = useState<FamilyInvitation[]>([]);
  const [alerts, setAlerts] = useState<FamilyAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadFamilyData();
    }
  }, [user]);

  const loadFamilyData = async () => {
    if (!user) return;

    try {
      const { data: membership, error: membershipError } = await supabase
        .from("family_members")
        .select("family_id")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      if (membershipError || !membership) {
        throw new Error("Aucune famille associée à ce compte.");
      }

      const { data: familyData, error: familyError } = await supabase
        .from("families")
        .select("id, name, created_at")
        .eq("id", membership.family_id)
        .maybeSingle();

      if (familyError) {
        throw familyError;
      }

      setFamily(familyData ?? null);

      const { data: membersData } = await supabase
        .from("family_members")
        .select("family_id, user_id, role, created_at")
        .eq("family_id", membership.family_id)
        .order("created_at", { ascending: true });

      setMembers(membersData || []);

      const { data: inviteData } = await supabase
        .from("family_invitations")
        .select("id, code, role, expires_at, used_at, created_at")
        .eq("family_id", membership.family_id)
        .order("created_at", { ascending: false });

      setInvitations(inviteData || []);

      const { data: alertData } = await supabase
        .from("alerts")
        .select("id, category, severity, status, created_at, message")
        .eq("family_id", membership.family_id)
        .order("created_at", { ascending: false })
        .limit(5);

      setAlerts(alertData || []);
    } catch (error: any) {
      toast({
        title: "Chargement impossible",
        description: error?.message ?? "Impossible de charger la famille.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="bg-[#FAF6EE] text-[#1B1A18]">
        <Navigation />

        <main className="py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#9C8D77]">
                  Dashboard Famille
                </p>
                <h1 className="text-3xl md:text-4xl font-semibold mt-3">
                  {family?.name || "Votre espace Famille"}
                </h1>
              </div>
              <Link
                to="/famille/inviter"
                className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
              >
                Générer un code d'invitation
              </Link>
            </div>

            {loading ? (
              <div className="mt-10 text-sm text-[#6F6454]">Chargement...</div>
            ) : (
              <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
                <section className="rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-semibold">Membres de la famille</h2>
                  <p className="text-sm text-[#6F6454] mt-1">
                    {members.length} membre(s) enregistrés.
                  </p>
                  <div className="mt-4 grid gap-3">
                    {members.map((member) => (
                      <div
                        key={`${member.family_id}-${member.user_id}`}
                        className="flex items-center justify-between rounded-2xl border border-[#E8DCC8] bg-[#FAF6EE] px-4 py-3 text-sm"
                      >
                        <span className="font-medium">{member.user_id}</span>
                        <span className="text-[#9C8D77] uppercase text-xs">
                          {member.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-6">
                  <div className="rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold">Invitations actives</h2>
                    <p className="text-sm text-[#6F6454] mt-1">
                      {invitations.length} invitation(s) générées.
                    </p>
                    <div className="mt-4 grid gap-3">
                      {invitations.map((invite) => (
                        <div
                          key={invite.id}
                          className="rounded-2xl border border-[#E8DCC8] bg-[#FAF6EE] px-4 py-3 text-sm"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold tracking-[0.25em]">
                              {invite.code}
                            </span>
                            <span className="text-xs uppercase text-[#9C8D77]">
                              {invite.role}
                            </span>
                          </div>
                          <div className="text-xs text-[#6F6454] mt-2">
                            {invite.used_at
                              ? "Utilisée"
                              : invite.expires_at
                              ? `Expire le ${new Date(invite.expires_at).toLocaleDateString("fr-FR")}`
                              : "Valable sans expiration"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold">Alertes récentes</h2>
                    <p className="text-sm text-[#6F6454] mt-1">
                      {alerts.length} alerte(s) ouvertes ou récentes.
                    </p>
                    <div className="mt-4 grid gap-3">
                      {alerts.map((alert) => (
                        <div
                          key={alert.id}
                          className="rounded-2xl border border-[#E8DCC8] bg-[#FAF6EE] px-4 py-3 text-sm"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              {alert.category || "Alerte"}
                            </span>
                            <span className="text-xs uppercase text-[#9C8D77]">
                              {alert.severity || alert.status || "ouverte"}
                            </span>
                          </div>
                          {alert.message ? (
                            <p className="text-xs text-[#6F6454] mt-2">
                              {alert.message}
                            </p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}
