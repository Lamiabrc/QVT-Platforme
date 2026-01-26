import { useState } from "react";
import SphereLayout from "@/components/SphereLayout";
import { supabase } from "@/lib/supabase";
import { getFamilyId } from "@/lib/tenants";

const FamilyPlanningPage = () => {
  const [title, setTitle] = useState("");
  const [items, setItems] = useState<Array<{ title: string; start: string }>>([]);
  const [status, setStatus] = useState<string | null>(null);

  const handleAdd = async () => {
    setStatus(null);

    if (!title) return;

    const familyId = await getFamilyId();
    if (!familyId) {
      setStatus("Activez une famille avant d'ajouter un planning.");
      return;
    }

    setItems((prev) => [...prev, { title, start: new Date().toISOString() }]);
    setTitle("");

    await supabase.from("plans").insert({
      tenant_type: "family",
      tenant_id: familyId,
      title,
      start_at: new Date().toISOString(),
    });

    setStatus("Evenement ajoute.");
  };

  return (
    <SphereLayout
      sphere="family"
      title="Planning Famille"
      description="Evenements et routines partages pour la famille."
    >
      <div className="rounded-2xl border border-border p-6 space-y-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ajouter un evenement"
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
        {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
        <div className="space-y-2">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun evenement pour le moment.</p>
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

export default FamilyPlanningPage;
