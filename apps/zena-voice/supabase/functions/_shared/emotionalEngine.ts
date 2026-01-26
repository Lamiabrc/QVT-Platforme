type Scores = {
  energie?: number;
  stress?: number;
  isolement?: number;
  fatigue?: number;
};

type ProfileLite = {
  role_principal?: string | null;
  contexte?: string | null;
  age?: number | null;
  genre?: string | null;
  relation_familiale?: string | null;
};

export type EmotionalAnalysis = {
  role: "salarie" | "parent" | "ado" | "inconnu";
  dominantEmotion: string;
  detectedSignals: string[];
  redFlags: string[];
  riskLevel: "faible" | "modere" | "eleve" | "critique";
  burnoutRisk: "faible" | "modere" | "eleve";
  dropoutRisk: "faible" | "modere" | "eleve";
  tone: "doux" | "rassurant" | "energisant";
  summary: string;
  scores: Scores;
};

const dangerPhrases = [
  "je vais en finir",
  "plus envie de vivre",
  "me faire du mal",
  "me tuer",
  "suicide",
  "envie de mourir",
  "tout arrÊter",
  "je panique",
  "crise d'angoisse",
  "je saigne",
  "il me frappe",
  "elle me frappe",
  "violent",
  "violence",
];

const redFlagResponse =
  "Je suis là avec toi. Ce que tu ressens est important. Je ne suis pas un professionnel de santé, mais je veux que tu sois en sécurité. Parle dès que possible à un adulte de confiance ou à un professionnel.";

const lexique = {
  stress: ["stress", "angoiss", "pression", "tendu", "surcharge"],
  fatigue: ["fatigue", "épuis", "lassé", "vidé", "crevé"],
  isolement: ["seul", "isol", "personne", "abandonn"],
  colere: ["colère", "énerv", "furieux", "injustice", "frustr"],
  perteSens: ["plus de sens", "inutile", "à quoi bon", "vide", "absurde"],
  ado: ["lycée", "lyceen", "college", "professeur", "parents", "ado"],
  parent: ["mon enfant", "ma fille", "mon fils", "parents", "famille"],
  salarie: ["manager", "travail", "entreprise", "boulot", "collègue"],
};

function containsAny(text: string, keys: string[]) {
  return keys.some((k) => text.includes(k));
}

function scoreFromKeywords(text: string, keys: string[], base = 0) {
  let score = base;
  keys.forEach((k) => {
    if (text.includes(k)) score += 1;
  });
  return Math.min(score, 10);
}

export function analyzeInput(text: string, scores: Scores = {}): EmotionalAnalysis {
  const lower = text.toLowerCase();

  const redFlags = dangerPhrases.filter((k) => lower.includes(k));
  const detectedSignals: string[] = [];

  const stressScore = scoreFromKeywords(lower, lexique.stress, scores.stress || 0);
  const fatigueScore = scoreFromKeywords(lower, lexique.fatigue, scores.energie ? 10 - scores.energie : scores.fatigue || 0);
  const isolementScore = scoreFromKeywords(lower, lexique.isolement, scores.isolement || 0);

  if (stressScore > 6) detectedSignals.push("stress");
  if (fatigueScore > 6) detectedSignals.push("fatigue");
  if (isolementScore > 6) detectedSignals.push("isolement");
  if (containsAny(lower, lexique.colere)) detectedSignals.push("colere");
  if (containsAny(lower, lexique.perteSens)) detectedSignals.push("perte_de_sens");

  const role: EmotionalAnalysis["role"] = containsAny(lower, lexique.ado)
    ? "ado"
    : containsAny(lower, lexique.parent)
    ? "parent"
    : containsAny(lower, lexique.salarie)
    ? "salarie"
    : "inconnu";

  const combinedStress = (stressScore + fatigueScore + isolementScore) / 3;
  const riskLevel: EmotionalAnalysis["riskLevel"] =
    redFlags.length > 0 || combinedStress >= 8
      ? "critique"
      : combinedStress >= 6
      ? "eleve"
      : combinedStress >= 3
      ? "modere"
      : "faible";

  const burnoutRisk: EmotionalAnalysis["burnoutRisk"] =
    stressScore >= 8 || fatigueScore >= 8 ? "eleve" : stressScore >= 5 ? "modere" : "faible";
  const dropoutRisk: EmotionalAnalysis["dropoutRisk"] =
    isolementScore >= 8 ? "eleve" : isolementScore >= 5 ? "modere" : "faible";

  const dominantEmotion =
    redFlags.length > 0
      ? "detresse"
      : detectedSignals[0] || (combinedStress > 4 ? "stress" : "calme");

  const tone: EmotionalAnalysis["tone"] =
    riskLevel === "critique" || riskLevel === "eleve"
      ? "rassurant"
      : combinedStress <= 2
      ? "doux"
      : "energisant";

  const summary = `Rôle: ${role} | Emotion: ${dominantEmotion} | Signal(s): ${detectedSignals.join(", ") || "aucun"} | Risque: ${riskLevel}`;

  return {
    role,
    dominantEmotion,
    detectedSignals,
    redFlags,
    riskLevel,
    burnoutRisk,
    dropoutRisk,
    tone,
    summary,
    scores: {
      energie: scores.energie,
      stress: stressScore,
      isolement: isolementScore,
      fatigue: fatigueScore,
    },
  };
}

export function generateEmpathicResponse(profile: ProfileLite | null, emotional: EmotionalAnalysis) {
  const nameHint = profile?.contexte ? `Je garde en tête ton contexte: ${profile.contexte}. ` : "";
  const base = `${nameHint}Je t'écoute. Je perçois ${emotional.dominantEmotion.replace("_", " ")} avec un niveau ${emotional.riskLevel}.`;
  const relief =
    emotional.dominantEmotion === "stress"
      ? "Respire lentement, je reste avec toi quelques instants."
      : emotional.dominantEmotion === "fatigue"
      ? "Tu as le droit de lever le pied, même quelques minutes pour toi."
      : emotional.dominantEmotion === "isolement"
      ? "Tu n'es pas seul(e), je reste en ligne avec toi."
      : "Je suis là, avançons à ton rythme.";

  const safety = emotional.redFlags.length > 0 ? ` ${redFlagResponse}` : "";

  return `${base} ${relief}${safety}`;
}

export function generateRecommendations(profile: ProfileLite | null, emotional: EmotionalAnalysis) {
  const role = profile?.role_principal || emotional.role;
  const recs = [];

  if (emotional.redFlags.length > 0) {
    recs.push({
      title: "Sécurité immédiate",
      description: redFlagResponse,
      priority: "critique",
      category: "safety",
      source: "zena-engine",
    });
  }

  if (emotional.burnoutRisk !== "faible") {
    recs.push({
      title: "Décompression guidée",
      description: "Faire une pause de 5 minutes, respiration 4-7-8, éloigner l'écran et boire un verre d'eau.",
      priority: emotional.burnoutRisk === "eleve" ? "haute" : "moyenne",
      category: "burnout",
      source: "zena-engine",
    });
  }

  if (emotional.dropoutRisk !== "faible") {
    recs.push({
      title: "Reconnexion sociale",
      description: "Envoie un message à une personne de confiance pour partager ton ressenti en une phrase.",
      priority: "moyenne",
      category: "isolement",
      source: "zena-engine",
    });
  }

  if (role === "salarie") {
    recs.push({
      title: "Micro-victoire",
      description: "Liste une tâche réalisable en 10 minutes et finalise-la pour regagner du contrôle.",
      priority: "moyenne",
      category: "travail",
      source: "zena-engine",
    });
  } else if (role === "parent") {
    recs.push({
      title: "Respiration à deux",
      description: "Propose un exercice respiratoire simple avec ton enfant pour apaiser la maison.",
      priority: "moyenne",
      category: "famille",
      source: "zena-engine",
    });
  } else if (role === "ado") {
    recs.push({
      title: "Point d'ancrage",
      description: "Envoie un message à un adulte de confiance ou un ami pour dire comment tu te sens.",
      priority: "haute",
      category: "soutien",
      source: "zena-engine",
    });
  }

  if (recs.length === 0) {
    recs.push({
      title: "Hydratation et pause",
      description: "Bois un verre d'eau et étire tes épaules 30 secondes avant de continuer.",
      priority: "basse",
      category: "bien-etre",
      source: "zena-engine",
    });
  }

  return recs;
}

export const safetyMessage = redFlagResponse;
