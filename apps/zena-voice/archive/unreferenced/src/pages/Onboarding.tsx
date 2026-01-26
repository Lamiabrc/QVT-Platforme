import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

/**
 *  Onboarding ZÉNA
 * Guidé par les facteurs scientifiques du bien-être :
 * - santé perçue
 * - relations sociales
 * - sommeil
 * - stress
 * - environnement
 * - sens / objectifs
 */
export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [answers, setAnswers] = useState({
    situation: "",
    energie: "",
    sommeil: "",
    stress: "",
    soutien: "",
    environnement: "",
    objectif: "",
  });

  const questions = [
    {
      key: "situation",
      title: "Peux-tu me dire un peu qui tu es ?",
      options: ["Célibataire", "En couple", "Parent", "Autre"],
    },
    {
      key: "energie",
      title: " Ton niveau d’énergie en ce moment ?",
      options: ["Élevé", "Moyen", "Fatigué"],
    },
    {
      key: "sommeil",
      title: " Comment dors-tu ces derniers temps ?",
      options: ["Très bien", "Moyennement", "Mal"],
    },
    {
      key: "stress",
      title: " Ton niveau de stress au quotidien ?",
      options: ["Faible", "Moyen", "Élevé"],
    },
    {
      key: "soutien",
      title: " Te sens-tu soutenu(e) par ton entourage ?",
      options: ["Oui, beaucoup", "Un peu", "Pas vraiment"],
    },
    {
      key: "environnement",
      title: " Ton cadre de vie t’aide-t-il à te ressourcer ?",
      options: ["Oui", "Partiellement", "Non"],
    },
    {
      key: "objectif",
      title: " Que souhaites-tu le plus avec ZÉNA ?",
      options: [
        "Retrouver de la sérénité",
        "Gérer mon stress",
        "Mieux dormir",
        "Me motiver",
      ],
    },
  ];

  const handleSelect = async (value: string) => {
    const currentKey = questions[step].key as keyof typeof answers;
    setAnswers({ ...answers, [currentKey]: value });

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // ✅ Dernière question : sauvegarde du profil
      await saveProfile({ ...answers, [currentKey]: value });
    }
  };

  const saveProfile = async (profile: any) => {
    setLoading(true);
    try {
      // Sauvegarde locale
      localStorage.setItem("zena_profile", JSON.stringify(profile));

      // Redirection
      navigate("/zena-chat");
    } catch (err) {
      console.error("❌ Erreur onboarding :", err);
    } finally {
      setLoading(false);
    }
  };

  const current = questions[step];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-b from-[#F2F7F6] to-[#EAF4F3] px-6">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md bg-white/70 rounded-3xl p-8 shadow-lg backdrop-blur-sm"
      >
        <h1 className="text-2xl font-semibold text-[#5B4B8A] mb-6">
          {current.title}
        </h1>

        <div className="grid grid-cols-1 gap-3">
          {current.options.map((opt) => (
            <motion.button
              key={opt}
              onClick={() => handleSelect(opt)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="py-3 rounded-full bg-[#4FD1C5] text-white font-medium shadow hover:bg-[#3fb3a9] transition"
            >
              {opt}
            </motion.button>
          ))}
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Étape {step + 1} / {questions.length}
        </p>
      </motion.div>

      {loading && (
        <p className="mt-4 text-[#5B4B8A] text-sm"> Création de ton profil...</p>
      )}
    </div>
  );
}
