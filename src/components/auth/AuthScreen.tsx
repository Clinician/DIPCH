import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useLanguage } from "../../context/LanguageContext";
import PINEntry from "./PINEntry";
import PINSetup from "./PINSetup";
import { hasPIN, verifyPIN } from "./SecureStorage";
import {
  hasBiometricHardware,
  authenticateWithBiometrics,
} from "./BiometricAuth";

interface AuthScreenProps {
  onAuthenticated?: () => void;
  isFirstTimeUser?: boolean;
}

const AuthScreen: React.FC<AuthScreenProps> = ({
  onAuthenticated = () => {},
  isFirstTimeUser = false,
}) => {
  const { t } = useLanguage();
  const [isFirstTime, setIsFirstTime] = useState<boolean>(isFirstTimeUser);
  const [authMethod, setAuthMethod] = useState<"pin" | "faceid">("pin");
  const [isPINSetupComplete, setIsPINSetupComplete] = useState<boolean>(false);
  const [isFaceIDAvailable, setIsFaceIDAvailable] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const [storedPIN, setStoredPIN] = useState<string>("000000"); // Default PIN

  // Check if Face ID is available and load stored PIN
  useEffect(() => {
    const checkBiometrics = async () => {
      const hasHardware = await hasBiometricHardware();
      setIsFaceIDAvailable(hasHardware);
    };

    const checkPIN = async () => {
      const hasPin = await hasPIN();
      setIsPINSetupComplete(hasPin);
      if (hasPin) {
        const pin = await getPIN();
        if (pin) setStoredPIN(pin);
      }
    };

    checkBiometrics();
    checkPIN();
  }, []);

  // Simulate getPIN function for the web version
  const getPIN = async () => {
    return localStorage.getItem("userPIN") || "000000";
  };

  const handlePINSetupComplete = (pin: string) => {
    // Store the PIN (in a real app, this would be done securely)
    localStorage.setItem("userPIN", pin);
    setStoredPIN(pin);
    console.log("PIN setup complete:", pin);
    setIsPINSetupComplete(true);
    setIsFirstTime(false);
  };

  const handlePINSuccess = () => {
    onAuthenticated();
  };

  const handleFaceIDAuth = async () => {
    setIsAuthenticating(true);
    setAuthError("");

    try {
      const result = await authenticateWithBiometrics(
        t("auth.faceid.description"),
      );
      if (result.success) {
        onAuthenticated();
      } else {
        setAuthError(result.error || "Authentication failed");
      }
    } catch (error) {
      setAuthError("Authentication error");
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Render first-time user setup
  if (isFirstTime || !isPINSetupComplete) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <PINSetup
          onComplete={handlePINSetupComplete}
          onCancel={() => setIsFirstTime(false)}
          onReturnToSettings={() => setIsFirstTime(false)}
        />
      </SafeAreaView>
    );
  }

  // Render PIN entry
  if (authMethod === "pin") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <PINEntry onSuccess={handlePINSuccess} correctPIN={storedPIN} />
      </SafeAreaView>
    );
  }

  // Render Face ID authentication
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.faceIdContainer}>
        <Text style={styles.title}>{t("auth.faceid.title")}</Text>
        <Text style={styles.subtitle}>{t("auth.faceid.description")}</Text>

        <TouchableOpacity
          style={styles.faceIdButton}
          onPress={handleFaceIDAuth}
          disabled={isAuthenticating}
        >
          <Text style={styles.faceIdButtonText}>
            {isAuthenticating
              ? t("auth.faceid.authenticating")
              : t("auth.faceid.button")}
          </Text>
        </TouchableOpacity>

        {authError ? <Text style={styles.errorText}>{authError}</Text> : null}

        <TouchableOpacity
          style={styles.switchMethodButton}
          onPress={() => setAuthMethod("pin")}
        >
          <Text style={styles.switchMethodText}>{t("auth.pin.title")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  faceIdContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  faceIdButton: {
    backgroundColor: "#2196f3",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  faceIdButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  errorText: {
    color: "#e53935",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 16,
  },
  switchMethodButton: {
    marginTop: 40,
    padding: 12,
  },
  switchMethodText: {
    color: "#2196f3",
    fontSize: 16,
  },
});

export default AuthScreen;
