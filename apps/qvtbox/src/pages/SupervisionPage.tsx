import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useZenaFamily } from "@/hooks/useZenaFamily";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function SupervisionPage() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { isAppAdmin, fetchAlerts, fetchRiskFlags } = useZenaFamily();

  const [isAdmin, setIsAdmin] = useState(false);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [riskFlags, setRiskFlags] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const load = async () => {
      const ok = await isAppAdmin();
      setIsAdmin(ok);
      if (!ok) return;
      const [alertsData, flagsData] = await Promise.all([
        fetchAlerts(),
        fetchRiskFlags(),
      ]);
      setAlerts(alertsData);
      setRiskFlags(flagsData);
    };
    load();
  }, [fetchAlerts, fetchRiskFlags, isAppAdmin, isAuthenticated]);

  const handleResolveRiskFlag = async (flagId: string) => {
    try {
      const { error } = await supabase
        .from("risk_flags")
        .update({
          status: "resolved",
          resolved_at: new Date().toISOString(),
          resolved_by: user?.id ?? null,
        })
        .eq("id", flagId);
      if (error) throw error;
      const refreshed = await fetchRiskFlags();
      setRiskFlags(refreshed);
      toast({ title: "Flag resolu" });
    } catch (error: any) {
      toast({
        title: "Impossible de resoudre",
        description: error?.message ?? "Reessayez plus tard.",
        variant: "destructive",
      });
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from("alerts")
        .update({ status: "resolved", resolved_at: new Date().toISOString() })
        .eq("id", alertId);
      if (error) throw error;
      const refreshed = await fetchAlerts();
      setAlerts(refreshed);
      toast({ title: "Alerte resolue" });
    } catch (error: any) {
      toast({
        title: "Impossible de resoudre",
        description: error?.message ?? "Reessayez plus tard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-[#FAF6EE] text-[#1B1A18] min-h-screen">
      <Navigation />

      <main className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.28em] text-[#9C8D77]">
          Supervision
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold mt-2">
          Risques et alertes
        </h1>
        <p className="text-sm text-[#6F6454] mt-3">
          Suivi des signaux faibles, alertes critiques et moderation.
        </p>

        {!isAuthenticated ? (
          <div className="mt-8 rounded-3xl border border-[#E8DCC8] bg-white p-6">
            <p className="text-sm text-[#6F6454]">
              Connecte-toi pour acceder a la supervision.
            </p>
          </div>
        ) : !isAdmin ? (
          <div className="mt-8 rounded-3xl border border-[#E8DCC8] bg-white p-6">
            <p className="text-sm text-[#6F6454]">
              Acces reserve aux superviseurs.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr,1fr]">
            <div className="rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Risk flags</h2>
              <div className="mt-4 space-y-3">
                {riskFlags.length ? (
                  riskFlags.map((flag) => (
                    <div
                      key={flag.id}
                      className="rounded-2xl border border-[#E8DCC8] bg-[#FDF9F0] px-4 py-3 text-sm"
                    >
                      <div className="font-semibold">
                        {flag.category} - {flag.risk_level}
                      </div>
                      <div className="text-[#6F6454]">Statut: {flag.status}</div>
                      {flag.details ? (
                        <div className="text-[#6F6454] mt-2">
                          {flag.details}
                        </div>
                      ) : null}
                      {flag.status !== "resolved" ? (
                        <button
                          type="button"
                          onClick={() => handleResolveRiskFlag(flag.id)}
                          className="mt-3 rounded-full border border-[#1B1A18]/20 bg-white px-4 py-2 text-xs font-semibold text-[#1B1A18]"
                        >
                          Marquer resolu
                        </button>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-[#E8DCC8] px-4 py-6 text-sm text-[#6F6454]">
                    Aucun flag recent.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Alertes</h2>
              <div className="mt-4 space-y-3">
                {alerts.length ? (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="rounded-2xl border border-[#E8DCC8] bg-[#FDF9F0] px-4 py-3 text-sm"
                    >
                      <div className="font-semibold">
                        Niveau {alert.risk_level ?? alert.severity ?? "-"}
                      </div>
                      <div className="text-[#6F6454]">
                        Statut: {alert.status ?? "pending"}
                      </div>
                      {alert.message ? (
                        <div className="text-[#6F6454] mt-2">
                          {alert.message}
                        </div>
                      ) : null}
                      {alert.status !== "resolved" ? (
                        <button
                          type="button"
                          onClick={() => handleResolveAlert(alert.id)}
                          className="mt-3 rounded-full border border-[#1B1A18]/20 bg-white px-4 py-2 text-xs font-semibold text-[#1B1A18]"
                        >
                          Marquer resolu
                        </button>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-[#E8DCC8] px-4 py-6 text-sm text-[#6F6454]">
                    Aucune alerte recente.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
