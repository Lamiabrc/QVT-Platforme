export type Emotion = "positive" | "neutral" | "negative";

export function analyzeEmotion(text: string): Emotion {
  const positiveWords = ["merci", "heureux", "satisfait", "bien", "content", "génial", "super"];
  const negativeWords = ["fatigué", "triste", "stressé", "mal", "inquiet", "déçu", "angoissé"];

  const lowerText = text.toLowerCase();

  if (negativeWords.some((w) => lowerText.includes(w))) return "negative";
  if (positiveWords.some((w) => lowerText.includes(w))) return "positive";
  return "neutral";
}
