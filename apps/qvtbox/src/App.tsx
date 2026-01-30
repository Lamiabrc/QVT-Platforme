// src/App.tsx
import React, { Suspense, lazy } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
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

/**
 * Pages protégées (auth obligatoire)
 * - évite les écrans vides / coquilles quand la donnée dépend d'une session
 */
const RequireAuth = ({ children }: { children: React.ReactElement }) => {
  const location = useLocation();
  const auth = useAuth() as any;

  const isAuthenticated = Boolean(auth?.isAuthenticated);
  const isLoading = Boolean(auth?.isLoading ?? auth?.loading);

  if (isLoading) return <Fallback />;

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
};

/**
 * Admin/CMS (protection simple, à renforcer ensuite via rôles/RLS Supabase)
 */
const RequireAdmin = ({ children }: { children: React.ReactElement }) => {
  const location = useLocation();
  const auth = useAuth() as any;

  const isLoading = Boolean(auth?.isLoading ?? auth?.loading);
  const isAuthenticated = Boolean(auth?.isAuthenticated);

  if (isLoading) return <Fallback />;

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: location.pathname }}
      />
    );
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

const AppShellWithAuth = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const auth = useAuth() as any;

  const user = auth?.user;
  const isAuthenticated = Boolean(auth?.isAuthenticated);
  const signOut = auth?.signOut;

  const handleSignOut = async () => {
    try {
      // tentative de déconnexion "propre"
      await signOut?.();
    } catch (e) {
      // en cas de bug silencieux côté auth, on force la route logout
      console.error("Sign out failed:", e);
    } finally {
      // route dédiée (doit effectuer signOut + clear state + redirect)
      navigate("/auth/logout", { replace: true });
    }
  };

  return (
    <AppShell
      universe={universe}
      account={{
        isAuthenticated,
        accountHref: isAuthenticated && user ? "/profil" : "/auth/login",
        onSignOut: handleSignOut,
        // au cas où AppShell préfère une navigation plutôt qu’un callback
        signOutHref: "/auth/logout",
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
              {/* Domaine principal (public) */}
              <Route path="/" element={<Index />} />
              <Route path="/box" element={<BoxPage />} />
              <Route path="/saas" element={<ProfessionalSaasPage />} />
              <Route path="/boutique" element={<BoutiquePage />} />
              <Route path="/mobile" element={<MobilePage />} />
              <Route
                path="/boutique/produit/:slug"
                element={<ProductDetailPage />}
              />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/simulateur" element={<SimulateurPage />} />

              {/* Engagements (public) */}
              <Route path="/engagements" element={<EngagementsPage />} />

              {/* Paiement (public) */}
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
              <Route path="/checkout/cancel" element={<CheckoutCancelPage />} />

              {/* Auth (public) */}
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="/auth/logout" element={<LogoutPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* Dashboards (protégé) */}
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

              {/* Admin (protégé admin) */}
              <Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <AdminPage />
                  </RequireAdmin>
                }
              />

              {/* CMS (protégé admin) */}
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

              {/* Légal (public) */}
              <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
              <Route
                path="/politique-confidentialite"
                element={<PolitiqueConfidentialitePage />}
              />
              <Route path="/cgv" element={<CGVPage />} />

              {/* Page Manifeste (public) */}
              <Route path="/manifeste" element={<ManifestPage />} />

              {/* ZÉNA — pages internes (public pour l’instant) */}
              <Route path="/zena-page" element={<ZenaEntreprisePage />} />
              <Route path="/zena-family-page" element={<ZenaFamilyPage />} />
              <Route path="/zena" element={<ZenaChoicePage />} />

              {/* QVT Box — sphères (public sauf dashboard) */}
              <Route path="/entreprise" element={<EntreprisePage />} />
              <Route path="/entreprise/rejoindre" element={<EntrepriseJoinPage />} />
              <Route path="/famille" element={<FamillePage />} />
              <Route path="/famille/creer" element={<FamilleCreatePage />} />
              <Route path="/famille/inviter" element={<FamilleInvitePage />} />
              <Route path="/famille/rejoindre" element={<FamilleJoinPage />} />
              <Route
                path="/famille/dashboard"
                element={
                  <RequireAuth>
                    <FamilleDashboardPage />
                  </RequireAuth>
                }
              />
              <Route path="/choisir-sphere" element={<ChoisirSpherePage />} />
              <Route path="/choisir-ma-sphere" element={<ChoisirSpherePage />} />

              {/* Ancienne URL de Zena Family */}
              <Route
                path="/zena-family"
                element={<Navigate to="/zena-family-page" replace />}
              />

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
