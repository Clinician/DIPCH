import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";

// Initialize Capacitor plugins when running as a native app
export const initCapacitor = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      // Configure status bar
      if (Capacitor.getPlatform() === "ios") {
        StatusBar.setStyle({ style: Style.Light });
      }

      // Hide splash screen with fade
      await SplashScreen.hide({
        fadeOutDuration: 500,
      });

      console.log("Capacitor initialized successfully");
    } catch (error) {
      console.error("Error initializing Capacitor:", error);
    }
  } else {
    console.log("Running in web environment, skipping native initialization");
  }
};

// Check if running on a native platform
export const isNative = (): boolean => {
  return Capacitor.isNativePlatform();
};

// Check if running on iOS
export const isIOS = (): boolean => {
  return Capacitor.getPlatform() === "ios";
};

// Get device info
export const getDeviceInfo = () => {
  return {
    platform: Capacitor.getPlatform(),
    isNative: Capacitor.isNativePlatform(),
    isIOS: Capacitor.getPlatform() === "ios",
  };
};
