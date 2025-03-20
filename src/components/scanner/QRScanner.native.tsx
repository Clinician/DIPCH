import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { Camera } from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useLanguage } from "../../context/LanguageContext";
import { useProcedures } from "../../context/ProcedureContext";

interface QRScannerProps {
  navigation?: any;
}

const QRScanner: React.FC<QRScannerProps> = ({ navigation }) => {
  const { t } = useLanguage();
  const { addProcedure } = useProcedures();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(true);

  // Request camera permission
  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  // Handle barcode scan
  const handleBarCodeScanned = ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    if (!scanning) return;

    setScanned(true);
    setScanning(false);

    try {
      // Try to parse the QR code data as JSON
      const parsedData = JSON.parse(data);

      // Validate the data structure
      if (isValidProcedureData(parsedData)) {
        // Show confirmation dialog
        Alert.alert(t("scanner.success"), t("procedures.confirmImport"), [
          {
            text: t("common.cancel"),
            onPress: () => resetScanner(),
            style: "cancel",
          },
          {
            text: t("common.confirm"),
            onPress: () => importProcedure(parsedData),
          },
        ]);
      } else {
        Alert.alert(t("scanner.invalidCode"), t("scanner.invalidFormat"), [
          { text: t("common.ok"), onPress: () => resetScanner() },
        ]);
      }
    } catch (error) {
      Alert.alert(t("scanner.error"), t("scanner.invalidData"), [
        { text: t("common.ok"), onPress: () => resetScanner() },
      ]);
    }
  };

  // Reset scanner
  const resetScanner = () => {
    setScanned(false);
    setScanning(true);
  };

  // Validate procedure data structure
  const isValidProcedureData = (data: any): boolean => {
    return (
      data &&
      typeof data === "object" &&
      typeof data.date === "string" &&
      typeof data.hospital === "string" &&
      typeof data.surgeon === "string" &&
      typeof data.type === "string" &&
      Array.isArray(data.implants)
    );
  };

  // Import procedure
  const importProcedure = (data: any) => {
    try {
      // Add the procedure to the context
      const newProcedure = addProcedure({
        date: data.date,
        hospital: data.hospital,
        surgeon: data.surgeon,
        type: data.type,
        notes: data.notes || "",
        implants: data.implants || [],
      });

      // Show success message
      Alert.alert(t("common.success"), t("procedures.importSuccess"), [
        {
          text: t("common.viewNow"),
          onPress: () =>
            navigation.navigate("ProcedureDetail", { id: newProcedure.id }),
        },
        {
          text: t("common.done"),
          onPress: () => navigation.goBack(),
          style: "cancel",
        },
      ]);
    } catch (error) {
      Alert.alert(t("common.error"), t("procedures.importError"), [
        { text: t("common.ok"), onPress: () => navigation.goBack() },
      ]);
    }
  };

  // Render based on permission status
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{t("common.loading")}</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{t("scanner.permission")}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>{t("common.back")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t("scanner.title")}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          type={Camera.Constants.Type.back}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          barCodeScannerSettings={{
            barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
          }}
        >
          <View style={styles.overlay}>
            <View style={styles.unfilled} />
            <View style={styles.row}>
              <View style={styles.unfilled} />
              <View style={styles.scanner} />
              <View style={styles.unfilled} />
            </View>
            <View style={styles.unfilled} />
          </View>
        </Camera>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionsText}>{t("scanner.instructions")}</Text>
      </View>

      {scanned && (
        <TouchableOpacity style={styles.scanAgainButton} onPress={resetScanner}>
          <Text style={styles.scanAgainButtonText}>
            {t("scanner.scanAgain")}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#000",
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  placeholder: {
    width: 40,
  },
  cameraContainer: {
    flex: 1,
    overflow: "hidden",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  unfilled: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  row: {
    flexDirection: "row",
    height: 250,
  },
  scanner: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "transparent",
  },
  instructions: {
    padding: 20,
    backgroundColor: "#000",
  },
  instructionsText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  scanAgainButton: {
    backgroundColor: "#2196f3",
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  scanAgainButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    margin: 20,
  },
  button: {
    backgroundColor: "#2196f3",
    padding: 15,
    borderRadius: 8,
    margin: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default QRScanner;
