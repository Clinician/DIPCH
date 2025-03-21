import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { QrCode, X, Check, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "../ui/card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  isBluetoothAvailable,
  connectBluetoothScanner,
  disconnectBluetoothScanner,
  isBluetoothConnected,
  getConnectedDeviceName,
  useSampleBluetoothData,
} from "../../lib/bluetooth";

interface BluetoothScannerProps {
  onScanComplete?: (data: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  scannerType?: "article" | "lot";
}

const BluetoothScanner: React.FC<BluetoothScannerProps> = ({
  onScanComplete = () => {},
  isOpen = true,
  onClose = () => {},
  scannerType = "article",
}) => {
  const { t } = useLanguage();
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bluetoothAvailable, setBluetoothAvailable] = useState(false);

  // Auto-connect when component mounts or scanner type changes
  useEffect(() => {
    const available = isBluetoothAvailable();
    setBluetoothAvailable(available);

    if (available && isOpen) {
      // Always auto-connect when dialog opens if Bluetooth is available
      console.log("Auto-connecting scanner...");
      handleConnect();
    }

    // Clean up on unmount
    return () => {
      // Don't disconnect on unmount as the connection might be needed elsewhere
      // Only disconnect when explicitly requested
    };
  }, [isOpen, scannerType]);

  // Set up a listener for the scanned data
  useEffect(() => {
    // Define a custom event handler for scanner data
    const handleBluetoothDataEvent = (event: CustomEvent) => {
      if (event.detail && typeof event.detail === "string") {
        console.log("Custom event received with data:", event.detail);
        handleBluetoothData(event.detail);
      }
    };

    if (isOpen) {
      // Add event listener for custom scanner events
      window.addEventListener(
        "bluetooth-scanner-data",
        handleBluetoothDataEvent as EventListener,
      );

      // Clean up
      return () => {
        window.removeEventListener(
          "bluetooth-scanner-data",
          handleBluetoothDataEvent as EventListener,
        );
      };
    }
  }, [isOpen]); // Re-attach when isOpen changes

  // Handle Bluetooth data reception
  const handleBluetoothData = (data: string) => {
    console.log(`Received data from Bluetooth scanner: ${data}`);
    // Always update the data if the dialog is open, regardless of connected state
    if (isOpen) {
      setScannedData(data);
      setConnected(true); // Ensure connected state is set
    }
  };

  // Connect to Bluetooth scanner
  const handleConnect = async () => {
    if (connecting || connected) return;

    setConnecting(true);
    setError(null);

    try {
      const device = await connectBluetoothScanner(handleBluetoothData);
      if (device) {
        setConnected(true);
        setDeviceName("Connected Scanner");
      } else {
        setError(t("scanner.bluetooth.error"));
      }
    } catch (error) {
      console.error("Error in handleConnect:", error);
      setError(
        error instanceof Error ? error.message : t("scanner.bluetooth.error"),
      );
    } finally {
      setConnecting(false);
    }
  };

  // Disconnect from Bluetooth scanner
  const handleDisconnect = async () => {
    try {
      await disconnectBluetoothScanner();
      setConnected(false);
      setDeviceName(null);
      setScannedData(null);
    } catch (error) {
      console.error("Error disconnecting:", error);
      setError(
        error instanceof Error
          ? error.message
          : t("scanner.bluetooth.disconnected"),
      );
    }
  };

  // Handle confirmation of scanned data
  const handleConfirm = () => {
    if (scannedData) {
      console.log("Confirming scanned data:", scannedData);
      onScanComplete(scannedData);
      setScannedData(null); // Clear the scanned data to prepare for next scan
      onClose(); // Close the dialog and return to implant detail
    }
  };

  // Handle cancellation
  const handleCancel = () => {
    setScannedData(null);
    setError(null);
    onClose();
  };

  // Generate sample data for testing
  const useSampleData = () => {
    const sampleData = useSampleBluetoothData(
      scannerType === "article" ? "articleNumber" : "lotNumber",
    );
    setScannedData(sampleData);
  };

  // Reset for next scan
  const handleScanAgain = () => {
    setScannedData(null);
    // No need to reconnect, just clear the data and stay ready
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle>
            Scanner -{" "}
            {scannerType === "article"
              ? t("scanner.bluetooth.article.title")
              : t("scanner.bluetooth.lot.title")}
          </DialogTitle>
          <DialogDescription>
            {t("scanner.bluetooth.description")}
          </DialogDescription>
        </DialogHeader>

        {!bluetoothAvailable ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Bluetooth Not Available</AlertTitle>
            <AlertDescription>
              Web Bluetooth is not supported in this browser or device. Please
              use a compatible browser like Chrome on desktop or Android.
            </AlertDescription>
          </Alert>
        ) : !connected ? (
          <div className="flex flex-col items-center space-y-6 py-8">
            <div className="rounded-full bg-gray-100 p-6">
              <QrCode size={48} className="text-gray-600" />
            </div>

            {error ? (
              <Alert variant="destructive" className="max-w-md">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <p className="text-center text-gray-600 max-w-md">
                {t("scanner.bluetooth.waiting")}
              </p>
            )}

            <div className="flex space-x-4">
              <Button
                onClick={handleConnect}
                className="flex items-center"
                disabled={connecting}
              >
                {connecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Activating...
                  </>
                ) : (
                  <>
                    <QrCode className="mr-2 h-4 w-4" />
                    {t("scanner.bluetooth.connect")}
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={useSampleData}>
                {t("scanner.qr.sample")}
              </Button>
            </div>
          </div>
        ) : scannedData ? (
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle>Scanned Data</CardTitle>
              <CardDescription>
                Review the scanned{" "}
                {scannerType === "article" ? "ARTICLE" : "LOT"} number
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 rounded-md text-center">
                <p className="text-lg font-mono">{scannedData}</p>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <p>Connected to: {deviceName || "Unknown Device"}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleScanAgain}>
                <X className="mr-2 h-4 w-4" />
                {t("scanner.qr.cancel")}
              </Button>
              <Button onClick={handleConfirm}>
                <Check className="mr-2 h-4 w-4" />
                {t("scanner.bluetooth.submit")}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Ready to Scan</h3>
                <p className="text-sm text-gray-500">
                  Connected to: {deviceName || "Unknown Device"}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleDisconnect}>
                Disconnect
              </Button>
            </div>

            <div className="p-8 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center bg-gray-50">
              <QrCode size={32} className="text-blue-500 mb-2" />
              <p className="text-center text-gray-600 font-medium">
                Scan a {scannerType === "article" ? "ARTICLE" : "LOT"} number
                barcode
              </p>
              <p className="text-xs text-gray-400 mt-2">
                The scanned data will appear here automatically
              </p>
            </div>

            <div className="flex justify-center">
              <Button variant="outline" onClick={useSampleData}>
                {t("scanner.qr.sample")}
              </Button>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {t("scanner.bluetooth.cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BluetoothScanner;
