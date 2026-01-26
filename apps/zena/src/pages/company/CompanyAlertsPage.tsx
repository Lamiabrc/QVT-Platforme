import { useState } from "react";
import SphereLayout from "@/components/SphereLayout";
import { supabase } from "@/lib/supabase";
import { getCompanyId } from "@/lib/tenants";

const CompanyAlertsPage = () => {
  const [category, setCategory] = useState("detresse");
  const [severity, setSeverity] = useState("medium");
  const [message, setMessage] = useState("");
  const [log, setLog] = useState<string[]>([]);

  const handleSend = async () => {
    if (!message) return;

    const companyId = await getCompanyId();
    if (!companyId) {
      setLog((prev) => ["Activez une entreprise avant d'envoyer une alerte.", ...prev]);
      return;
    }

    await supabase.from("alerts").insert({
      tenant_type: "company",
      tenant_id: companyId,
      category,
      severity,
      message,
      status: "open",
    });

    setLog((prev) => [
      "Alerte transmise a l'administration (RH/QVT).",
      ...prev,
    ]);
    setMessage("");
  };

  return (
    <SphereLayout
      sphere="company"
      title="Alertes Entreprise"
      description="Signalements internes visibles par les admins et le declarant."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border p-6 space-y-4">
          <h3 className="text-lg font-semibold">Nouvelle alerte</h3>
          <label className="text-sm">Categorie</label>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="detresse">Detresse</option>
            <option value="harcelement">Harcelement</option>
            <option value="addiction">Addiction</option>
            <option value="autre">Autre</option>
          </select>
          <label className="text-sm">Severite</label>
          <select
            value={severity}
            onChange={(event) => setSeverity(event.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="low">Faible</option>
            <option value="medium">Moyenne</option>
            <option value="high">Elevee</option>
          </select>
          <label className="text-sm">Message</label>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="min-h-[120px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            placeholder="Decrire la situation en quelques lignes."
          />
          <button
            type="button"
            onClick={handleSend}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Envoyer l'alerte
          </button>
        </div>
        <div className="rounded-2xl border border-border p-6 space-y-3">
          <h3 className="text-lg font-semibold">Historique / notifications</h3>
          {log.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucune alerte envoyee pour le moment.
            </p>
          ) : (
            log.map((entry, index) => (
              <div key={`${entry}-${index}`} className="rounded-lg bg-muted px-3 py-2 text-sm">
                {entry}
              </div>
            ))
          )}
          <p className="text-xs text-muted-foreground">
            Les alertes sont visibles par les admins et la personne a l'origine de l'alerte.
          </p>
        </div>
      </div>
    </SphereLayout>
  );
};

export default CompanyAlertsPage;
