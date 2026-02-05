import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useZenaFamily } from "@/hooks/useZenaFamily";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const ROUTES = {
  familySpace: "/famille",
  mentorDash: "/mentor",
};

export default function MentorApplyPage() {
  const { isAuthenticated } = useAuth();
  const { applyMentor } = useZenaFamily();
  const { toast } = useToast();

  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [city, setCity] = useState("");
  const [motivation, setMotivation] = useState("");
  const [experience, setExperience] = useState("");
  const [availability, setAvailability] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!fullName.trim()) {
      toast({
        title: "Champs manquant",
        description: "Merci de renseigner votre nom.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await applyMentor({
        full_name: fullName.trim(),
        age: age === "" ? null : Number(age),
        city: city.trim() || null,
        motivation: motivation.trim() || null,
        experience: experience.trim() || null,
        availability: availability.trim() || null,
      });

      toast({
        title: "Candidature envoyee",
        description: "Merci. Nous revenons vers vous rapidement.",
      });

      setFullName("");
      setAge("");
      setCity("");
      setMotivation("");
      setExperience("");
      setAvailability("");
    } catch (error: any) {
      toast({
        title: "Impossible d'envoyer",
        description: error?.message ?? "Reessayez plus tard.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF6EE] text-[#1B1A18] min-h-screen">
      <Navigation />

      <main className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.28em] text-[#9C8D77]">
          Lucioles
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold mt-2">
          Candidature mentor
        </h1>
        <p className="text-sm text-[#6F6454] mt-3">
          Les Lucioles accompagnent les ados avec bienveillance. Toute
          conversation reste in-app.
        </p>

        {!isAuthenticated ? (
          <div className="mt-8 rounded-3xl border border-[#E8DCC8] bg-white p-6">
            <p className="text-sm text-[#6F6454]">
              Connecte-toi pour deposer ta candidature.
            </p>
            <div className="mt-4">
              <Link
                to="/auth/login"
                className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-6 py-3 text-sm font-semibold"
              >
                Se connecter
              </Link>
            </div>
          </div>
        ) : (
          <form
            className="mt-8 grid gap-4 rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm"
            onSubmit={handleSubmit}
          >
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Nom et prenom"
              className="w-full rounded-2xl border border-[#E8DCC8] px-4 py-3 text-sm"
            />
            <input
              value={age}
              onChange={(event) => setAge(event.target.value === "" ? "" : Number(event.target.value))}
              placeholder="Age"
              type="number"
              min={18}
              className="w-full rounded-2xl border border-[#E8DCC8] px-4 py-3 text-sm"
            />
            <input
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Ville"
              className="w-full rounded-2xl border border-[#E8DCC8] px-4 py-3 text-sm"
            />
            <textarea
              value={motivation}
              onChange={(event) => setMotivation(event.target.value)}
              placeholder="Motivation"
              className="min-h-[120px] w-full rounded-2xl border border-[#E8DCC8] px-4 py-3 text-sm"
            />
            <textarea
              value={experience}
              onChange={(event) => setExperience(event.target.value)}
              placeholder="Experiences ou formation"
              className="min-h-[120px] w-full rounded-2xl border border-[#E8DCC8] px-4 py-3 text-sm"
            />
            <textarea
              value={availability}
              onChange={(event) => setAvailability(event.target.value)}
              placeholder="Disponibilites"
              className="min-h-[120px] w-full rounded-2xl border border-[#E8DCC8] px-4 py-3 text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-6 py-3 text-sm font-semibold disabled:opacity-60"
            >
              {loading ? "Envoi..." : "Envoyer ma candidature"}
            </button>
          </form>
        )}

        <div className="mt-6 flex flex-wrap gap-3 text-sm text-[#6F6454]">
          <Link to={ROUTES.familySpace} className="underline">
            Retour FamilySpace
          </Link>
          <span>-</span>
          <Link to={ROUTES.mentorDash} className="underline">
            Acces mentor
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
