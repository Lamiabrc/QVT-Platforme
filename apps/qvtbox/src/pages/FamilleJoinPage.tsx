// src/pages/FamilleJoinPage.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AuthGuard from "@/components/AuthGuard";
import { supabase } from "@/integrations/supabase/client";
import { QVTBOX_ROUTES } from "@qvt/shared";
import { useToast } from "@/hooks/use-toast";

export default function FamilleJoinPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!code.trim()) {
      toast({ title: "Code requis", description: "Entrez un code d'invitation." });
      return;
    }

    setLoading(true);
    try {
      const normalizedCode = code.trim().toUpperCase();
      const { data: invite, error: inviteError } = await supabase
        .from("family_invitations")
        .select("*")
        .eq("code", normalizedCode)
        .is("used_at", null)
        .maybeSingle();

      if (inviteError || !invite) {
        throw new Error("Code invalide ou expiré.");
      }

      if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
        throw new Error("Ce code a expiré.");
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Vous devez être connecté pour rejoindre une famille.");
      }

      const { error: memberError } = await supabase
        .from("family_members")
        .insert({
          family_id: invite.family_id,
          user_id: user.id,
          role: invite.role,
        });

      if (memberError) {
        throw memberError;
      }

      await supabase
        .from("family_invitations")
        .update({ used_at: new Date().toISOString(), used_by: user.id })
        .eq("id", invite.id);

      toast({ title: "Bienvenue", description: "Vous avez rejoint la famille." });
      navigate("/famille/dashboard");
    } catch (error: any) {
      toast({
        title: "Impossible de rejoindre",
        description: error?.message ?? "Réessayez plus tard.",
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
          <div className="mx-auto max-w-3xl px-6">
            <p className="text-xs uppercase tracking-[0.28em] text-[#9C8D77]">
              Sphère Famille
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold mt-4">
              Rejoindre une famille
            </h1>
            <p className="text-sm text-[#6F6454] mt-3">
              Entrez le code d'invitation reçu pour rejoindre un espace Famille.
            </p>

            <form className="mt-8 grid gap-4" onSubmit={handleJoin}>
              <input
                type="text"
                placeholder="Code d'invitation"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                className="w-full rounded-2xl border border-[#E8DCC8] bg-white px-4 py-3 text-sm uppercase tracking-[0.2em]"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
              >
                {loading ? "Connexion en cours..." : "Rejoindre la famille"}
              </button>
            </form>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-[#6F6454]">
              <Link to={QVTBOX_ROUTES.familleCreate} className="underline">
                Créer un compte Famille
              </Link>
              <span>•</span>
              <Link to={QVTBOX_ROUTES.famille} className="underline">
                Retour à l'offre Famille
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}
