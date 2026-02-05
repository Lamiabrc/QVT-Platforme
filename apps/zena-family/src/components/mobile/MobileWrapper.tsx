import { useEffect, ReactNode } from 'react';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';
import { Capacitor } from '@capacitor/core';

interface MobileWrapperProps {
  children: ReactNode;
}

export function MobileWrapper({ children }: MobileWrapperProps) {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    // Configure Status Bar
    const setupStatusBar = async () => {
      try {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#1A0B2E' });
      } catch (error) {
        console.error('Error setting status bar:', error);
      }
    };
    setupStatusBar();

    let backButtonListener: any;
    let appStateListener: any;
    let keyboardWillShow: any;
    let keyboardWillHide: any;

    const setupListeners = async () => {
      // Handle Android back button
      backButtonListener = await CapApp.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
          CapApp.exitApp();
        } else {
          window.history.back();
        }
      });

      // Handle App State Changes
      appStateListener = await CapApp.addListener('appStateChange', ({ isActive }) => {
        console.log('App state changed. Is active:', isActive);
      });

      // Handle Keyboard
      keyboardWillShow = await Keyboard.addListener('keyboardWillShow', (info) => {
        document.body.style.paddingBottom = `${info.keyboardHeight}px`;
      });

      keyboardWillHide = await Keyboard.addListener('keyboardWillHide', () => {
        document.body.style.paddingBottom = '0px';
      });
    };

    setupListeners();

    return () => {
      backButtonListener?.remove();
      appStateListener?.remove();
      keyboardWillShow?.remove();
      keyboardWillHide?.remove();
    };
  }, []);

  return <>{children}</>;
}
