import { useState } from "react";

export interface EmotionSnapshot {
  emotion: "positive" | "neutral" | "negative";
  timestamp: number;
}

export function useZenaMemory(limit: number = 7) {
  const [history, setHistory] = useState<EmotionSnapshot[]>([]);

  const addEmotion = (emotion: EmotionSnapshot["emotion"]) => {
    const entry = { emotion, timestamp: Date.now() };
    setHistory((prev) => {
      const updated = [...prev, entry];
      if (updated.length > limit) updated.shift();
      return updated;
    });
  };

  const getTrend = (): "improving" | "stable" | "declining" => {
    if (history.length < 2) return "stable";
    const score = (e: EmotionSnapshot["emotion"]) => (e === "positive" ? 1 : e === "negative" ? -1 : 0);
    const diff = score(history.at(-1)!.emotion) - score(history[0].emotion);
    return diff > 0 ? "improving" : diff < 0 ? "declining" : "stable";
  };

  return { history, addEmotion, getTrend };
}
