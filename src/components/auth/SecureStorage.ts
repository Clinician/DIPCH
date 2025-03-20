// This is a web-compatible version of SecureStorage
// For a real app, you would use a more secure storage solution

// Key for storing the PIN
const PIN_KEY = "secure_implant_pass_pin";

// Save PIN securely
export const savePIN = async (pin: string): Promise<boolean> => {
  try {
    localStorage.setItem(PIN_KEY, pin);
    return true;
  } catch (error) {
    console.error("Error saving PIN:", error);
    return false;
  }
};

// Get PIN
export const getPIN = async (): Promise<string | null> => {
  try {
    return localStorage.getItem(PIN_KEY);
  } catch (error) {
    console.error("Error retrieving PIN:", error);
    return null;
  }
};

// Check if PIN exists
export const hasPIN = async (): Promise<boolean> => {
  try {
    const pin = localStorage.getItem(PIN_KEY);
    return !!pin;
  } catch (error) {
    console.error("Error checking PIN:", error);
    return false;
  }
};

// Delete PIN
export const deletePIN = async (): Promise<boolean> => {
  try {
    localStorage.removeItem(PIN_KEY);
    return true;
  } catch (error) {
    console.error("Error deleting PIN:", error);
    return false;
  }
};

// Verify PIN
export const verifyPIN = async (inputPin: string): Promise<boolean> => {
  try {
    const storedPin = localStorage.getItem(PIN_KEY);
    return storedPin === inputPin;
  } catch (error) {
    console.error("Error verifying PIN:", error);
    return false;
  }
};
