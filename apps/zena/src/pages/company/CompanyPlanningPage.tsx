import { useState } from "react";
import SphereLayout from "@/components/SphereLayout";
import { supabase } from "@/lib/supabase";
import { getCompanyId } from "@/lib/tenants";

const CompanyPlanningPage = () => {
  const [title, setTitle] = useState("");
  const [items, setItems] = useState<Array<{ title: string; start: string }>>([]);

  const handleAdd = async () => {
    if (!title) return;

    const companyId = await getCompanyId();
    if (!companyId) return;

    setItems((prev) => [...prev, { title, start: new Date().toISOString() }]);
    setTitle("");

    await supabase.from("plans").insert({
      tenant_type: "company",
      tenant_id: companyId,
      title,
      start_at: new Date().toISOString(),
    });
  };

  return (
    <SphereLayout
      sphere="company"
      title="Planning Entreprise"
      description="Actions QVT, evenements internes et suivi des engagements."
    >
      <div className="rounded-2xl border border-border p-6 space-y-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ajouter une action"
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Ajouter
          </button>
        </div>
        <div className="space-y-2">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune action pour le moment.</p>
          ) : (
            items.map((item, index) => (
              <div key={`${item.title}-${index}`} className="rounded-lg bg-muted px-3 py-2 text-sm">
                {item.title} - {new Date(item.start).toLocaleString()}
              </div>
            ))
          )}
        </div>
      </div>
    </SphereLayout>
  );
};

export default CompanyPlanningPage;
