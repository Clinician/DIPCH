import React, { useState, useEffect, useRef } from "react";
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
} from "react-native";
import { useTranslation } from "../hooks/useTranslation";

// Import icons from a React Native compatible icon library
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface PINEntryProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  correctPIN?: string;
  maxAttempts?: number;
  lockoutDuration?: number;
}

const PINEntry: React.FC<PINEntryProps> = ({
  onSuccess = () => {},
  onCancel = () => {},
  correctPIN = "123456", // This would typically come from secure storage
  maxAttempts = 5,
  lockoutDuration = 30, // seconds
}) => {
  const { t } = useTranslation();
  const [pin, setPin] = useState<string>("");
  const [attempts, setAttempts] = useState<number>(0);
  const [locked, setLocked] = useState<boolean>(false);
  const [lockTimer, setLockTimer] = useState<number>(lockoutDuration);
  const [error, setError] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  // Animation values
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;

  // Timer reference
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle PIN input
  const handleNumberPress = (num: number) => {
    if (locked || pin.length >= 6 || showSuccess) return;

    setPin((prev) => {
      const newPin = prev + num.toString();
      return newPin;
    });
  };

  // Handle backspace
  const handleBackspace = () => {
    if (locked || showSuccess) return;
    setPin((prev) => prev.slice(0, -1));
    setError("");
  };

  // Clear PIN
  const clearPin = () => {
    setPin("");
  };

  // Verify PIN
  useEffect(() => {
    if (pin.length === 6) {
      if (pin === correctPIN) {
        // Success animation
        setShowSuccess(true);
        Animated.timing(successOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();

        // Clear after animation
        setTimeout(() => {
          onSuccess();
        }, 1000);
      } else {
        // Wrong PIN
        setAttempts((prev) => prev + 1);
        setError(t("auth.pin.incorrect"));

        // Shake animation
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

        // Vibrate on error
        if (Platform.OS === "ios" || Platform.OS === "android") {
          Vibration.vibrate(300);
        }

        clearPin();
      }
    }
  }, [pin, correctPIN, onSuccess]);

  // Handle max attempts
  useEffect(() => {
    if (attempts >= maxAttempts) {
      setLocked(true);
      setLockTimer(lockoutDuration);

      // Start countdown
      timerRef.current = setInterval(() => {
        setLockTimer((prev) => {
          if (prev <= 1) {
            setLocked(false);
            setAttempts(0);
            clearInterval(timerRef.current as NodeJS.Timeout);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [attempts, maxAttempts, lockoutDuration]);

  // Render PIN dots
  const renderPinDots = () => {
    const dots = [];
    for (let i = 0; i < 6; i++) {
      dots.push(
        <View
          key={i}
          style={[styles.pinDot, i < pin.length ? styles.pinDotFilled : null]}
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
        return (
          <TouchableOpacity
            key={index}
            style={styles.numberButton}
            onPress={handleBackspace}
            disabled={locked || pin.length === 0}
          >
            <Icon name="backspace-outline" size={24} color="#333" />
          </TouchableOpacity>
        );
      }

      return (
        <TouchableOpacity
          key={index}
          style={styles.numberButton}
          onPress={() => handleNumberPress(num as number)}
          disabled={locked || pin.length >= 6}
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
        <Text style={styles.title}>{t("auth.pin.entry.title")}</Text>
        <Text style={styles.subtitle}>{t("auth.pin.enter.description")}</Text>
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
            {attempts > 0 && attempts < maxAttempts && (
              <Text style={styles.attemptsText}>
                {maxAttempts - attempts} {t("auth.pin.attempts")}
              </Text>
            )}
          </View>
        ) : null}

        {locked ? (
          <View style={styles.lockedContainer}>
            <Icon name="lock" size={24} color="#e53935" />
            <Text style={styles.lockedText}>
              {t("auth.pin.locked.message")}
            </Text>
            <Text style={styles.timerText}>
              {t("auth.pin.locked.timer").replace(
                "{seconds}",
                lockTimer.toString(),
              )}
            </Text>
          </View>
        ) : null}
      </Animated.View>

      <Animated.View
        style={[styles.successContainer, { opacity: successOpacity }]}
        pointerEvents={showSuccess ? "auto" : "none"}
      >
        <View style={styles.successIconContainer}>
          <Icon name="check-circle" size={60} color="#4caf50" />
        </View>
      </Animated.View>

      <View style={styles.numberPadContainer}>{renderNumberPad()}</View>

      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.cancelText}>{t("auth.pin.entry.forgot")}</Text>
      </TouchableOpacity>

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
  attemptsText: {
    color: "#666",
    fontSize: 12,
    marginTop: 4,
  },
  lockedContainer: {
    alignItems: "center",
    backgroundColor: "#ffebee",
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    width: "100%",
  },
  lockedText: {
    color: "#e53935",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  timerText: {
    color: "#e53935",
    fontSize: 14,
    marginTop: 4,
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
  cancelButton: {
    padding: 12,
    marginBottom: 10,
  },
  cancelText: {
    color: "#2196f3",
    fontSize: 16,
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
  },
});

export default PINEntry;
