import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function DevenirLuciolePage() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [experience, setExperience] = useState("");
  const [motivation, setMotivation] = useState("");
  const [availability, setAvailability] = useState("");
  const [charterAccepted, setCharterAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isAuthenticated || !user) return;

    if (!fullName.trim()) {
      toast({
        title: "Champ obligatoire",
        description: "Merci de renseigner votre nom complet.",
        variant: "destructive",
      });
      return;
    }

    if (!charterAccepted) {
      toast({
        title: "Charte obligatoire",
        description: "Vous devez accepter la charte Luciole pour continuer.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await (supabase as any).from("luciole_applications").insert({
      user_id: user.id,
      full_name: fullName.trim(),
      city: city.trim() || null,
      motivation: motivation.trim() || null,
      experience: experience.trim() || null,
      availability: availability.trim() || null,
      charter_accepted: true,
      status: "pending",
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Impossible d'envoyer",
        description: error.message ?? "Réessayez dans quelques instants.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Candidature envoyée",
      description: "Votre dossier Luciole est enregistré avec le statut pending.",
    });

    setFullName("");
    setCity("");
    setExperience("");
    setMotivation("");
    setAvailability("");
    setCharterAccepted(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1B1A18]">
      <Navigation />

      <main>
        <section className="relative overflow-hidden px-6 pb-20 pt-32 md:pt-40">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FAF6EE] to-[#F7F1E4]" />
          <div className="absolute -right-8 top-20 h-72 w-72 rounded-full bg-[#F3E0B9]/40 blur-3xl" />
          <div className="relative z-10 mx-auto max-w-4xl">
            <p className="text-xs uppercase tracking-[0.28em] text-[#9C8D77]">Devenir Luciole</p>
            <h1 className="mt-4 text-3xl font-semibold md:text-5xl">
              Devenir une Luciole rémunérée.
            </h1>
            <p className="mt-4 max-w-3xl text-base text-[#6F6454] md:text-lg">
              Formulaire de candidature et charte: opt-in, cadre clair, partage choisi.
            </p>

            <div className="mt-6 rounded-2xl border border-[#E8DCC8] bg-white p-5 text-sm text-[#6F6454]">
              <p>Opt-in: on choisit, on arrête quand on veut</p>
              <p className="mt-2">Encadrement: charte, limites, signalement, supervision</p>
              <p className="mt-2">Accès: la Luciole ne voit que ce que l’utilisateur partage</p>
            </div>

            {!isAuthenticated ? (
              <div className="mt-8 rounded-3xl border border-[#E8DCC8] bg-white p-6">
                <p className="text-sm text-[#6F6454]">
                  Connectez-vous pour déposer votre candidature Luciole.
                </p>
                <Link
                  to="/auth/login"
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-[#1B1A18] px-6 py-3 text-sm font-semibold text-[#FAF6EE] transition hover:opacity-90"
                >
                  Se connecter
                </Link>
              </div>
            ) : (
              <form
                className="mt-8 grid gap-4 rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm"
                onSubmit={handleSubmit}
              >
                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Nom complet"
                  className="w-full rounded-2xl border border-[#E8DCC8] px-4 py-3 text-sm"
                />
                <input
                  type="text"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  placeholder="Ville"
                  className="w-full rounded-2xl border border-[#E8DCC8] px-4 py-3 text-sm"
                />
                <textarea
                  value={experience}
                  onChange={(event) => setExperience(event.target.value)}
                  placeholder="Expérience"
                  className="min-h-[100px] w-full rounded-2xl border border-[#E8DCC8] px-4 py-3 text-sm"
                />
                <textarea
                  value={motivation}
                  onChange={(event) => setMotivation(event.target.value)}
                  placeholder="Motivation"
                  className="min-h-[100px] w-full rounded-2xl border border-[#E8DCC8] px-4 py-3 text-sm"
                />
                <textarea
                  value={availability}
                  onChange={(event) => setAvailability(event.target.value)}
                  placeholder="Disponibilités"
                  className="min-h-[100px] w-full rounded-2xl border border-[#E8DCC8] px-4 py-3 text-sm"
                />

                <label className="flex items-start gap-2 text-sm text-[#6F6454]">
                  <input
                    type="checkbox"
                    checked={charterAccepted}
                    onChange={(event) => setCharterAccepted(event.target.checked)}
                    className="mt-1"
                  />
                  J’accepte la charte Luciole (cadre, limites, supervision, signalement).
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] px-6 py-3 text-sm font-semibold text-[#FAF6EE] transition hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? "Envoi..." : "Envoyer ma candidature"}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
