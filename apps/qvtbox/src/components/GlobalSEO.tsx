import { useEffect } from 'react';

const GlobalSEO = () => {
  useEffect(() => {
    // Méta tags globaux pour la sécurité et l'indexation
    const updateMeta = (name: string, content: string, property?: boolean) => {
      const attribute = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Configuration en fonction de l'environnement
    const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
    
    if (isDevelopment) {
      // Empêcher l'indexation en développement
      updateMeta('robots', 'noindex, nofollow, noarchive, nosnippet');
    } else {
      // Permettre l'indexation en production
      updateMeta('robots', 'index, follow');
    }

    // Méta tags de sécurité
    updateMeta('referrer', 'strict-origin-when-cross-origin');
    updateMeta('format-detection', 'telephone=no');
    
    // Méta tags Open Graph globaux
    updateMeta('og:site_name', 'QVT Box', true);
    updateMeta('og:locale', 'fr_FR', true);
    
    // Méta tags Twitter
    updateMeta('twitter:site', '@qvtbox');
    updateMeta('twitter:creator', '@qvtbox');

    // Viewport pour mobile
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      document.head.appendChild(viewport);
    }
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');

    // Préconnexions pour les performances
    const preconnectDomains = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'];
    preconnectDomains.forEach(domain => {
      if (!document.querySelector(`link[href="${domain}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        document.head.appendChild(link);
      }
    });

  }, []);

  return null;
};

export default GlobalSEO;