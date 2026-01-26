import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type Persona = "zena" | "zeno";
type Emotion = "positive" | "neutral" | "negative";

interface UseZenaZenoBrainOptions {
  persona?: Persona;
  language?: "auto" | "fr-FR" | "en-US";
}

/**
 * useZenaZenoBrain (interface pour le chat React classique).
 * Retourne :
 *  - emotion: l'état émotionnel détecté
 *  - isProcessing: booléen pour le loader
 *  - handleUserMessage: fonction qui renvoie la réponse texte de Zéna
 */
export function useZenaZenoBrain({ persona = "zena", language = "auto" }: UseZenaZenoBrainOptions = {}) {
  const { user } = useAuth();
  const [emotion, setEmotion] = useState<Emotion>("neutral");
  const [isProcessing, setIsProcessing] = useState(false);
  const sessionIdRef = useRef<string | null>(null);

  async function ensureSession() {
    if (sessionIdRef.current) return sessionIdRef.current;

    const { data, error } = await supabase
      .from("conversation_sessions")
      .insert({
        user_id: user?.id ?? null,
        persona,
        language: language === "auto" ? "fr-FR" : language,
      })
      .select("id")
      .single();

    if (error || !data) throw error || new Error("Impossible de créer la session");
    sessionIdRef.current = data.id;
    return data.id;
  }

  const handleUserMessage = async (text: string): Promise<string> => {
    const clean = text.trim();
    if (!clean) return "";

    setIsProcessing(true);
    try {
      const sessionId = await ensureSession();
      const { data, error } = await supabase.functions.invoke("generate-emotional-weather", {
        body: {
          text: clean,
          persona,
          language: language === "auto" ? "fr" : language.startsWith("fr") ? "fr" : "en",
          userId: user?.id,
          sessionId,
        },
      });

      if (error) {
        console.error("[useZenaZenoBrain] Edge function error:", error);
        throw error;
      }

      if (data?.mood) setEmotion(data.mood as Emotion);
      return data?.reply ?? "Merci de me l'avoir confié. On va poser ça ensemble.";
    } catch (err) {
      console.error("[useZenaZenoBrain] handleUserMessage error:", err);
      return persona === "zena"
        ? "Je suis désolée, je n'arrive pas à analyser ton message pour le moment."
        : "Je rencontre une difficulté technique, peux-tu réessayer ?";
    } finally {
      setIsProcessing(false);
    }
  };

  return { emotion, isProcessing, handleUserMessage };
}
