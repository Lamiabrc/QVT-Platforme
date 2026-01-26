// capacitor.config.ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // Utilise ton domaine en reverse-DNS (ne pas laisser l'ID Lovable)
  appId: 'com.qvtbox.app',
  appName: 'QVT Box',

  // Les fichiers web packagés par `npm run build`
  webDir: 'dist',

  // En production on charge les assets locaux (offline ok)
  // => surtout PAS de server.url ici
  server: {
    androidScheme: 'https'
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#8B5CF6',
      showSpinner: false
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
};

export default config;
