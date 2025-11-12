import { PushNotifications, Token, ActionPerformed } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { supabase } from '@/integrations/supabase/client';

export async function registerPushNotifications(userId: string) {
  if (!Capacitor.isNativePlatform()) {
    console.log('Push notifications only available on native platforms');
    return;
  }

  try {
    // Request permissions
    const permResult = await PushNotifications.requestPermissions();
    
    if (permResult.receive === 'granted') {
      await PushNotifications.register();
      
      // Listener for token
      PushNotifications.addListener('registration', async (token: Token) => {
        console.log('Push registration success, token:', token.value);
        
        // Store token in Supabase
        const { error } = await supabase
          .from('profiles')
          .update({ 
            push_token: token.value,
            platform: Capacitor.getPlatform()
          })
          .eq('id', userId);
          
        if (error) {
          console.error('Error storing push token:', error);
        }
      });

      // Listener for errors
      PushNotifications.addListener('registrationError', (error: any) => {
        console.error('Error on registration:', error);
      });

      // Listener for notification received (app in foreground)
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push received:', notification);
        // Display local toast/notification
      });

      // Listener for notification clicked
      PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
        console.log('Push action performed:', notification);
        // Navigate to appropriate page based on notification data
      });
    } else {
      console.log('Push notification permission not granted');
    }
  } catch (error) {
    console.error('Error registering push notifications:', error);
  }
}

export async function unregisterPushNotifications(userId: string) {
  if (!Capacitor.isNativePlatform()) return;

  try {
    // Remove token from Supabase
    await supabase
      .from('profiles')
      .update({ push_token: null })
      .eq('id', userId);

    // Remove all listeners
    await PushNotifications.removeAllListeners();
  } catch (error) {
    console.error('Error unregistering push notifications:', error);
  }
}
