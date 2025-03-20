import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Vibration,
  Platform,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { useTranslation } from "../hooks/useTranslation";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface PINSetupProps {
  onComplete?: (pin: string) => void;
  onCancel?: () => void;
  minLength?: number;
}

const PINSetup: React.FC<PINSetupProps> = ({
  onComplete = () => {},
  onCancel = () => {},
  minLength = 4,
}) => {
  const { t } = useTranslation();
  const [pin, setPin] = useState<string>("");
  const [confirmPin, setConfirmPin] = useState<string>("");
  const [stage, setStage] = useState<"create" | "confirm">("create");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  // Animation values
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;

  // Handle number input
  const handleNumberPress = (num: number) => {
    if (success) return;

    if (stage === "create") {
      if (pin.length < 6) {
        setPin((prev) => prev + num.toString());
      }
    } else {
      if (confirmPin.length < 6) {
        setConfirmPin((prev) => prev + num.toString());
      }
    }
  };

  // Handle backspace
  const handleBackspace = () => {
    if (success) return;

    if (stage === "create") {
      setPin((prev) => prev.slice(0, -1));
    } else {
      setConfirmPin((prev) => prev.slice(0, -1));
    }
    setError("");
  };

  // Handle PIN creation
  const handlePinCreation = () => {
    // Check if PIN meets minimum length
    if (pin.length < minLength) {
      setError(t("auth.pin.min"));
      shakeAndVibrate();
      return;
    }

    // Move to confirmation stage
    setStage("confirm");
    setError("");
  };

  // Handle PIN confirmation
  const handlePinConfirmation = () => {
    if (pin === confirmPin) {
      // Success
      setSuccess(true);
      Animated.timing(successOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Notify parent component
      setTimeout(() => {
        onComplete(pin);
      }, 1500);
    } else {
      // PINs don't match
      setError(t("auth.pin.match"));
      setConfirmPin("");
      shakeAndVibrate();
    }
  };

  // Shake animation and vibration
  const shakeAndVibrate = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();

    if (Platform.OS === "ios" || Platform.OS === "android") {
      Vibration.vibrate(300);
    }
  };

  // Handle continue button press
  const handleContinue = () => {
    if (stage === "create") {
      if (pin.length >= minLength) {
        handlePinCreation();
      } else {
        setError(t("auth.pin.min"));
        shakeAndVibrate();
      }
    } else {
      if (confirmPin.length === pin.length) {
        handlePinConfirmation();
      } else {
        setError(t("auth.pin.match"));
        shakeAndVibrate();
      }
    }
  };

  // Render PIN dots
  const renderPinDots = () => {
    const currentPin = stage === "create" ? pin : confirmPin;
    const dots = [];
    for (let i = 0; i < 6; i++) {
      dots.push(
        <View
          key={i}
          style={[
            styles.pinDot,
            i < currentPin.length ? styles.pinDotFilled : null,
          ]}
        />,
      );
    }
    return dots;
  };

  // Render number pad
  const renderNumberPad = () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, "backspace"];
    return numbers.map((num, index) => {
      if (num === null) {
        return <View key={index} style={styles.numberButton} />;
      }

      if (num === "backspace") {
        const currentPin = stage === "create" ? pin : confirmPin;
        return (
          <TouchableOpacity
            key={index}
            style={styles.numberButton}
            onPress={handleBackspace}
            disabled={success || currentPin.length === 0}
          >
            <Icon name="backspace-outline" size={24} color="#333" />
          </TouchableOpacity>
        );
      }

      const currentPin = stage === "create" ? pin : confirmPin;
      return (
        <TouchableOpacity
          key={index}
          style={styles.numberButton}
          onPress={() => handleNumberPress(num as number)}
          disabled={success || currentPin.length >= 6}
        >
          <Text style={styles.numberText}>{num}</Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <Text style={styles.title}>{t("auth.pin.setup.title")}</Text>
        <Text style={styles.subtitle}>
          {stage === "create"
            ? t("auth.pin.setup.description")
            : t("auth.pin.setup.confirm")}
        </Text>
      </View>

      <Animated.View
        style={[
          styles.pinContainer,
          { transform: [{ translateX: shakeAnimation }] },
        ]}
      >
        <View style={styles.pinDotsContainer}>{renderPinDots()}</View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
      </Animated.View>

      <Animated.View
        style={[styles.successContainer, { opacity: successOpacity }]}
        pointerEvents={success ? "auto" : "none"}
      >
        <View style={styles.successIconContainer}>
          <Icon name="check-circle" size={60} color="#4caf50" />
        </View>
        <Text style={styles.successText}>{t("auth.pin.success")}</Text>
      </Animated.View>

      <View style={styles.numberPadContainer}>{renderNumberPad()}</View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          disabled={success}
        >
          <Text style={styles.cancelText}>{t("auth.pin.setup.cancel")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.continueButton,
            (stage === "create" && pin.length < minLength) ||
            (stage === "confirm" && confirmPin.length < minLength)
              ? styles.continueButtonDisabled
              : null,
          ]}
          onPress={handleContinue}
          disabled={
            success ||
            (stage === "create" && pin.length < minLength) ||
            (stage === "confirm" && confirmPin.length < minLength)
          }
        >
          <Text style={styles.continueText}>
            {stage === "create"
              ? t("auth.pin.setup.button")
              : t("auth.pin.setup.confirm")}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.securityNote}>{t("auth.pin.stored")}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
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
  pinContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  pinDotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    marginHorizontal: 8,
  },
  pinDotFilled: {
    backgroundColor: "#333",
  },
  errorContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  errorText: {
    color: "#e53935",
    fontSize: 14,
    fontWeight: "500",
  },
  numberPadContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
    maxWidth: 300,
    marginBottom: 20,
  },
  numberButton: {
    width: "33.3%",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  numberText: {
    fontSize: 28,
    fontWeight: "500",
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  cancelButton: {
    padding: 12,
  },
  cancelText: {
    color: "#666",
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: "#2196f3",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  continueButtonDisabled: {
    backgroundColor: "#bdbdbd",
  },
  continueText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  securityNote: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginBottom: 20,
  },
  successContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  successIconContainer: {
    backgroundColor: "white",
    borderRadius: 50,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 16,
  },
  successText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4caf50",
    marginTop: 16,
  },
});

export default PINSetup;
