// src/pages/FamilleInvitePage.tsx
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { QVTBOX_ROUTES } from "@qvt/shared";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const generateInviteCode = () => {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => (b % 36).toString(36))
    .join("")
    .toUpperCase();
};

export default function FamilleInvitePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [role, setRole] = useState("teen");
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const canGenerate = Boolean(user && familyId);

  useEffect(() => {
    const loadFamily = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("family_members")
        .select("family_id")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();
      setFamilyId(data?.family_id ?? null);
    };
    loadFamily();
  }, [user]);

  const handleGenerate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canGenerate) {
      toast({
        title: "Famille manquante",
        description: "Connectez-vous et créez un espace Famille.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const code = generateInviteCode();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const { error } = await supabase.from("family_invitations").insert({
        family_id: familyId,
        code,
        role,
        expires_at: expiresAt.toISOString(),
        created_by: user?.id ?? null,
      });

      if (error) throw error;

      setGeneratedCode(code);
      toast({
        title: "Code généré",
        description: "Partagez ce code avec le proche à inviter.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error?.message ?? "Impossible de générer le code.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedCode) return;
    await navigator.clipboard.writeText(generatedCode);
    toast({ title: "Code copié" });
  };

  return (
    <div className="bg-[#FAF6EE] text-[#1B1A18]">
      <Navigation />

      <main className="py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-xs uppercase tracking-[0.28em] text-[#9C8D77]">
            Sphère Famille
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold mt-4">
            Inviter un proche
          </h1>
          <p className="text-sm text-[#6F6454] mt-3">
            Générez un code d’invitation pour un enfant, un tuteur ou un ami de
            confiance.
          </p>

          <form className="mt-8 grid gap-4" onSubmit={handleGenerate}>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="w-full rounded-2xl border border-[#E8DCC8] bg-white px-4 py-3 text-sm"
            >
              <option value="teen">Ado</option>
              <option value="child">Enfant</option>
              <option value="tutor">Tuteur</option>
            </select>
            <button
              type="submit"
              disabled={loading || !canGenerate}
              className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
            >
              {loading ? "Génération..." : "Générer un code"}
            </button>
          </form>

          {generatedCode && (
            <div className="mt-6 rounded-3xl border border-[#E8DCC8] bg-white p-6">
              <div className="text-xs uppercase tracking-[0.24em] text-[#9C8D77]">
                Code d’invitation
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-lg font-semibold tracking-[0.35em]">
                  {generatedCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-xs underline text-[#1B1A18]"
                >
                  Copier
                </button>
              </div>
              <p className="mt-2 text-xs text-[#6F6454]">
                Valable 7 jours. Une fois utilisé, le code expire.
              </p>
            </div>
          )}

          <div className="mt-6 text-sm text-[#6F6454]">
            Besoin d’un compte ?{" "}
            <Link to={QVTBOX_ROUTES.familleCreate} className="underline">
              Créer un compte Famille
            </Link>
            <span className="mx-2">•</span>
            <Link to="/famille/rejoindre" className="underline">
              J’ai un code d’invitation
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
