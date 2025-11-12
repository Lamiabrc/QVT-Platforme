import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

export async function shareContent(title: string, text: string, url?: string) {
  try {
    if (Capacitor.isNativePlatform()) {
      await Share.share({
        title,
        text,
        url,
        dialogTitle: 'Partager avec...',
      });
    } else {
      // Fallback Web Share API
      if (navigator.share) {
        await navigator.share({ title, text, url });
      } else {
        console.log('Share not supported');
      }
    }
  } catch (error) {
    console.error('Error sharing:', error);
  }
}
