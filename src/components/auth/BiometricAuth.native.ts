import * as LocalAuthentication from "expo-local-authentication";

// Check if device has biometric hardware
export const hasBiometricHardware = async (): Promise<boolean> => {
  try {
    return await LocalAuthentication.hasHardwareAsync();
  } catch (error) {
    console.error("Error checking biometric hardware:", error);
    return false;
  }
};

// Check if user has enrolled biometrics
export const isBiometricEnrolled = async (): Promise<boolean> => {
  try {
    const hasHardware = await hasBiometricHardware();
    if (!hasHardware) return false;

    return await LocalAuthentication.isEnrolledAsync();
  } catch (error) {
    console.error("Error checking biometric enrollment:", error);
    return false;
  }
};

// Get available biometric types
export const getBiometricTypes = async (): Promise<
  LocalAuthentication.AuthenticationType[]
> => {
  try {
    return await LocalAuthentication.supportedAuthenticationTypesAsync();
  } catch (error) {
    console.error("Error getting biometric types:", error);
    return [];
  }
};

// Authenticate with biometrics
export const authenticateWithBiometrics = async (
  promptMessage: string,
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const hasHardware = await hasBiometricHardware();
    if (!hasHardware) {
      return { success: false, error: "No biometric hardware available" };
    }

    const isEnrolled = await isBiometricEnrolled();
    if (!isEnrolled) {
      return { success: false, error: "No biometrics enrolled" };
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      disableDeviceFallback: false,
    });

    return { success: result.success };
  } catch (error) {
    console.error("Error authenticating with biometrics:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
