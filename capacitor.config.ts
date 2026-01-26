import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.qvtbox.zena.family',
  appName: 'ZENA Family',
  webDir: 'dist',
  
  server: {
    androidScheme: 'https',
    iosScheme: 'capacitor',
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      launchFadeOutDuration: 300,
      backgroundColor: '#1A0B2E', // zena-night
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      iosSpinnerStyle: 'small',
      spinnerColor: '#4ECDC4', // zena-turquoise
    },
    
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1A0B2E',
    },

    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },

    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true,
    },
  },

  ios: {
    contentInset: 'automatic',
    scheme: 'zena-family',
  },

  android: {
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
    },
  },
};

export default config;
