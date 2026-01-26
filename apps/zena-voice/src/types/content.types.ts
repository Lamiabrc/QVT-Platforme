/**
 * 📚 Types pour les contenus éducatifs
 * ----------------------------------------------------------
 */

export interface LegalContent {
  id: string;
  title: string;
  reference: string; // "Article L4121-1"
  category: "obligation" | "droit" | "prevention";
  summary: string;
  fullText: string;
  effectiveDate: string;
  relatedTopics: string[];
}

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  category: "stress" | "burnout" | "nutrition" | "sleep" | "exercise" | "mental-health";
  author: "ZÉNA" | "Expert QVT";
  readTime: number; // en minutes
  publishedAt: string;
  thumbnail: string;
  summary: string;
  content: string; // Markdown
  tags: string[];
  relatedArticles: string[];
}

export interface HealthTip {
  id: string;
  title: string;
  category: "hydration" | "posture" | "breathing" | "break" | "sleep";
  icon: string;
  shortDescription: string;
  actionableTip: string;
  frequency?: "daily" | "hourly" | "weekly";
}

export interface BurnoutQuestion {
  id: string;
  text: string;
  category: "personal" | "work" | "client";
  order: number;
}

export interface BurnoutResult {
  userId: string;
  completedAt: string;
  personalScore: number;
  workScore: number;
  clientScore: number;
  totalScore: number;
  riskLevel: "low" | "moderate" | "high" | "critical";
  zenaInsight: string;
  recommendations: string[];
}
