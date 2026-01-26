import { RPSDimension } from './calculators.ts';

export interface RPSAnalysis {
  globalRiskLevel: "faible" | "modéré" | "élevé" | "critique";
  dimensions: {
    intensityWork: RPSDimension;
    emotionalDemands: RPSDimension;
    autonomy: RPSDimension;
    socialRelations: RPSDimension;
    valueConflicts: RPSDimension;
    jobInsecurity: RPSDimension;
  };
  burnoutRiskScore: number;
  motivationIndex: number;
  detectedPatterns: string[];
  recommendedActions: string[];
}
