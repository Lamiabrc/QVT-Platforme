import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface TrainingSample {
  input: string;
  response: string;
  emotion: "positive" | "neutral" | "negative";
  timestamp?: string;
}

export function useZenaTrainer() {
  const [trainingData, setTrainingData] = useState<TrainingSample[]>([]);

  const addSample = (input: string, response: string, emotion: TrainingSample["emotion"]) => {
    const sample = { input, response, emotion, timestamp: new Date().toISOString() };
    setTrainingData((prev) => [...prev, sample]);
  };

  const syncToCloud = async (tenant_id: string) => {
    if (!trainingData.length) return;
    console.log("📝 Échantillons ZÉNA locaux :", trainingData.length);
    // TODO: Créer la table zena_training_samples si nécessaire
    // try {
    //   const { error } = await supabase.from("zena_training_samples").insert(
    //     trainingData.map((d) => ({
    //       tenant_id,
    //       input_text: d.input,
    //       response_text: d.response,
    //       emotion: d.emotion,
    //       created_at: d.timestamp,
    //     }))
    //   );
    //   if (error) throw error;
    //   console.log("☁️ Échantillons ZÉNA sauvegardés :", trainingData.length);
    // } catch (err) {
    //   console.error("❌ Erreur syncToCloud :", err);
    // }
  };

  return { trainingData, addSample, syncToCloud };
}
