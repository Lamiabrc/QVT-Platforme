import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { GlowCard } from "@/components/zena/GlowCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { AlertTriangle, ArrowLeft, Bell } from "lucide-react";
import type { AlertType } from "@qvt/shared";

type AlertRecord = {
  id: string;
  alert_type: string;
  message: string;
  status: string;
  notified_to: string[] | null;
  created_at: string | null;
};

const alertTypeLabels: Record<AlertType, string> = {
  detresse: "Detresse",
  harcelement: "Harcelement",
};

const statusLabels: Record<string, string> = {
  new: "Nouveau",
  notified: "Notifie",
  acknowledged: "Pris en compte",
  closed: "Cloture",
};

export default function Alerts() {
  const navigate = useNavigate();
  const { user, currentMember, familyMembers, loading, isDemoMode } = useAuth();
  const { toast } = useToast();
  const [alertType, setAlertType] = useState<AlertType>("detresse");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState(true);

  const notifyTargets = useMemo(() => {
    if (!familyMembers?.length) return ["famille"];
    const targets = familyMembers
      .filter((member) => ["parent", "tuteur", "parrain", "admin"].includes(member.role))
      .map((member) => member.display_name || member.role);
    return targets.length ? targets : ["famille"];
  }, [familyMembers]);

  useEffect(() => {
    if (!loading && !user && !isDemoMode) {
      navigate("/auth");
    }
  }, [loading, user, isDemoMode, navigate]);

  useEffect(() => {
    const familyId = currentMember?.family_id;
    if (!familyId || isDemoMode) {
      setAlerts([]);
      setLoadingAlerts(false);
      return;
    }

    const fetchAlerts = async () => {
      setLoadingAlerts(true);
      const { data, error } = await supabase
        .from("alerts")
        .select("id, alert_type, message, status, notified_to, created_at")
        .eq("family_id", familyId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les alertes recentes.",
          variant: "destructive",
        });
      }

      setAlerts((data as AlertRecord[]) || []);
      setLoadingAlerts(false);
    };

    fetchAlerts();
  }, [currentMember?.family_id, isDemoMode, toast]);

  const handleSubmit = async () => {
    if (!currentMember) {
      toast({
        title: "Session invalide",
        description: "Connecte-toi pour declencher une alerte.",
        variant: "destructive",
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Message requis",
        description: "Ajoute un message court pour expliquer la situation.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("alerts")
        .insert({
          family_id: currentMember.family_id,
          created_by: currentMember.id,
          alert_type: alertType,
          message: message.trim(),
          status: "new",
          notified_to: notifyTargets,
        })
        .select("id, alert_type, message, status, notified_to, created_at")
        .single();

      if (error || !data) {
        throw error || new Error("Alerte non enregistree.");
      }

      const webhookUrl = import.meta.env.VITE_ALERT_WEBHOOK_URL as string | undefined;
      let notificationStatus = "failed";
      let channel = "in_app";
      let target = "famille";

      if (webhookUrl) {
        channel = "webhook";
        target = webhookUrl;

        try {
          const response = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              alertId: data.id,
              familyId: currentMember.family_id,
              alertType,
              message: message.trim(),
              notifiedTo: notifyTargets,
            }),
          });
          notificationStatus = response.ok ? "sent" : "failed";
        } catch {
          notificationStatus = "failed";
        }
      }

      await supabase.from("alert_notifications").insert({
        alert_id: data.id,
        channel,
        target,
        status: notificationStatus,
      });

      if (notificationStatus === "sent") {
        await supabase.from("alerts").update({ status: "notified" }).eq("id", data.id);
      }

      setAlerts((prev) => [data as AlertRecord, ...prev]);
      setMessage("");

      toast({
        title: "Alerte envoyee",
        description: "La famille et les tuteurs ont ete informes.",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de declencher l'alerte. Reessaie plus tard.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zena-night to-zena-night/80 pb-20 md:pb-8">
      <header className="bg-zena-night/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/family")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <AlertTriangle className="h-6 w-6 text-zena-rose" />
            <div>
              <h1 className="text-lg font-semibold text-foreground">Alerte famille</h1>
              <p className="text-sm text-muted-foreground">
                Detresse ou harcelement: prevenir un adulte de confiance.
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        <GlowCard>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-foreground">
              <Bell className="h-5 w-5 text-zena-turquoise" />
              <h2 className="text-lg font-semibold">Declencher une alerte</h2>
            </div>

            <Select value={alertType} onValueChange={(value) => setAlertType(value as AlertType)}>
              <SelectTrigger className="bg-background/40">
                <SelectValue placeholder="Type d'alerte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="detresse">{alertTypeLabels.detresse}</SelectItem>
                <SelectItem value="harcelement">{alertTypeLabels.harcelement}</SelectItem>
              </SelectContent>
            </Select>

            <Textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Explique en quelques mots ce qui se passe."
              className="min-h-[120px] bg-background/40"
            />

            <div className="text-xs text-muted-foreground">
              Notification prevue pour: {notifyTargets.join(", ")}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-gradient-to-r from-zena-rose to-zena-violet hover:opacity-90"
            >
              {submitting ? "Envoi en cours..." : "Envoyer l'alerte"}
            </Button>
          </div>
        </GlowCard>

        <GlowCard className="bg-zena-night/60">
          <div className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Historique recent</h2>
            {loadingAlerts ? (
              <p className="text-sm text-muted-foreground">Chargement des alertes...</p>
            ) : alerts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune alerte enregistree.</p>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="rounded-lg border border-white/10 bg-background/30 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {alertTypeLabels[alert.alert_type as AlertType] || alert.alert_type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {statusLabels[alert.status] || alert.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{alert.message}</p>
                    {alert.notified_to?.length ? (
                      <p className="text-xs text-muted-foreground mt-2">
                        Notifie a: {alert.notified_to.join(", ")}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </GlowCard>
      </div>
    </div>
  );
}
