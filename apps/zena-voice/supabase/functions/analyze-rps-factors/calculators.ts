import { RPS_KEYWORDS, BURNOUT_KEYWORDS } from './keywords.ts';

export interface RPSDimension {
  score: number;
  keywords: string[];
  alerts: string[];
}

export function calculateDimensionScore(text: string, dimension: keyof typeof RPS_KEYWORDS): RPSDimension {
  const lowerText = text.toLowerCase();
  const keywords = RPS_KEYWORDS[dimension];
  
  let score = 50; // Neutre par défaut
  const foundKeywords: string[] = [];
  const alerts: string[] = [];

  // Analyser les keywords high (augmentent le score de risque)
  for (const kw of keywords.high) {
    if (lowerText.includes(kw)) {
      score += 8;
      foundKeywords.push(kw);
    }
  }

  // Analyser les keywords medium
  for (const kw of keywords.medium) {
    if (lowerText.includes(kw)) {
      score += 4;
      foundKeywords.push(kw);
    }
  }

  // Analyser les keywords low (diminuent le score de risque)
  for (const kw of keywords.low) {
    if (lowerText.includes(kw)) {
      score -= 5;
      foundKeywords.push(kw);
    }
  }

  // Limiter le score entre 0 et 100
  score = Math.max(0, Math.min(100, score));

  // Générer des alertes selon le score
  if (score >= 70) {
    alerts.push(`Risque élevé détecté sur la dimension "${dimension}"`);
  } else if (score >= 50) {
    alerts.push(`Attention: surveillance recommandée sur "${dimension}"`);
  }

  return { score: Math.round(score), keywords: foundKeywords, alerts };
}

export function calculateBurnoutScore(text: string): number {
  const lowerText = text.toLowerCase();
  let totalScore = 0;

  // Épuisement émotionnel (40 points max)
  let exhaustionScore = 0;
  for (const kw of BURNOUT_KEYWORDS.emotionalExhaustion) {
    if (lowerText.includes(kw)) exhaustionScore += 4;
  }
  totalScore += Math.min(40, exhaustionScore);

  // Dépersonnalisation (30 points max)
  let depersonScore = 0;
  for (const kw of BURNOUT_KEYWORDS.depersonalization) {
    if (lowerText.includes(kw)) depersonScore += 5;
  }
  totalScore += Math.min(30, depersonScore);

  // Réduction accomplissement (30 points max)
  let accomplishmentScore = 0;
  for (const kw of BURNOUT_KEYWORDS.reducedAccomplishment) {
    if (lowerText.includes(kw)) accomplishmentScore += 5;
  }
  totalScore += Math.min(30, accomplishmentScore);

  return Math.min(100, totalScore);
}

export function calculateMotivationIndex(text: string): number {
  const lowerText = text.toLowerCase();
  let motivationScore = 50; // Neutre par défaut

  const positiveKeywords = ['motivé', 'envie', 'objectif', 'projet', 'fier', 'réussite', 'progression', 'apprendre'];
  const negativeKeywords = ['démotivé', 'plus envie', 'lassitude', 'routine', 'ennui', 'stagnation'];

  for (const kw of positiveKeywords) {
    if (lowerText.includes(kw)) motivationScore += 8;
  }

  for (const kw of negativeKeywords) {
    if (lowerText.includes(kw)) motivationScore -= 10;
  }

  return Math.max(0, Math.min(100, motivationScore));
}
