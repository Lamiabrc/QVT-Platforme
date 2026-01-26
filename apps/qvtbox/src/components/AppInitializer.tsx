import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import SafeAutoPromotion from './SafeAutoPromotion';

interface AppInitializerProps {
  children: React.ReactNode;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const { loading } = useAuth();

  // S'assurer que tous les contextes sont chargés avant de rendre les enfants
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-gradient-bubble animate-pulse"></div>
      </div>
    );
  }

  return (
    <>
      <SafeAutoPromotion />
      {children}
    </>
  );
};

export default AppInitializer;