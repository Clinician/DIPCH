// Web fallback for BiometricAuth.native.ts

// Check if device has biometric hardware
export const hasBiometricHardware = async (): Promise<boolean> => {
  try {
    // In a web environment, we'll simulate no biometric hardware
    return false;
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

    // In a web environment, we'll simulate no biometric enrollment
    return false;
  } catch (error) {
    console.error("Error checking biometric enrollment:", error);
    return false;
  }
};

// Get available biometric types
export const getBiometricTypes = async (): Promise<string[]> => {
  try {
    // In a web environment, we'll return an empty array
    return [];
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

    // In a web environment, we'll simulate authentication failure
    return { success: false, error: "Not implemented in web environment" };
  } catch (error) {
    console.error("Error authenticating with biometrics:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
