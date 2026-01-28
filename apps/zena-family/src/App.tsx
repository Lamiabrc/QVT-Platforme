import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell, QVTBOX_URL, ZENA_VOICE_URL } from "@qvt/shared";
import { universe } from "@/config/universe";
import { MobileWrapper } from "@/components/mobile/MobileWrapper";
import { BottomTabBar } from "@/components/mobile/BottomTabBar";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import FamilySpace from "./pages/FamilySpace";
import Alerts from "./pages/Alerts";
import Journal from "./pages/Journal";
import Profile from "./pages/Profile";
import Calendar from "./pages/Calendar";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ExternalRedirect = ({ to }: { to: string }) => {
  if (typeof window !== "undefined") {
    window.location.href = to;
  }
  return null;
};

/**
 * ZENA Family - ena-family-heartlink
 * Domain: https://zena-family.qvtbox.com
 * Universe: Parents / Teens / Family space
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MobileWrapper>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppShell universe={universe}>
            <Routes>
              {/* Zena Family home */}
              <Route path="/" element={<Index />} />

              {/* Auth / family onboarding */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/onboarding" element={<Onboarding />} />

              {/* Core family app pages */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/family" element={<FamilySpace />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/calendar" element={<Calendar />} />

              {/* Gateways to other universes */}
              <Route path="/zena-travail" element={<ExternalRedirect to={ZENA_VOICE_URL} />} />
              <Route path="/qvtbox" element={<ExternalRedirect to={QVTBOX_URL} />} />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>

            {/* Mobile tab bar (Zena Family) */}
            <BottomTabBar />
          </AppShell>
        </BrowserRouter>
      </MobileWrapper>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
