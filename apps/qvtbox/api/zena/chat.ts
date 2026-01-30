import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

type RiskResult = {
  score: number;
  labels: string[];
};

const getEnv = (name: string) => process.env[name];

const buildRisk = (message: string): RiskResult => {
  const text = message.toLowerCase();
  const rules: { label: string; tokens: string[]; weight: number }[] = [
    { label: "deprime", tokens: ["déprime", "deprime", "triste", "vide", "fatigué"], weight: 0.2 },
    { label: "harcelement", tokens: ["harcèlement", "harcelement", "harcelé", "harcele"], weight: 0.3 },
    { label: "isolement", tokens: ["seul", "isolé", "isole", "personne"], weight: 0.2 },
    { label: "danger", tokens: ["suicide", "me tuer", "disparaître", "disparaitre"], weight: 0.6 },
    { label: "addiction", tokens: ["addiction", "alcool", "drogue"], weight: 0.3 },
  ];

  let score = 0;
  const labels: string[] = [];

  rules.forEach((rule) => {
    if (rule.tokens.some((token) => text.includes(token))) {
      score += rule.weight;
      labels.push(rule.label);
    }
  });

  score = Math.min(1, Number(score.toFixed(2)));

  return { score, labels };
};

const buildPrompt = (sphere: string) => {
  if (sphere === "family") {
    return "Tu es ZÉNA, une IA émotionnelle bienveillante pour les familles. Écoute, reformule, propose 1 à 3 actions simples. Ne remplace pas les urgences.";
  }
  return "Tu es ZÉNA, une IA émotionnelle pour les équipes. Écoute, reformule, propose 1 à 3 actions concrètes. Ne remplace pas les urgences.";
};

const getSupabase = () => {
  const url = getEnv("SUPABASE_URL") || getEnv("VITE_SUPABASE_URL");
  const serviceKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
};

const callOpenAI = async (message: string, sphere: string) => {
  const apiKey = getEnv("OPENAI_API_KEY");
  if (!apiKey) {
    return {
      reply:
        "ZÉNA (mode démo) : Je suis là pour écouter. Dis-m'en plus sur ce que tu ressens et ce dont tu as besoin maintenant.",
    };
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: buildPrompt(sphere) },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 220,
    }),
  });

  if (!response.ok) {
    throw new Error("OpenAI request failed");
  }

  const data = await response.json();
  const reply = data?.choices?.[0]?.message?.content ??
    "ZÉNA (fallback) : Je t'écoute. Tu veux me raconter un peu plus ?";

  return { reply };
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { message, sphere, userId, conversationId, familyId, companyId } = req.body || {};

  if (!message || !sphere) {
    res.status(400).json({ error: "Missing message or sphere" });
    return;
  }

  try {
    const risk = buildRisk(message);
    const { reply } = await callOpenAI(message, sphere);

    let convoId = conversationId as string | null;
    let replyId: string | null = null;

    const supabase = getSupabase();

    if (supabase && userId) {
      if (!convoId) {
        const { data: convo, error } = await supabase
          .from("conversations")
          .insert({
            user_id: userId,
            sphere,
            family_id: familyId ?? null,
            company_id: companyId ?? null,
          })
          .select("id")
          .single();

        if (!error && convo?.id) {
          convoId = convo.id;
        }
      }

      if (convoId) {
        const { data: userMsg } = await supabase
          .from("messages")
          .insert({
            conversation_id: convoId,
            author: "user",
            content: message,
            risk_score: risk.score,
            risk_labels: risk.labels,
          })
          .select("id")
          .single();

        if (userMsg?.id) {
          await supabase.from("risk_assessments").insert({
            message_id: userMsg.id,
            score: risk.score,
            labels: risk.labels,
            sphere,
            family_id: familyId ?? null,
            company_id: companyId ?? null,
            created_by: userId,
          });

          if (risk.score >= 0.6) {
            await supabase.from("alerts").insert({
              family_id: familyId ?? null,
              company_id: companyId ?? null,
              created_by: userId,
              category: "signal_faible",
              severity: risk.score >= 0.8 ? "high" : "medium",
              message: message,
              status: "open",
            });
          }
        }

        const { data: replyRow } = await supabase
          .from("messages")
          .insert({
            conversation_id: convoId,
            author: "zena",
            content: reply,
          })
          .select("id")
          .single();

        replyId = replyRow?.id ?? null;
      }
    }

    res.status(200).json({
      reply,
      risk,
      conversationId: convoId,
      replyId,
    });
  } catch (error: any) {
    res.status(500).json({
      error: "ZÉNA is unavailable",
      details: error?.message,
    });
  }
}
