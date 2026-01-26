import { Routes, Route, Navigate } from "react-router-dom";
import { AppShell, zenaUniverse } from "@qvt/shared";
import LandingPage from "@/pages/LandingPage";
import AuthPage from "@/pages/AuthPage";
import ChooseSpherePage from "@/pages/ChooseSpherePage";
import FamilyOnboardingPage from "@/pages/FamilyOnboardingPage";
import CompanyOnboardingPage from "@/pages/CompanyOnboardingPage";
import FamilyHomePage from "@/pages/family/FamilyHomePage";
import FamilyChatPage from "@/pages/family/FamilyChatPage";
import FamilyPlanningPage from "@/pages/family/FamilyPlanningPage";
import FamilyAlertsPage from "@/pages/family/FamilyAlertsPage";
import FamilyCommunityPage from "@/pages/family/FamilyCommunityPage";
import CompanyHomePage from "@/pages/company/CompanyHomePage";
import CompanyChatPage from "@/pages/company/CompanyChatPage";
import CompanyPlanningPage from "@/pages/company/CompanyPlanningPage";
import CompanyAlertsPage from "@/pages/company/CompanyAlertsPage";
import CompanyCommunityPage from "@/pages/company/CompanyCommunityPage";

const App = () => (
  <AppShell universe={zenaUniverse} mainClassName="mx-auto w-full max-w-6xl px-6 py-8">
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/choose-sphere" element={<ChooseSpherePage />} />

      <Route path="/family/onboarding" element={<FamilyOnboardingPage />} />
      <Route path="/company/onboarding" element={<CompanyOnboardingPage />} />

      <Route path="/family/home" element={<FamilyHomePage />} />
      <Route path="/family/chat" element={<FamilyChatPage />} />
      <Route path="/family/planning" element={<FamilyPlanningPage />} />
      <Route path="/family/alerts" element={<FamilyAlertsPage />} />
      <Route path="/family/community" element={<FamilyCommunityPage />} />

      <Route path="/company/home" element={<CompanyHomePage />} />
      <Route path="/company/chat" element={<CompanyChatPage />} />
      <Route path="/company/planning" element={<CompanyPlanningPage />} />
      <Route path="/company/alerts" element={<CompanyAlertsPage />} />
      <Route path="/company/community" element={<CompanyCommunityPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </AppShell>
);

export default App;
