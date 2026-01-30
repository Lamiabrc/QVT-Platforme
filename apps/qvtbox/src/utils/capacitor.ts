import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";

export const isNative = Capacitor.isNativePlatform();

export const openExternal = async (url: string) => {
  if (isNative) {
    await Browser.open({ url });
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
};
