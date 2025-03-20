import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useLanguage } from "../../context/LanguageContext";

interface ActionButtonsProps {
  onScanQR?: () => void;
  onViewProcedures?: () => void;
  onManualEntry?: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onScanQR = () => console.log("Scan QR clicked"),
  onViewProcedures = () => console.log("View Procedures clicked"),
  onManualEntry = () => console.log("Manual Entry clicked"),
}) => {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card} onPress={onScanQR}>
        <View style={[styles.iconContainer, styles.blueIcon]}>
          <Text style={styles.icon}>📷</Text>
        </View>
        <Text style={styles.title}>{t("actions.scanQR.title")}</Text>
        <Text style={styles.description}>
          {t("actions.scanQR.description")}
        </Text>
        <TouchableOpacity
          style={[styles.button, styles.blueButton]}
          onPress={onScanQR}
        >
          <Text style={styles.buttonText}>{t("actions.scanQR.button")}</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={onViewProcedures}>
        <View style={[styles.iconContainer, styles.purpleIcon]}>
          <Text style={styles.icon}>📋</Text>
        </View>
        <Text style={styles.title}>{t("actions.viewProcedures.title")}</Text>
        <Text style={styles.description}>
          {t("actions.viewProcedures.description")}
        </Text>
        <TouchableOpacity
          style={[styles.button, styles.purpleButton]}
          onPress={onViewProcedures}
        >
          <Text style={styles.buttonText}>
            {t("actions.viewProcedures.button")}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={onManualEntry}>
        <View style={[styles.iconContainer, styles.greenIcon]}>
          <Text style={styles.icon}>➕</Text>
        </View>
        <Text style={styles.title}>{t("actions.manualEntry.title")}</Text>
        <Text style={styles.description}>
          {t("actions.manualEntry.description")}
        </Text>
        <TouchableOpacity
          style={[styles.button, styles.greenButton]}
          onPress={onManualEntry}
        >
          <Text style={styles.buttonText}>
            {t("actions.manualEntry.button")}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  blueIcon: {
    backgroundColor: "#e3f2fd",
  },
  purpleIcon: {
    backgroundColor: "#f3e5f5",
  },
  greenIcon: {
    backgroundColor: "#e8f5e9",
  },
  icon: {
    fontSize: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  blueButton: {
    backgroundColor: "#2196f3",
  },
  purpleButton: {
    backgroundColor: "#9c27b0",
  },
  greenButton: {
    backgroundColor: "#4caf50",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 16,
  },
});

export default ActionButtons;
