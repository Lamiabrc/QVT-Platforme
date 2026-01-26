import { useState, useEffect } from "react";

interface ScrollNarrativeState {
  currentSection: string;
  scrollProgress: number;
  isIntroComplete: boolean;
  skipIntro: () => void;
}

export function useScrollNarrative(): ScrollNarrativeState {
  const [currentSection, setCurrentSection] = useState("hero");
  const [scrollProgress, setScrollProgress] = useState(0);
  // DEBUG: Force intro to always show for testing
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  // const [isIntroComplete, setIsIntroComplete] = useState(() => {
  //   return localStorage.getItem("zena-intro-seen") === "true";
  // });

  const skipIntro = () => {
    setIsIntroComplete(true);
    localStorage.setItem("zena-intro-seen", "true");
  };

  useEffect(() => {
    if (!isIntroComplete) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);
      setScrollProgress(progress);

      // Detect current section
      const sections = ["hero", "capacites", "comment-ca-marche", "pour-qui", "rencontrer-zena"];
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2;
          if (isVisible) {
            setCurrentSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isIntroComplete]);

  return {
    currentSection,
    scrollProgress,
    isIntroComplete,
    skipIntro,
  };
}
