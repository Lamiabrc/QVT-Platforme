import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const DemoMode = () => {
  const isDemoMode = process.env.NODE_ENV === 'development' || !process.env.STRIPE_PUBLISHABLE_KEY;

  if (!isDemoMode) return null;

  return (
    <Alert className="mb-6 border-orange-200 bg-orange-50 text-orange-800">
      <Info className="h-4 w-4" />
      <AlertDescription>
        <strong>Mode Démonstration :</strong> Les paiements sont actuellement désactivés pour des raisons de sécurité. 
        Vous pouvez explorer toutes les fonctionnalités du site sans effectuer de vrais achats.
      </AlertDescription>
    </Alert>
  );
};

export default DemoMode;