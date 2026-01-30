// src/App.tsx
import React, { Suspense, lazy } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { AppShell } from "@qvt/shared";
import { universe } from "@/config/universe";

// UI notifications
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

// Providers & initializers
import { CartProvider } from "./hooks/useCart";
import AppInitializer from "./components/AppInitializer";
import GlobalSEO from "./components/GlobalSEO";
import { useAuth } from "@/hooks/useAuth";

/** -------- Lazy pages -------- */
const Index = lazy(() => import("./pages/Index"));
const BoxPage = lazy(() => import("./pages/BoxPage"));
const ProfessionalSaasPage = lazy(() => import("./pages/ProfessionalSaasPage"));
const BoutiquePage = lazy(() => import("./pages/BoutiquePage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const CheckoutSuccessPage = lazy(() => import("./pages/CheckoutSuccessPage"));
const CheckoutCancelPage = lazy(() => import("./pages/CheckoutCancelPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const MoodDashboard = lazy(() => import("./pages/MoodDashboard"));
const AdminPage = lazy(() => import("./pages/AdminPage"));

const CMSLayout = lazy(() => import("./components/cms/CMSLayout"));
const CMSIndexPage = lazy(() => import("./pages/cms/CMSIndexPage"));
const ProductsPage = lazy(() => import("./pages/cms/ProductsPage"));
const ProductFormPage = lazy(() => import("./pages/cms/ProductFormPage"));
const ImagesPage = lazy(() => import("./pages/cms/ImagesPage"));
const SettingsPage = lazy(() => import("./pages/cms/SettingsPage"));
const CMSPartnersPage = lazy(() => import("./pages/cms/PartnersPage"));
const MediaPage = lazy(() => import("./pages/cms/MediaPage"));

const AuthPage = lazy(() => import("./pages/AuthPage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const AuthCallbackPage = lazy(() => import("./pages/auth/AuthCallbackPage"));
const ResetPasswordPage = lazy(() => import("./pages/auth/ResetPasswordPage"));
const LogoutPage = lazy(() => import("./pages/auth/LogoutPage"));

const SimulateurPage = lazy(() => import("./pages/SimulateurPage"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const MentionsLegalesPage = lazy(() => import("./pages/MentionsLegalesPage"));
const PolitiqueConfidentialitePage = lazy(
  () => import("./pages/PolitiqueConfidentialitePage")
);
const CGVPage = lazy(() => import("./pages/CGVPage"));
const MobilePage = lazy(() => import("./pages/MobilePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ManifestPage = lazy(() => import("./pages/ManifestPage"));

/** Engagements */
const EngagementsPage = lazy(() => import("./pages/EngagementsPage"));

/** ZÉNA — Pages internes */
const ZenaEntreprisePage = lazy(() => import("./pages/ZenaEntreprisePage"));
const ZenaFamilyPage = lazy(() => import("./pages/ZenaFamilyPage"));
const ZenaChoicePage = lazy(() => import("./pages/ZenaChoicePage"));

/** QVT Box - nouvelles sphères */
const EntreprisePage = lazy(() => import("./pages/EntreprisePage"));
const EntrepriseJoinPage = lazy(() => import("./pages/EntrepriseJoinPage"));
const FamillePage = lazy(() => import("./pages/FamillePage"));
const FamilleCreatePage = lazy(() => import("./pages/FamilleCreatePage"));
const FamilleInvitePage = lazy(() => import("./pages/FamilleInvitePage"));
const FamilleJoinPage = lazy(() => import("./pages/FamilleJoinPage"));
const FamilleDashboardPage = lazy(() => import("./pages/FamilleDashboardPage"));
const ChoisirSpherePage = lazy(() => import("./pages/ChoisirSpherePage"));
const ProfileRedirectPage = lazy(() => import("./pages/ProfileRedirectPage"));

/** Fallback visuel */
function Fallback() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center text-sm text-foreground/60">
      Chargement...
    </div>
  );
}

const AppShellWithAuth = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <AppShell
      universe={universe}
      account={{
        isAuthenticated,
        accountHref: isAuthenticated && user ? "/profil" : "/auth",
        onSignOut: handleSignOut,
      }}
    >
      {children}
    </AppShell>
  );
};

const App = () => (
  <CartProvider>
    <AppInitializer>
      <GlobalSEO />

      <Toaster />
      <Sonner />

      <BrowserRouter>
        <AppShellWithAuth>
          <Suspense fallback={<Fallback />}>
            <Routes>
              {/* Domaine principal */}
              <Route path="/" element={<Index />} />
              <Route path="/box" element={<BoxPage />} />
              <Route path="/saas" element={<ProfessionalSaasPage />} />
              <Route path="/boutique" element={<BoutiquePage />} />
              <Route path="/mobile" element={<MobilePage />} />
              <Route path="/boutique/produit/:slug" element={<ProductDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/simulateur" element={<SimulateurPage />} />

              {/* Engagements */}
              <Route path="/engagements" element={<EngagementsPage />} />

              {/* Paiement */}
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
              <Route path="/checkout/cancel" element={<CheckoutCancelPage />} />

              {/* Auth */}
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="/auth/logout" element={<LogoutPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* Dashboards */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/entreprise/dashboard" element={<DashboardPage />} />
              <Route path="/mood" element={<MoodDashboard />} />
              <Route path="/user-dashboard" element={<UserDashboard />} />
              <Route path="/profil" element={<ProfileRedirectPage />} />

              {/* Admin */}
              <Route path="/admin" element={<AdminPage />} />

              {/* CMS */}
              <Route
                path="/cms"
                element={
                  <CMSLayout>
                    <CMSIndexPage />
                  </CMSLayout>
                }
              />
              <Route
                path="/cms/products"
                element={
                  <CMSLayout>
                    <ProductsPage />
                  </CMSLayout>
                }
              />
              <Route
                path="/cms/products/new"
                element={
                  <CMSLayout>
                    <ProductFormPage />
                  </CMSLayout>
                }
              />
              <Route
                path="/cms/products/edit/:id"
                element={
                  <CMSLayout>
                    <ProductFormPage />
                  </CMSLayout>
                }
              />
              <Route
                path="/cms/images"
                element={
                  <CMSLayout>
                    <ImagesPage />
                  </CMSLayout>
                }
              />
              <Route
                path="/cms/partners/applications"
                element={
                  <CMSLayout>
                    <CMSPartnersPage />
                  </CMSLayout>
                }
              />
              <Route
                path="/cms/partners/approved"
                element={
                  <CMSLayout>
                    <CMSPartnersPage />
                  </CMSLayout>
                }
              />
              <Route
                path="/cms/media"
                element={
                  <CMSLayout>
                    <MediaPage />
                  </CMSLayout>
                }
              />
              <Route
                path="/cms/settings"
                element={
                  <CMSLayout>
                    <SettingsPage />
                  </CMSLayout>
                }
              />

              {/* Légal */}
              <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
              <Route
                path="/politique-confidentialite"
                element={<PolitiqueConfidentialitePage />}
              />
              <Route path="/cgv" element={<CGVPage />} />

              {/* Page Manifeste */}
              <Route path="/manifeste" element={<ManifestPage />} />

              {/* ZÉNA — pages internes */}
              <Route path="/zena-page" element={<ZenaEntreprisePage />} />
              <Route path="/zena-family-page" element={<ZenaFamilyPage />} />

              {/* ZÉNA — page centrale / choix */}
              <Route path="/zena" element={<ZenaChoicePage />} />

              {/* QVT Box — sphères */}
              <Route path="/entreprise" element={<EntreprisePage />} />
              <Route path="/entreprise/rejoindre" element={<EntrepriseJoinPage />} />
              <Route path="/famille" element={<FamillePage />} />
              <Route path="/famille/creer" element={<FamilleCreatePage />} />
              <Route path="/famille/inviter" element={<FamilleInvitePage />} />
              <Route path="/famille/rejoindre" element={<FamilleJoinPage />} />
              <Route path="/famille/dashboard" element={<FamilleDashboardPage />} />
              <Route path="/choisir-sphere" element={<ChoisirSpherePage />} />
              <Route path="/choisir-ma-sphere" element={<ChoisirSpherePage />} />

              {/* Ancienne URL de Zena Family */}
              <Route path="/zena-family" element={<Navigate to="/zena-family-page" replace />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AppShellWithAuth>
      </BrowserRouter>
    </AppInitializer>
  </CartProvider>
);

export default App;
