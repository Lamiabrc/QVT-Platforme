// src/pages/SimulateurPage.tsx
import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingBubbles from "@/components/FloatingBubbles";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import {
  Heart,
  Settings,
  Users,
  Star,
  Moon,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

// -------------------------------------------------------------
// 🎨 PALETTE SAND BAR PREMIUM
// -------------------------------------------------------------
const COLORS = {
  bg: "bg-[#F3EFE7]",                    // sable clair
  haloSoft: "from-[#C9E8F0]/40",         // halo turquoise léger
  haloWarm: "via-[#E9DFFA]/40",          // halo violet léger
  haloEnd: "to-[#E9E4D7]/30",            // sable doré
  bubble: "bg-white/70 backdrop-blur-xl shadow-lg",
  primary: "text-[#00A5A8]",             // turquoise QVT Box
  primaryBg: "bg-[#00A5A8]",
  textDark: "text-[#2E2E2E]",
};

// -------------------------------------------------------------
// 🧍 Profils
// -------------------------------------------------------------
type ProfileId = "salarie" | "parent" | "ado" | "senior" | "autre";

const profiles: Array<{
  id: ProfileId;
  label: string;
  desc: string;
  emoji: string;
}> = [
  { id: "salarie", label: "Salarié(e)", emoji: "💼", desc: "Travail, rythme, charge mentale, équipe…" },
  { id: "parent", label: "Parent", emoji: "👨‍👩‍👧", desc: "Organisation familiale, fatigue parentale…" },
  { id: "ado", label: "Adolescent(e)", emoji: "🎒", desc: "Émotions, école, relations, sommeil…" },
  { id: "senior", label: "Grand-parent", emoji: "👵", desc: "Rythme de vie, liens, énergie douce…" },
  { id: "autre", label: "Autre", emoji: "🌈", desc: "Situation particulière, besoin d’écoute…" },
];

// -------------------------------------------------------------
// ❓ Questions simplifiées, premium et adaptées
// -------------------------------------------------------------
const questionsByProfile: Record<ProfileId, any[]> = {
  salarie: [
    {
      id: "stress",
      icon: Heart,
      title: "Pression & émotions",
      question: "Comment vivez-vous votre niveau de pression au travail ?",
      options: ["Très difficile", "Plutôt compliqué", "Globalement ça va", "Serein(e)"],
    },
    {
      id: "orga",
      icon: Settings,
      title: "Charge & organisation",
      question: "Comment gérez-vous votre charge et vos priorités ?",
      options: ["Débordé(e)", "Souvent chargé(e)", "Correct", "Bien structuré(e)"],
    },
    {
      id: "team",
      icon: Users,
      title: "Relations d'équipe",
      question: "Comment se passent vos relations dans l’équipe ?",
      options: ["Tendues", "Inégales", "Correctes", "Très bonnes"],
    },
  ],
  parent: [
    {
      id: "stress",
      icon: Heart,
      title: "Fatigue parentale",
      question: "Comment vous sentez-vous dans votre rôle de parent ?",
      options: ["Épuisé(e)", "Fatigué(e)", "Ça va", "Plutôt serein(e)"],
    },
    {
      id: "orga",
      icon: Settings,
      title: "Organisation du quotidien",
      question: "Votre organisation familiale est-elle fluide ?",
      options: ["Chaotique", "Compliquée", "Gérable", "Organisée"],
    },
    {
      id: "relations",
      icon: Users,
      title: "Lien avec les enfants",
      question: "Comment se passe votre relation du moment ?",
      options: ["Tendue", "Fluctuante", "Correcte", "Complice"],
    },
  ],
  ado: [
    {
      id: "stress",
      icon: Heart,
      title: "Émotions du moment",
      question: "Comment tu te sens ces derniers jours ?",
      options: ["Pas bien", "Stressé(e)", "Ça va", "Plutôt bien"],
    },
    {
      id: "orga",
      icon: Settings,
      title: "Cours & devoirs",
      question: "Tu arrives à t’organiser ?",
      options: ["Pas du tout", "Difficilement", "Correct", "Oui"],
    },
    {
      id: "relations",
      icon: Users,
      title: "Relations",
      question: "Et avec les autres, ça va ?",
      options: ["Compliqué", "Variable", "Ça va", "Bien entouré(e)"],
    },
  ],
  senior: [
    {
      id: "stress",
      icon: Heart,
      title: "Sérénité émotionnelle",
      question: "Vous sentez-vous serein(e) au quotidien ?",
      options: ["Souvent inquiet(ète)", "Fragile", "Assez serein(e)", "Apaisé(e)"],
    },
    {
      id: "relations",
      icon: Users,
      title: "Lien social",
      question: "Comment vivez-vous vos relations actuelles ?",
      options: ["Isolé(e)", "Peu de lien", "Liens réguliers", "Bien entouré(e)"],
    },
    {
      id: "energie",
      icon: Star,
      title: "Énergie douce",
      question: "Comment va votre énergie ?",
      options: ["Très basse", "Faible", "Correcte", "Bonne"],
    },
  ],
  autre: [
    {
      id: "stress",
      icon: Heart,
      title: "État intérieur",
      question: "Comment vous sentez-vous globalement ?",
      options: ["Très mal", "Fatigué(e)", "Mitigé(e)", "Plutôt bien"],
    },
    {
      id: "orga",
      icon: Settings,
      title: "Charge mentale",
      question: "Arrivez-vous à gérer vos responsabilités ?",
      options: ["Submergé(e)", "Souvent trop", "Gérable", "Correct"],
    },
    {
      id: "relations",
      icon: Users,
      title: "Lien aux autres",
      question: "Votre relation aux autres est-elle facile ces temps-ci ?",
      options: ["Difficile", "Variable", "Correcte", "Bonne"],
    },
  ],
};

// -------------------------------------------------------------
// 🎁 Recommandation de Box
// -------------------------------------------------------------
const boxByWeakDimension = {
  stress: "Box Bulle Anti-Pression",
  orga: "Box Clarté & Organisation",
  relations: "Box Lien & Communication",
  energie: "Box Vitalité Douce",
};

// -------------------------------------------------------------
// 🔥 Composant principal
// -------------------------------------------------------------
export default function SimulateurPage() {
  const [profile, setProfile] = useState<ProfileId | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const questions = useMemo(() => (profile ? questionsByProfile[profile] : []), [profile]);
  const progress = questions.length ? ((step + 1) / questions.length) * 100 : 0;
  const current = questions[step];

  // SCORE → DIM + RECO
  const computeWeakDimension = () => {
    const scores = Object.entries(answers).map(([_, v]) => v);
    const weakestValue = Math.min(...scores);
    const weakestKey = Object.entries(answers).find(([, v]) => v === weakestValue)?.[0];
    return weakestKey;
  };

  // FIN
  if (profile && showResult) {
    const weak = computeWeakDimension() || "stress";
    const box = boxByWeakDimension[weak as keyof typeof boxByWeakDimension];

    return (
      <div className={`${COLORS.bg} min-h-screen`}>
        <FloatingBubbles />
        <Navigation />

        <div className="pt-28 pb-20 px-6 container mx-auto max-w-2xl relative">
          {/* HALO */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#C9E8F0]/40 via-[#E9DFFA]/40 to-transparent blur-3xl -z-10"></div>

          <h1 className="text-3xl font-bold text-center mb-6">
            Votre <span className={COLORS.primary}>bulle du moment</span>
          </h1>

          {/* Box card */}
          <div className={`${COLORS.bubble} rounded-3xl p-8 mb-10`}>
            <h2 className="text-xl font-semibold mb-3">{box}</h2>
            <p className="text-sm text-[#444] mb-4">
              Une sélection pensée pour vous aider à reprendre souffle, étape après étape.
            </p>

            <div className="text-center mt-6 mb-4">
              <Button asChild>
                <Link to="/box">Explorer cette Box</Link>
              </Button>
            </div>
          </div>

          {/* Zéna CTA */}
          <div className={`${COLORS.bubble} rounded-3xl p-6 mb-8 flex gap-4`}>
            <div className="w-10 h-10 rounded-full bg-[#00A5A8]/10 flex items-center justify-center">
              <Sparkles className="text-[#00A5A8]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Et si vous en parliez à Zéna ?</h3>
              <p className="text-xs text-[#555]">
                Votre IA émotionnelle bienveillante, qui vous écoute sans jugement.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/zena">Lui parler</Link>
            </Button>
          </div>

          <div className="flex gap-3">
            <Button asChild className="flex-1">
              <Link to="/">Retour à l’accueil</Link>
            </Button>

            <Button variant="outline" className="flex-1" onClick={() => navigate("/auth")}>
              Créer mon espace QVT Box
            </Button>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // CHOIX PROFIL
  if (!profile) {
    return (
      <div className={`${COLORS.bg} min-h-screen`}>
        <FloatingBubbles />
        <Navigation />

        <div className="container mx-auto pt-28 px-6 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
            À qui appartient cette <span className={COLORS.primary}>bulle émotionnelle</span> ?
          </h1>
          <p className="text-center text-sm text-[#555] mb-10">
            Cela permet d’adapter les questions et la recommandation.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {profiles.map((p) => (
              <button
                key={p.id}
                onClick={() => setProfile(p.id)}
                className={`${COLORS.bubble} p-4 rounded-2xl flex gap-3 hover:shadow-xl transition`}
              >
                <div className="text-2xl">{p.emoji}</div>
                <div>
                  <p className="font-semibold">{p.label}</p>
                  <p className="text-xs text-[#777]">{p.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // QUESTIONS
  return (
    <div className={`${COLORS.bg} min-h-screen`}>
      <FloatingBubbles />
      <Navigation />

      <div className="container mx-auto pt-28 px-6 max-w-2xl">
        <Button variant="outline" className="mb-6" onClick={() => setProfile(null)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Changer de profil
        </Button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">
            Comment ça va <span className={COLORS.primary}>vraiment</span> ?
          </h2>
          <p className="text-xs text-[#666] mt-1">
            Question {step + 1} / {questions.length}
          </p>
        </div>

        <Progress value={progress} className="h-2 mb-6" />

        {/* Question card */}
        <div className={`${COLORS.bubble} rounded-2xl p-6 space-y-6`}>
          <div className="text-center">
            <current.icon className="mx-auto w-8 h-8 text-[#00A5A8]" />
            <h3 className="font-semibold mt-3">{current.title}</h3>
            <p className="text-sm text-[#555]">{current.question}</p>
          </div>

          <RadioGroup
            value={answers[current.id]?.toString() || ""}
            onValueChange={(v) => setAnswers((a) => ({ ...a, [current.id]: Number(v) }))}
            className="space-y-3"
          >
            {current.options.map((opt: string, idx: number) => (
              <Label
                key={idx}
                htmlFor={`${current.id}_${idx}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-[#DDD] bg-white/70 cursor-pointer hover:bg-[#F9F7F2]"
              >
                <RadioGroupItem
                  id={`${current.id}_${idx}`}
                  value={(idx + 1).toString()}
                />
                <span>{opt}</span>
              </Label>
            ))}
          </RadioGroup>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              disabled={step === 0}
              onClick={() => setStep((s) => s - 1)}
            >
              Précédent
            </Button>
            <Button
              disabled={!answers[current.id]}
              onClick={() =>
                step === questions.length - 1 ? setShowResult(true) : setStep((s) => s + 1)
              }
            >
              {step === questions.length - 1 ? "Voir ma bulle" : "Suivant"}
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
