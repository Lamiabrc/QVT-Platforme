// src/pages/FamilleCreatePage.tsx
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { QVTBOX_ROUTES } from "@qvt/shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function FamilleCreatePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!fullName || !email || !password) {
      toast({
        title: "Champs incomplets",
        description: "Merci de renseigner nom, email et mot de passe.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            default_sphere: "family",
          },
        },
      });

      if (error) throw error;

      const userId = data.user?.id;
      if (!userId) {
        throw new Error(
          "Compte créé. Vérifiez votre email pour finaliser la création."
        );
      }

      const familyName = `Famille de ${fullName}`;

      const { data: family, error: familyError } = await supabase
        .from("families")
        .insert({ name: familyName, created_by: userId })
        .select("id")
        .single();

      if (familyError) throw familyError;

      const { error: membershipError } = await supabase
        .from("family_members")
        .insert({
          family_id: family.id,
          user_id: userId,
          role: "parent",
        });

      if (membershipError) throw membershipError;

      toast({
        title: "Espace famille créé",
        description: "Votre espace Famille est prêt.",
      });
      navigate("/famille/dashboard");
    } catch (error: any) {
      toast({
        title: "Impossible de créer le compte",
        description: error?.message ?? "Réessayez plus tard.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF6EE] text-[#1B1A18]">
      <Navigation />

      <main className="py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-xs uppercase tracking-[0.28em] text-[#9C8D77]">
            Sphere Famille
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold mt-4">
            Creer votre espace Famille &amp; Ado
          </h1>
          <p className="text-sm text-[#6F6454] mt-3">
            MVP : demarrez un essai sans paiement pour configurer votre espace
            et inviter un ado ou un tuteur.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-[1fr,0.9fr]">
            <form
              className="grid gap-4"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                placeholder="Nom et prenom"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full rounded-2xl border border-[#E8DCC8] bg-white px-4 py-3 text-sm"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-[#E8DCC8] bg-white px-4 py-3 text-sm"
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-[#E8DCC8] bg-white px-4 py-3 text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
              >
                {loading ? "Création en cours..." : "Demarrer mon essai"}
              </button>
            </form>

            <div className="rounded-3xl border border-[#E8DCC8] bg-white p-6 text-sm text-[#6F6454] shadow-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-[#9C8D77]">
                Parcours en 3 etapes
              </p>
              <ol className="mt-4 space-y-3">
                <li>1. Creez votre compte famille (parent/tuteur).</li>
                <li>2. Generez un code pour inviter un ado ou un proche.</li>
                <li>3. Activez les alertes et le planning partage.</li>
              </ol>
              <p className="mt-4 text-xs text-[#9C8D77]">
                ZENA ne remplace pas les urgences. En cas de danger immediat,
                contactez les secours.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-[#6F6454]">
            <Link to={QVTBOX_ROUTES.famille} className="underline">
              Retour a l'offre Famille
            </Link>
            <span>•</span>
            <Link to={QVTBOX_ROUTES.choisirSphere} className="underline">
              Choisir un autre univers
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
