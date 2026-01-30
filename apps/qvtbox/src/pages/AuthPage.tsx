import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/AuthForm';
import Navigation from '@/components/Navigation';

const AuthPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/profil');
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
        <Navigation />
        <div className="container mx-auto px-4 pt-20">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-20">
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Votre espace QVT Box
              </h1>
              <p className="text-muted-foreground">
                Connectez-vous pour accéder à votre tableau de bord
              </p>
            </div>
            
            <AuthForm onSuccess={() => navigate('/profil')} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
