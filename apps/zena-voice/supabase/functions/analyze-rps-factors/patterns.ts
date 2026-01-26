import { RPSAnalysis } from './types.ts';

export function detectPatterns(analysis: RPSAnalysis): string[] {
  const patterns: string[] = [];

  // Surcharge chronique
  if (analysis.dimensions.intensityWork.score >= 70) {
    patterns.push('surcharge_chronique');
  }

  // Isolement social
  if (analysis.dimensions.socialRelations.score >= 60) {
    patterns.push('isolement_social');
  }

  // Perte de sens
  if (analysis.dimensions.valueConflicts.score >= 65) {
    patterns.push('perte_de_sens');
  }

  // Risque burnout global
  if (analysis.burnoutRiskScore >= 51) {
    patterns.push('risque_burnout_élevé');
  }

  // Démotivation profonde
  if (analysis.motivationIndex < 30) {
    patterns.push('démotivation_profonde');
  }

  // Manque d'autonomie
  if (analysis.dimensions.autonomy.score >= 65) {
    patterns.push('manque_autonomie');
  }

  return patterns;
}

export function generateRecommendations(analysis: RPSAnalysis): string[] {
  const recommendations: string[] = [];

  if (analysis.burnoutRiskScore >= 71) {
    recommendations.push("Consulter immédiatement le médecin du travail");
    recommendations.push("Prendre contact avec la ligne d'écoute psychologique");
  } else if (analysis.burnoutRiskScore >= 51) {
    recommendations.push("Planifier un entretien avec le manager pour réévaluer la charge");
    recommendations.push("Envisager un test burnout complet avec un professionnel");
  }

  if (analysis.dimensions.intensityWork.score >= 65) {
    recommendations.push("Revoir la répartition des tâches et prioriser");
    recommendations.push("Mettre en place des limites (horaires, interruptions)");
  }

  if (analysis.dimensions.socialRelations.score >= 60) {
    recommendations.push("Organiser des moments d'équipe informels");
    recommendations.push("Demander un coaching ou médiation si conflits");
  }

  if (analysis.motivationIndex < 40) {
    recommendations.push("Identifier un projet motivant ou formation");
    recommendations.push("Discuter d'évolution de carrière avec RH");
  }

  return recommendations;
}
