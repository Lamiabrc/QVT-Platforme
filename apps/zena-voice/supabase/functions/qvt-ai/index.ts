// ===========================================================
// 🌿 ZÉNA - IA ÉMOTIONNELLE QVT BOX (v2.1 sans emoji)
// Triple fallback + mémoire émotionnelle (Supabase)
// ===========================================================

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Nettoie la réponse pour qu'elle sonne naturelle, brève et sans questions
function sanitizeReply(s: string) {
  if (!s) return "Je suis là, prends ton temps.";
  // 1) Supprimer présentations et excuses
  s = s.replace(/^\s*(bonjour|salut)[,!.\-\s]*/i, "");
  s = s.replace(/je\s+suis\s+z[ée]na[^.!\n]*[.!\n]?\s*/i, "");
  s = s.replace(/je\s+suis\s+d[ée]sol[ée](?:\s*(?:de|d')[^.!\n]*)?[.!\n]?/i, "");
  // 2) Supprimer questions et tournures interrogatives
  s = s.replace(/[?？！]+/g, "."); // remplace ? par .
  s = s.replace(/\b(avez[-\s]?vous|voulez[-\s]?vous|peux[-\s]?tu|pouvez[-\s]?vous|veux[-\s]?tu|souhaites[-\s]?tu)\b[^.!\n]*[.!\n]?/gi, "");
  // 3) Pas d’injonctions trop directive type “Parle à ton employeur”
  s = s.replace(/\b(parle(?:r)?\s+à\s+ton?\s+employeur|discute(?:r)?\s+avec\s+ton?\s+manager)\b[^.!\n]*[.!\n]?/gi, "");
  // 4) Nettoyage espaces
  s = s.replace(/\s+/g, " ").trim();
  // 5) Maximum 2 phrases
  const sentences = s.split(/(?<=[.!])\s+/).filter(Boolean).slice(0, 2);
  s = sentences.join(" ");
  // 6) Limite de longueur douce
  if (s.length > 160) s = s.slice(0, 160).replace(/[^a-zA-ZÀ-ÿ]+$/, "") + "…";
  // 7) Fallback
  return s || "Je t’écoute, pose-toi un instant.";
}

// ===========================================================
// ⚙️ CONFIGURATION
// ===========================================================
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://zena.qvtbox.com",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supa = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const MISTRAL_API_KEY = Deno.env.get("MISTRAL_API_KEY");
const OPENAI_MODEL = "gpt-4o-mini";
const MISTRAL_MODEL = "mistral-tiny";

// ===========================================================
// ❤️ ANALYSE ÉMOTIONNELLE LOCALE
// ===========================================================
function localEmotionAnalysis(text: string) {
  const t = text.toLowerCase();
  const patterns = {
    fatigue: /(fatigu|épuis|lassé|sommeil|épuisé|épuisant|épuisement)/,
    stress: /(stress|angoiss|tendu|pression|urgenc|nerveux|accablé)/,
    tristesse: /(triste|vide|déprim|abattu|seul|découragé|désespéré)/,
    colère: /(colèr|énerv|frustr|injust|rage|irrit)/,
    joie: /(heureux|motivé|content|satisfait|apaisé|reconnaissant)/,
    anxiété: /(inqui|peur|angoiss|panique)/,
    isolement: /(isolé|incompris|seul|déconnecté|abandonné)/,
    reconnaissance: /(merci|remerci|gratitude|reconnaiss)/,
  };

  for (const [emo, regex] of Object.entries(patterns)) {
    if (regex.test(t)) {
      return {
        emotion_dominante: emo,
        intensité: 0.7,
        besoin:
          emo === "fatigue" ? "repos" :
          emo === "stress" ? "soutien" :
          emo === "tristesse" ? "lien" :
          emo === "colère" ? "reconnaissance" :
          emo === "isolement" ? "connexion" :
          "sens",
        ton_recommandé:
          emo === "joie" ? "positif" :
          emo === "colère" ? "calme" :
          emo === "stress" ? "rassurant" :
          "doux",
      };
    }
  }

  return { emotion_dominante: "neutre", intensité: 0.3, besoin: "sens", ton_recommandé: "calme" };
}

// ===========================================================
// 🎭 PERSONA SYSTEM
// ===========================================================
function personaSystem(p: "zena" | "zeno" = "zena", lang: "fr" | "en" = "fr") {
  if (lang === "en") {
    return `You are ZÉNA, the emotional intelligence of QVT Box.
You act as a human companion for well-being at work.
You listen, analyze emotions with care, and explain your reasoning in plain language.
You promote self-regulation, dignity, and shared understanding.
Your purpose is not to judge, but to help people reconnect with meaning and balance.`;
  }

  return `Tu es ZÉNA, intelligence émotionnelle bienveillante de QVT Box.
Tu aides à comprendre ce qui traverse les émotions au travail ou à la maison.
Tu appliques les principes de l’ANACT : écoute, régulation, participation et sens du travail.
Tu expliques tes choix (“je te réponds ainsi car tu sembles fatigué ou tendu”).
Tu accompagnes sans juger, sans diagnostiquer, sans évaluer.
Tu privilégies la co-construction, la prévention et la reconnaissance de l’humain dans son contexte.`;
}
// ===========================================================
// 🧠 ANALYSE ÉMOTIONNELLE (OpenAI → Mistral → locale)
// ===========================================================
async function analyzeEmotion(text: string, lang: "fr" | "en") {
  const prompt = lang === "fr"
    ? `Analyse ce message et renvoie un JSON :
- emotion_dominante : [joie, calme, stress, tristesse, colère, fatigue, isolement]
- intensité : 0–1
- besoin : (repos, reconnaissance, soutien, sens, lien)
- ton_recommandé : (rassurant, motivant, calme, doux, énergisant)
Message : """${text}"""
Réponds uniquement en JSON.`
    : `Analyze this message emotionally. Return JSON with dominant_emotion, intensity, need, tone_hint.`;

  // 1️⃣ OpenAI
  if (OPENAI_API_KEY) {
    try {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_API_KEY}` },
        body: JSON.stringify({ model: OPENAI_MODEL, messages: [{ role: "user", content: prompt }], temperature: 0.3 }),
      });
      const j = await r.json();
      const raw = j.choices?.[0]?.message?.content || "";
      try {
        return JSON.parse(raw);
      } catch {
        return localEmotionAnalysis(text);
      }
    } catch (err) {
      console.warn("[ZENA] ⚠️ OpenAI failed:", err.message);
    }
  }

  // 2️⃣ Mistral
  if (MISTRAL_API_KEY) {
    try {
      const r = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${MISTRAL_API_KEY}` },
        body: JSON.stringify({ model: MISTRAL_MODEL, messages: [{ role: "user", content: prompt }], temperature: 0.4 }),
      });
      const j = await r.json();
      const raw = j.choices?.[0]?.message?.content || "";
      try {
        return JSON.parse(raw);
      } catch {
        return localEmotionAnalysis(text);
      }
    } catch (err) {
      console.warn("[ZENA] ⚠️ Mistral failed:", err.message);
    }
  }

  // 3️⃣ Fallback local
  return localEmotionAnalysis(text);
}

// ===========================================================
// 💬 RÉPONSE IA - VERSION ÉCOUTE ACTIVE NATURELLE
// ===========================================================
async function generateResponse(text: string, emotional: any, persona: string, lang: string, userMemory: string | null) {
  const tone = emotional?.ton_recommandé || "calme";
  const emotion = emotional?.emotion_dominante || "inconnue";
  const besoin = emotional?.besoin || "sens";

  // 🩵 Base de réponses naturelles selon émotion
  const baseResponses: Record<string, string[]> = {
    fatigue: [
      "Tu sembles vraiment fatigué. Prends juste un instant pour souffler.",
      "Tu as le droit de ralentir un peu. C’est déjà bien d’être là.",
      "Repose-toi, même quelques minutes pour toi comptent vraiment."
    ],
    stress: [
      "Je sens que la pression est forte. Respire, tu fais de ton mieux.",
      "Le stress peut être lourd, mais tu n’es pas seul(e) dedans.",
      "Un instant de calme, c’est déjà un pas vers plus de légèreté."
    ],
    tristesse: [
      "Je ressens de la tristesse dans tes mots. Tu peux simplement te poser un moment.",
      "Ce que tu ressens compte, laisse-toi le droit d’être comme tu es.",
      "Tu n’es pas seul(e). Ce que tu vis mérite douceur et respect."
    ],
    colère: [
      "Ta colère dit quelque chose d’important. Respire, elle finira par s’apaiser.",
      "Je comprends que ça te touche profondément. Reste doux avec toi-même.",
      "Ta réaction est humaine, elle montre que tu tiens à ce qui compte."
    ],
    isolement: [
      "Je sens un peu de solitude. Même si tu ne le vois pas, quelqu’un pense à toi.",
      "Tu n’es pas seul(e), vraiment. Ce moment va passer.",
      "Un lien, même petit, peut réchauffer beaucoup. Garde confiance."
    ],
    joie: [
      "Quel bel élan ! Garde cette énergie vivante, elle te va bien.",
      "J’aime sentir cette lumière dans tes mots. Continue sur ce chemin.",
      "C’est beau de te sentir comme ça, savoure ce moment simplement."
    ],
    neutre: [
      "Je t’écoute, prends ton temps.",
      "Je suis là, sans jugement.",
      "Tu peux juste poser ce que tu ressens, tranquillement."
    ],
  };

  const localReply = (baseResponses[emotion] || baseResponses["neutre"])[
    Math.floor(Math.random() * 3)
  ];

  // 🧠 Contexte mémoire : si présent, on ajoute une touche d’évolution douce
  const memoryHint = userMemory
    ? `Je me souviens que tu avais déjà évoqué ${userMemory.split(";")[0].split("(")[0].trim()}.`
    : "";

  // 🩷 Construction finale naturelle
  const finalReply = `${memoryHint ? memoryHint + " " : ""}${localReply}`;

  // 1️⃣ OpenAI ou 2️⃣ Mistral si disponibles
  if (OPENAI_API_KEY || MISTRAL_API_KEY) {
    const provider = OPENAI_API_KEY ? "openai" : "mistral";
    const apiUrl =
      provider === "openai"
        ? "https://api.openai.com/v1/chat/completions"
        : "https://api.mistral.ai/v1/chat/completions";

    try {
      const r = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${provider === "openai" ? OPENAI_API_KEY : MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
          model: provider === "openai" ? OPENAI_MODEL : MISTRAL_MODEL,
          messages: [
            {
              role: "system",
              content: `Tu es ZÉNA, présence bienveillante de QVT Box. Parle comme une personne douce et vraie. Ne pose pas de question, apporte juste du soutien.`,
            },
            {
              role: "user",
              content: `${text}\nÉmotion : ${emotion}\nBesoin : ${besoin}\nTon : ${tone}`,
            },
          ],
          temperature: 0.5,
        }),
      });

      const j = await r.json();
      const reply = j.choices?.[0]?.message?.content?.trim();
      if (reply) return reply;
    } catch (e) {
      console.warn("[ZENA] ⚠️ IA indisponible → fallback local.");
    }
  }

  return finalReply;
}

// ===========================================================
// 🧹 NETTOYAGE DU TEXTE POUR LA VOIX
// ===========================================================
function cleanText(text: string) {
  return text
    .replace(/[🌿💫✨🌙☀️🔥🌧️→🌤️]/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,!?])/g, "$1")
    .trim();
}

// ===========================================================
// 🧩 MÉMOIRE ÉMOTIONNELLE
// ===========================================================
async function saveMemory(text: string, emotional: any, reply: string) {
  try {
    await supa.from("zena_memory").insert({
      message: text,
      emotion: emotional?.emotion_dominante || "inconnue",
      intensity: emotional?.intensité || 0,
      need: emotional?.besoin || "non défini",
      tone: emotional?.ton_recommandé || "calme",
      reply,
      created_at: new Date().toISOString(),
    });
  } catch (e) {
    console.warn("[ZENA] ⚠️ Memory save failed:", e.message);
  }
}

// ===========================================================
// 🚀 HANDLER PRINCIPAL
// ===========================================================
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { status: 200, headers: corsHeaders });

  try {
    const { text, persona = "zena", lang = "fr" } = await req.json();
    if (!text?.trim()) return new Response(JSON.stringify({ error: "missing text" }), { status: 400, headers: corsHeaders });

    const emotional = await analyzeEmotion(text, lang);
    const reply = await generateResponse(text, emotional, persona, lang);
    await saveMemory(text, emotional, reply);

    return new Response(JSON.stringify({ reply, emotional }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[ZENA] ❌ Fatal error:", err);
    return new Response(JSON.stringify({ error: err?.message || "Unexpected error" }), {
      status: 200,
      headers: corsHeaders,
    });
  }
});
