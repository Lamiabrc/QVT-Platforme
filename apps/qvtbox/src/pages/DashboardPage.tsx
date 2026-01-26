import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProfessionalDashboard from "@/components/ProfessionalDashboard";
import AuthGuard from "@/components/AuthGuard";

const DashboardPage = () => {
  return (
    <AuthGuard>
      <Navigation />
      <ProfessionalDashboard />
      <Footer />
    </AuthGuard>
  );
};

export default DashboardPage;