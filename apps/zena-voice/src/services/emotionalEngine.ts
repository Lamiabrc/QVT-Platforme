// Zena Emotional Engine (frontend-friendly wrapper)
import {
  analyzeInput as analyzeInputCore,
  generateEmpathicResponse as generateEmpathicResponseCore,
  generateRecommendations as generateRecommendationsCore,
  safetyMessage,
  type EmotionalAnalysis,
} from "../../supabase/functions/_shared/emotionalEngine";

export { safetyMessage };
export type { EmotionalAnalysis };

export function analyzeInput(text: string, scores?: Record<string, number>) {
  return analyzeInputCore(text, scores);
}

export function generateEmpathicResponse(profile: Record<string, any> | null, emotionalState: EmotionalAnalysis) {
  return generateEmpathicResponseCore(profile, emotionalState);
}

export function generateRecommendations(profile: Record<string, any> | null, emotionalState: EmotionalAnalysis) {
  return generateRecommendationsCore(profile, emotionalState);
}
