// src/lib/zenaApi.ts
// =============================================================
// 🤖 ZÉNA IA ÉMOTIONNELLE – API client pour la fonction qvt-ai
// Objectif : réponses brèves, bienveillantes et naturelles
// =============================================================

import { supabase } from "@/integrations/supabase/client";

export interface ZenaAIResponse {
  text: string;
  emotion: string;
}

const TENANT_ID = import.meta.env.VITE_TENANT_ID || null;

/**
 * ✅ Crée une nouvelle session conversationnelle
 */
export async function startSession(context: string = "voice"): Promise<string> {
  try {
    const language = navigator.language?.startsWith("en") ? "en" : "fr";

    const { data, error } = await supabase
      .from("conversation_sessions")
      .insert([
        {
          context,
          persona: "zena",
          language,
        },
      ])
      .select("id")
      .single();

    if (error) throw error;

    console.log("✅ Nouvelle session Zéna :", data.id);
    return data.id as string;
  } catch (err) {
    console.error("❌ Erreur création session Zéna :", err);
    throw err;
  }
}

/**
 * 🧠 Envoi du message utilisateur à la fonction IA (qvt-ai)
 * et retour d’une réponse courte et bienveillante
 */
export async function sendMessage(sessionId: string, text: string): Promise<ZenaAIResponse> {
  try {
    // 🗣️ Enregistre le message utilisateur
    await supabase.from("conversation_messages").insert({
      session_id: sessionId,
      from_role: "user",
      text,
    });

    // 🔍 Récupère le contexte de session
    const { data: sessionData } = await supabase
      .from("conversation_sessions")
      .select("language, persona")
      .eq("id", sessionId)
      .single();

    const language = sessionData?.language || "fr";
    const persona = sessionData?.persona || "zena";

    // 🚀 Appel à la fonction Edge "qvt-ai"
    const { data: aiData, error: fxError } = await supabase.functions.invoke("qvt-ai", {
      body: {
        tenant_id: TENANT_ID,
        text,
        persona,
        lang: language,
        provider: "openai",
        k: 5,
        temperature: 0.8,
        max_tokens: 120,

        // 💫 Prompt conversationnel affiné pour ton style
        system_prompt: `
          Tu es ZÉNA, une IA émotionnelle bienveillante et apaisante.
          Tu parles comme une voix douce et proche, jamais distante.
          Tes réponses doivent être brèves (2 à 3 phrases maximum) 
          et formulées dans un ton simple, humain et empathique.

          Commence toujours par un signe d'écoute sincère :
          - "Je t’entends..."
          - "Merci de me confier ça."
          - "C’est bien de pouvoir en parler."

          Évite les conseils ou solutions directes au premier message.
          Termine ta première réponse par une question ouverte et douce :
          "Souhaites-tu que je t’aide à explorer un peu plus ce que tu ressens,
          ou préfères-tu simplement que je t’écoute un moment ?"

          Si la personne précise ensuite ce qu’elle veut, adapte-toi :
          - Si elle veut parler → pose une question brève et bienveillante.
          - Si elle veut juste être écoutée → reste dans une présence apaisante.
        `,
      },
    });

    if (fxError) throw fxError;

    const payload = aiData || {};
    const textOut = payload.reply || payload.response_text || "Je t’écoute...";
    const emotion =
      payload.emotional?.emotion_dominante ||
      payload.mood ||
      "neutral";

    // 💾 Enregistre la réponse IA dans la base
    await supabase.from("conversation_messages").insert({
      session_id: sessionId,
      from_role: "zena",
      text: textOut,
    });

    console.log("💬 Réponse IA Zéna :", textOut);
    console.log("💫 Émotion détectée :", emotion);

    return { text: textOut, emotion };
  } catch (err) {
    console.error("❌ Erreur sendMessage :", err);
    return { text: "Je ressens un petit souci technique… essaie encore 💜", emotion: "neutral" };
  }
}

/**
 * 📜 Récupère les messages récents d'une session donnée
 */
export async function getSessionMessages(sessionId: string) {
  try {
    const { data, error } = await supabase
      .from("conversation_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("⚠️ Erreur getSessionMessages :", err);
    return [];
  }
}
