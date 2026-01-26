// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import ZenaChatpage from "@/pages/ZenaChatpage";
import OnboardingCompany from "@/pages/OnboardingCompany";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Page d’accueil avec le visage Zéna en bulle dorée */}
        <Route path="/" element={<Index />} />

        {/* Espace de conversation Zéna */}
        <Route path="/zena-chat" element={<ZenaChatpage />} />

        {/* Onboarding entreprise (bouton "Créer mon espace RH") */}
        <Route path="/onboarding-company" element={<OnboardingCompany />} />

        {/* 404 / routes inconnues */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
