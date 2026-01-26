import { useEffect, useState, useRef } from "react";

/**
 * 🎤 useAudioAnalyzer – simulation réaliste du niveau audio de la voix IA
 * ------------------------------------------------------------
 * - Simule le mouvement de la bouche ou du halo pendant que ZÉNA parle.
 * - Génère des variations dynamiques basées sur isSpeaking.
 */
export const useAudioAnalyzer = (isSpeaking: boolean) => {
  const [audioLevel, setAudioLevel] = useState(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (isSpeaking) {
      const updateLevel = () => {
        // Variation pseudo-aléatoire fluide
        const level = 0.2 + Math.abs(Math.sin(Date.now() / 150)) * 0.8;
        setAudioLevel(level);
        animationRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();
    } else {
      setAudioLevel(0);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isSpeaking]);

  return audioLevel;
};
