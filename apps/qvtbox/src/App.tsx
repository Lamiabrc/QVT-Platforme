import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { CartProvider } from "./hooks/useCart";
import AppInitializer from "./components/AppInitializer";
import GlobalSEO from "./components/GlobalSEO";
import { useAuth } from "@/hooks/useAuth";

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
const PolitiqueConfidentialitePage = lazy(() => import("./pages/PolitiqueConfidentialitePage"));
const CGVPage = lazy(() => import("./pages/CGVPage"));
const MobilePage = lazy(() => import("./pages/MobilePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ManifestPage = lazy(() => import("./pages/ManifestPage"));
const EngagementsPage = lazy(() => import("./pages/EngagementsPage"));

const ZenaChoicePage = lazy(() => import("./pages/ZenaChoicePage"));
const EntreprisePage = lazy(() => import("./pages/EntreprisePage"));
const EntrepriseJoinPage = lazy(() => import("./pages/EntrepriseJoinPage"));
const FamillePage = lazy(() => import("./pages/FamillePage"));
const LuciolesPage = lazy(() => import("./pages/LuciolesPage"));
const DevenirLuciolePage = lazy(() => import("./pages/DevenirLuciolePage"));
const FamilySpacePage = lazy(() => import("./pages/FamilySpacePage"));
const FamilleCreatePage = lazy(() => import("./pages/FamilleCreatePage"));
const FamilleInvitePage = lazy(() => import("./pages/FamilleInvitePage"));
const FamilleJoinPage = lazy(() => import("./pages/FamilleJoinPage"));
const FamilleDashboardPage = lazy(() => import("./pages/FamilleDashboardPage"));
const MentorDashboardPage = lazy(() => import("./pages/MentorDashboardPage"));
const SupervisionPage = lazy(() => import("./pages/SupervisionPage"));
const ChoisirSpherePage = lazy(() => import("./pages/ChoisirSpherePage"));
const ProfileRedirectPage = lazy(() => import("./pages/ProfileRedirectPage"));
const SecuritePage = lazy(() => import("./pages/SecuritePage"));

function Fallback() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center text-sm text-foreground/60">
      Chargement...
    </div>
  );
}

const RequireAuth = ({ children }: { children: React.ReactElement }) => {
  const location = useLocation();
  const auth = useAuth() as any;

  const isAuthenticated = Boolean(auth?.isAuthenticated);
  const isLoading = Boolean(auth?.isLoading ?? auth?.loading);

  if (isLoading) return <Fallback />;

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

const RequireAdmin = ({ children }: { children: React.ReactElement }) => {
  const location = useLocation();
  const auth = useAuth() as any;

  const isLoading = Boolean(auth?.isLoading ?? auth?.loading);
  const isAuthenticated = Boolean(auth?.isAuthenticated);

  if (isLoading) return <Fallback />;

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />;
  }

  const email = String(auth?.user?.email ?? "").toLowerCase();
  const role =
    auth?.user?.role ??
    auth?.user?.app_metadata?.role ??
    auth?.user?.user_metadata?.role;

  const ADMIN_EMAILS = [
    "lamia.brechet@outlook.fr",
    "sabullelam@gmail.com",
    "contact@qvtbox.com",
  ];

  const isAdmin = ADMIN_EMAILS.includes(email) || role === "admin";

  if (!isAdmin) {
    return <Navigate to="/profil" replace />;
  }

  return children;
};

const App = () => (
  <CartProvider>
    <AppInitializer>
      <GlobalSEO />
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Suspense fallback={<Fallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/box" element={<BoxPage />} />
            <Route path="/saas" element={<ProfessionalSaasPage />} />
            <Route path="/boutique" element={<BoutiquePage />} />
            <Route path="/mobile" element={<MobilePage />} />
            <Route path="/boutique/produit/:slug" element={<ProductDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/nous-contacter" element={<Navigate to="/contact" replace />} />
            <Route path="/simulateur" element={<SimulateurPage />} />
            <Route path="/engagements" element={<EngagementsPage />} />

            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
            <Route path="/checkout/cancel" element={<CheckoutCancelPage />} />

            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/auth/logout" element={<LogoutPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <DashboardPage />
                </RequireAuth>
              }
            />
            <Route
              path="/entreprise/dashboard"
              element={
                <RequireAuth>
                  <DashboardPage />
                </RequireAuth>
              }
            />
            <Route
              path="/mood"
              element={
                <RequireAuth>
                  <MoodDashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/user-dashboard"
              element={
                <RequireAuth>
                  <UserDashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/profil"
              element={
                <RequireAuth>
                  <ProfileRedirectPage />
                </RequireAuth>
              }
            />

            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminPage />
                </RequireAdmin>
              }
            />

            <Route
              path="/cms"
              element={
                <RequireAdmin>
                  <CMSLayout>
                    <CMSIndexPage />
                  </CMSLayout>
                </RequireAdmin>
              }
            />
            <Route
              path="/cms/products"
              element={
                <RequireAdmin>
                  <CMSLayout>
                    <ProductsPage />
                  </CMSLayout>
                </RequireAdmin>
              }
            />
            <Route
              path="/cms/products/new"
              element={
                <RequireAdmin>
                  <CMSLayout>
                    <ProductFormPage />
                  </CMSLayout>
                </RequireAdmin>
              }
            />
            <Route
              path="/cms/products/edit/:id"
              element={
                <RequireAdmin>
                  <CMSLayout>
                    <ProductFormPage />
                  </CMSLayout>
                </RequireAdmin>
              }
            />
            <Route
              path="/cms/images"
              element={
                <RequireAdmin>
                  <CMSLayout>
                    <ImagesPage />
                  </CMSLayout>
                </RequireAdmin>
              }
            />
            <Route
              path="/cms/partners/applications"
              element={
                <RequireAdmin>
                  <CMSLayout>
                    <CMSPartnersPage />
                  </CMSLayout>
                </RequireAdmin>
              }
            />
            <Route
              path="/cms/partners/approved"
              element={
                <RequireAdmin>
                  <CMSLayout>
                    <CMSPartnersPage />
                  </CMSLayout>
                </RequireAdmin>
              }
            />
            <Route
              path="/cms/media"
              element={
                <RequireAdmin>
                  <CMSLayout>
                    <MediaPage />
                  </CMSLayout>
                </RequireAdmin>
              }
            />
            <Route
              path="/cms/settings"
              element={
                <RequireAdmin>
                  <CMSLayout>
                    <SettingsPage />
                  </CMSLayout>
                </RequireAdmin>
              }
            />

            <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
            <Route path="/politique-confidentialite" element={<PolitiqueConfidentialitePage />} />
            <Route path="/cgv" element={<CGVPage />} />
            <Route path="/manifeste" element={<ManifestPage />} />

            <Route path="/zena" element={<ZenaChoicePage />} />
            <Route path="/zena-page" element={<Navigate to="/zena" replace />} />
            <Route path="/zena-family-page" element={<Navigate to="/famille" replace />} />
            <Route path="/zena-family" element={<Navigate to="/famille" replace />} />

            <Route path="/entreprise" element={<EntreprisePage />} />
            <Route path="/entreprise/rejoindre" element={<EntrepriseJoinPage />} />
            <Route path="/famille" element={<FamillePage />} />
            <Route path="/lucioles" element={<LuciolesPage />} />
            <Route path="/devenir-luciole" element={<DevenirLuciolePage />} />
            <Route path="/famille/espace" element={<FamilySpacePage />} />
            <Route path="/famille/creer" element={<FamilleCreatePage />} />
            <Route path="/famille/inviter" element={<FamilleInvitePage />} />
            <Route path="/famille/rejoindre" element={<FamilleJoinPage />} />
            <Route path="/famille/mentor/apply" element={<Navigate to="/devenir-luciole" replace />} />
            <Route path="/securite" element={<SecuritePage />} />
            <Route path="/choisir-sphere" element={<ChoisirSpherePage />} />
            <Route path="/choisir-ma-sphere" element={<ChoisirSpherePage />} />

            <Route
              path="/mentor"
              element={
                <RequireAuth>
                  <MentorDashboardPage />
                </RequireAuth>
              }
            />
            <Route
              path="/supervision"
              element={
                <RequireAuth>
                  <SupervisionPage />
                </RequireAuth>
              }
            />
            <Route
              path="/famille/dashboard"
              element={
                <RequireAuth>
                  <FamilleDashboardPage />
                </RequireAuth>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppInitializer>
  </CartProvider>
);

export default App;
