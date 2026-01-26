import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const CompanyOnboardingPage = () => {
  const [companyName, setCompanyName] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  const handleLead = async () => {
    setStatus(null);
    setInviteCode(null);

    if (!userId) {
      setStatus("Connectez-vous pour demander une demo.");
      return;
    }

    const { error } = await supabase.from("companies").insert({
      owner_id: userId,
      name: companyName || "Entreprise",
      status: "lead",
    });

    if (error) {
      setStatus("Demande impossible. Verifiez la base.");
      return;
    }

    setStatus("Demande envoyee. Nous vous contactons rapidement.");
  };

  const handleActivate = async () => {
    setStatus(null);
    setInviteCode(null);

    if (!userId) {
      setStatus("Connectez-vous pour activer l'entreprise.");
      return;
    }

    const { data: company, error } = await supabase
      .from("companies")
      .update({ status: "active" })
      .eq("owner_id", userId)
      .select()
      .single();

    if (error || !company) {
      setStatus("Activation impossible. Demandez une demo d'abord.");
      return;
    }

    await supabase.from("company_members").insert({
      company_id: company.id,
      user_id: userId,
      role: "admin",
    });

    const code = Math.random().toString(36).slice(2, 8).toUpperCase();

    await supabase.from("invites").insert({
      tenant_type: "company",
      tenant_id: company.id,
      role: "employee",
      code,
      created_by: userId,
    });

    setInviteCode(code);
    setStatus("Entreprise activee. Code d'invitation genere.");
  };

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold">Onboarding Entreprise</h1>
      <p className="text-sm text-muted-foreground">
        Demandez une demo ou activez votre entreprise pour demarrer le reseau interne.
      </p>

      <div className="rounded-2xl border border-border p-6 space-y-4">
        <h2 className="text-lg font-semibold">Demander demo / devis</h2>
        <input
          value={companyName}
          onChange={(event) => setCompanyName(event.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          placeholder="Nom de l'entreprise"
        />
        <button
          type="button"
          onClick={handleLead}
          className="rounded-lg border border-border px-4 py-2 text-sm"
        >
          Envoyer la demande
        </button>
      </div>

      <div className="rounded-2xl border border-border p-6 space-y-4">
        <h2 className="text-lg font-semibold">Activer l'entreprise (admin)</h2>
        <button
          type="button"
          onClick={handleActivate}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Activer maintenant
        </button>
        {inviteCode ? (
          <div className="rounded-lg bg-muted px-4 py-3 text-sm">Code: {inviteCode}</div>
        ) : null}
      </div>

      {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
      <Link to="/company/home" className="text-sm text-primary">
        Acceder au hub entreprise
      </Link>
    </section>
  );
};

export default CompanyOnboardingPage;
