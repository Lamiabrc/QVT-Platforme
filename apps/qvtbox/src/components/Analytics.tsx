import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window { gtag?: (...args: any[]) => void }
}

const GA_ID = import.meta.env.VITE_GA_ID;

export default function Analytics() {
  const location = useLocation();

  useEffect(() => {
    if (!GA_ID || !window.gtag) return;

    window.gtag("config", GA_ID, {
      page_path: location.pathname + location.search,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [location.pathname, location.search]);

  return null;
}
