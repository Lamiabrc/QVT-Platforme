import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const SafeAutoPromotion: React.FC = () => {
  const { user, loading } = useAuth();
  const [isPromoting, setIsPromoting] = useState(false);

  useEffect(() => {
    const checkAndPromoteFirstAdmin = async () => {
      if (!user || isPromoting || loading) return;

      try {
        setIsPromoting(true);

        // Vérifier s'il existe déjà un admin
        const { data: existingAdmins, error: adminError } = await supabase
          .from('user_roles')
          .select('*')
          .eq('role', 'admin')
          .limit(1);

        if (adminError) throw adminError;

        // S'il n'y a pas d'admin, promouvoir l'utilisateur actuel
        if (existingAdmins.length === 0) {
          const { error: insertError } = await supabase
            .from('user_roles')
            .insert({
              user_id: user.id,
              role: 'admin'
            });

          if (insertError) throw insertError;

          // Premier administrateur promu avec succès
        }
      } catch (error) {
        console.error('Erreur lors de l\'auto-promotion:', error);
      } finally {
        setIsPromoting(false);
      }
    };

    // Délai pour s'assurer que tous les contextes sont complètement initialisés
    const timeout = setTimeout(() => {
      if (user && !loading) {
        checkAndPromoteFirstAdmin();
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [user, loading, isPromoting]);

  return null; // Ce composant ne rend rien
};

export default SafeAutoPromotion;