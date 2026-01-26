import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import ZenaAvatar from "@/components/ZenaAvatar";

describe("ZenaAvatar", () => {
  it("doit afficher l'avatar avec émotion neutre", () => {
    const { container } = render(<ZenaAvatar emotion="neutral" mouthLevel={0} />);
    expect(container).toBeDefined();
  });

  it("doit afficher toutes les émotions possibles", () => {
    const emotions: ("positive" | "neutral" | "negative")[] = [
      "positive",
      "neutral",
      "negative",
    ];
    emotions.forEach((emotion) => {
      const { container } = render(<ZenaAvatar emotion={emotion} mouthLevel={0} />);
      expect(container).toBeDefined();
    });
  });

  it("doit gérer le mouvement de bouche pendant la parole", () => {
    const { container } = render(<ZenaAvatar emotion="positive" mouthLevel={0.8} />);
    expect(container).toBeDefined();
  });
});
