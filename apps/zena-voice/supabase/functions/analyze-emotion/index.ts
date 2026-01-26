import OpenAI from "openai";
const openai = new OpenAI();

Deno.serve(async (req) => {
  const { text } = await req.json();

  const prompt = `
  Analyse ce texte et renvoie une structure JSON avec :
  - emotion_dominante (joie, stress, colère, tristesse, calme, fatigue, isolement)
  - intensité (0 à 1)
  - besoin sous-jacent (reconnaissance, repos, soutien, sens)
  - ton_recommandé (bienveillant, rassurant, motivant, calme)
  
  Texte : "${text}"
  `;

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
  });

  return new Response(res.choices[0].message.content, {
    headers: { "Content-Type": "application/json" },
  });
});
