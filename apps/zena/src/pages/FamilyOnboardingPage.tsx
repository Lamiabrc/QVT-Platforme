import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { QVTBOX_URL } from "@qvt/shared";
import { supabase } from "@/lib/supabase";

const FamilyOnboardingPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  const handleActivate = async () => {
    setStatus(null);
    setInviteCode(null);

    if (!userId) {
      setStatus("Connectez-vous pour activer la famille.");
      return;
    }

    const { data: family, error } = await supabase
      .from("families")
      .insert({ owner_id: userId, plan_status: "active" })
      .select()
      .single();

    if (error || !family) {
      setStatus("Activation impossible. Verifiez la base.");
      return;
    }

    await supabase.from("family_members").insert({
      family_id: family.id,
      user_id: userId,
      role: "guardian",
    });

    setStatus("Famille activee. Vous pouvez inviter un proche.");
  };

  const handleInvite = async () => {
    setStatus(null);
    setInviteCode(null);

    if (!userId) {
      setStatus("Connectez-vous pour generer une invitation.");
      return;
    }

    const { data: family } = await supabase
      .from("families")
      .select("id")
      .eq("owner_id", userId)
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!family) {
      setStatus("Aucune famille active. Lancez l'activation.");
      return;
    }

    const code = Math.random().toString(36).slice(2, 8).toUpperCase();

    const { error } = await supabase.from("invites").insert({
      tenant_type: "family",
      tenant_id: family.id,
      role: "teen",
      code,
      created_by: userId,
    });

    if (error) {
      setStatus("Impossible de creer l'invitation.");
      return;
    }

    setInviteCode(code);
    setStatus("Invitation generee.");
  };

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold">Onboarding Famille</h1>
      <p className="text-sm text-muted-foreground">
        Activez un compte famille, puis invitez un enfant ou un tuteur avec un code.
      </p>

      <div className="rounded-2xl border border-border p-6 space-y-4">
        <h2 className="text-lg font-semibold">Activer l'essai famille</h2>
        <p className="text-sm text-muted-foreground">
          L'essai active les acces planning, alertes et communaute privee.
        </p>
        <button
          type="button"
          onClick={handleActivate}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Activer l'essai
        </button>
      </div>

      <div className="rounded-2xl border border-border p-6 space-y-4">
        <h2 className="text-lg font-semibold">Inviter un proche</h2>
        <p className="text-sm text-muted-foreground">
          Invitation privee, sans recherche publique.
        </p>
        <button
          type="button"
          onClick={handleInvite}
          className="rounded-lg border border-border px-4 py-2 text-sm"
        >
          Generer un code
        </button>
        {inviteCode ? (
          <div className="rounded-lg bg-muted px-4 py-3 text-sm">Code: {inviteCode}</div>
        ) : null}
      </div>

      <div className="rounded-2xl border border-dashed border-border p-5 text-sm text-muted-foreground">
        Besoin d'un compte famille complet ?
        <a className="ml-2 text-primary" href={QVTBOX_URL}>
          Creer sur QVT Box
        </a>
      </div>

      {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
      <Link to="/family/home" className="text-sm text-primary">
        Acceder au hub famille
      </Link>
    </section>
  );
};

export default FamilyOnboardingPage;
