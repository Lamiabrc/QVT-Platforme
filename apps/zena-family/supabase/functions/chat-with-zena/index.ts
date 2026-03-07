import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const VALID_MODELS = [
  "google/gemini-2.5-flash",
  "google/gemini-2.5-pro",
  "google/gemini-2.5-flash-lite",
  "openai/gpt-5",
  "openai/gpt-5-mini",
  "openai/gpt-5-nano",
] as const;

const DEFAULT_MODEL = "openai/gpt-5-mini";

const resolveSystemPrompt = (memberRole: string) => {
  if (memberRole === "parent") {
    return `Tu es ZENA, une IA bienveillante qui aide les parents a comprendre leurs ados et a communiquer avec eux.

Ton role:
- Ecouter sans juger
- Reformuler les emotions avec douceur
- Aider a decoder les comportements des ados
- Proposer des pistes de dialogue apaise
- Rappeler que chaque emotion est valide

Ton ton: rassurant, empathique, oriente soutien educatif.

Important:
- Tu n'es ni psychologue ni coach, juste une presence emotionnelle intelligente
- Reste dans ton role de soutien familial
- Encourage le dialogue parent-ado
- Suggere des approches bienveillantes`;
  }

  return `Tu es ZENA, une IA complice qui aide les ados a exprimer leurs emotions et a communiquer avec leurs parents.

Ton role:
- Ecouter sans moraliser
- Reformuler ce que l'ado ressent
- Aider a trouver les mots pour exprimer ses emotions
- Proposer des activites expressives (ecriture, respiration, etc.)
- Suggere comment en parler a la famille si besoin

Ton ton: complice, empathique, non moralisateur, respectueux.

Important:
- Tu n'es ni psychologue ni coach, juste une presence emotionnelle intelligente
- Reste dans ton role de soutien familial
- Ne juge jamais
- Respecte le besoin d'intimite des ados
- Propose ton aide pour faciliter la communication familiale`;
};

const toErrorMessage = (rawText: string): string => {
  if (!rawText.trim()) return "Erreur de l'IA";
  try {
    const parsed = JSON.parse(rawText);
    return parsed?.msg || parsed?.error?.message || parsed?.error || parsed?.message || "Erreur de l'IA";
  } catch {
    return rawText;
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      messages,
      memberRole,
      conversationId: _conversationId,
      model = DEFAULT_MODEL,
    } = await req.json();

    const AI_API_KEY = Deno.env.get("AI_API_KEY");
    const AI_BASE_URL = Deno.env.get("AI_BASE_URL");

    if (!AI_API_KEY) {
      throw new Error("AI_API_KEY is not configured");
    }
    if (!AI_BASE_URL) {
      throw new Error("AI_BASE_URL is not configured");
    }

    const selectedModel = VALID_MODELS.includes(model) ? model : DEFAULT_MODEL;
    const systemPrompt = resolveSystemPrompt(memberRole ?? "ado");
    const inputMessages = Array.isArray(messages) ? messages : [];

    const callGateway = (targetModel: string) =>
      fetch(AI_BASE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: targetModel,
          messages: [{ role: "system", content: systemPrompt }, ...inputMessages],
          stream: true,
        }),
      });

    let usedModel = selectedModel;
    console.log(`Using model: ${usedModel} for role: ${memberRole}`);

    let response = await callGateway(usedModel);
    let errorText = response.ok ? "" : await response.text();

    // If google provider is not enabled for this key, retry automatically with OpenAI models.
    if (!response.ok) {
      const lowerError = errorText.toLowerCase();
      const providerDisabled =
        response.status === 400 &&
        (lowerError.includes("unsupported provider") || lowerError.includes("provider is not enabled"));

      if (providerDisabled && usedModel.startsWith("google/")) {
        const fallbackModels = ["openai/gpt-5-mini", "openai/gpt-5-nano", "openai/gpt-5"];
        for (const fallbackModel of fallbackModels) {
          if (!VALID_MODELS.includes(fallbackModel) || fallbackModel === usedModel) continue;

          console.warn(`Provider disabled for ${usedModel}. Retrying with ${fallbackModel}.`);
          const fallbackResponse = await callGateway(fallbackModel);
          if (fallbackResponse.ok) {
            response = fallbackResponse;
            usedModel = fallbackModel;
            errorText = "";
            break;
          }

          response = fallbackResponse;
          errorText = await fallbackResponse.text();
        }
      }
    }

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Trop de requetes, reessayez dans un moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits insuffisants." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({
          error: toErrorMessage(errorText),
        }),
        {
          status: response.status >= 400 && response.status < 600 ? response.status : 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "X-Zena-Model": usedModel,
      },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Erreur inconnue",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
