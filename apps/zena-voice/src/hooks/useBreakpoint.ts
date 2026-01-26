// src/hooks/useBreakpoint.ts
import { useEffect, useState } from "react";

type Breakpoint = "mobile" | "tablet" | "desktop";

const QUERIES = {
  mobile: "(max-width: 767.98px)",
  tablet: "(min-width: 768px) and (max-width: 1023.98px)",
  desktop: "(min-width: 1024px)",
} as const;

function getCurrent(): Breakpoint {
  if (typeof window === "undefined" || !window.matchMedia) return "desktop";
  if (window.matchMedia(QUERIES.mobile).matches) return "mobile";
  if (window.matchMedia(QUERIES.tablet).matches) return "tablet";
  return "desktop";
}

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(getCurrent);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mqs = {
      mobile: window.matchMedia(QUERIES.mobile),
      tablet: window.matchMedia(QUERIES.tablet),
      desktop: window.matchMedia(QUERIES.desktop),
    };

    const onChange = () => setBreakpoint(getCurrent());
    const add = (mq: MediaQueryList) =>
      mq.addEventListener ? mq.addEventListener("change", onChange) : mq.addListener(onChange);
    const remove = (mq: MediaQueryList) =>
      mq.removeEventListener ? mq.removeEventListener("change", onChange) : mq.removeListener(onChange);

    Object.values(mqs).forEach(add);
    // sync immédiat (utile si hydration sur mobile)
    onChange();

    return () => { Object.values(mqs).forEach(remove); };
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === "mobile",
    isTablet: breakpoint === "tablet",
    isDesktop: breakpoint === "desktop",
  };
}
