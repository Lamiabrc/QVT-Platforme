import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MobileWrapper } from "@/components/mobile/MobileWrapper";
import { BottomTabBar } from "@/components/mobile/BottomTabBar";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import FamilySpace from "./pages/FamilySpace";
import Journal from "./pages/Journal";
import Profile from "./pages/Profile";
import Calendar from "./pages/Calendar";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

/**
 * ❤️ ZÉNA Family – ena-family-heartlink
 * Domaine : https://zena-family.qvtbox.com
 * Univers : Parents / Ados / Bulle familiale
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MobileWrapper>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* 🏠 Accueil Zéna Family */}
            <Route path="/" element={<Index />} />

            {/* 🔐 Auth / Onboarding famille */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* 🌈 Pages coeur de l'app famille */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/family" element={<FamilySpace />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/calendar" element={<Calendar />} />

            {/* 🔗 Passerelles vers les autres univers */}
            <Route
              path="/zena-travail"
              element={<Navigate to="https://zena.qvtbox.com" replace />}
            />
            <Route
              path="/qvtbox"
              element={<Navigate to="https://www.qvtbox.com" replace />}
            />

            {/* CATCH-ALL */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* 📱 Barre d’onglets mobile (Zéna Family) */}
          <BottomTabBar />
        </BrowserRouter>
      </MobileWrapper>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
