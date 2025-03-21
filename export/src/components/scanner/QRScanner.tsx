import React, { useState, useRef, useEffect } from "react";
import { Camera, X, Check, AlertCircle, QrCode, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { useLanguage } from "../../context/LanguageContext";
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
import {
  startQRScanner,
  stopQRScanner,
  resetQRScanner,
} from "../../lib/camera";
import {
  parseProcedureQRCode,
  generateSampleProcedureQRCode,
} from "../../lib/qrcode";
import { ProcedureData } from "../../context/ProcedureContext";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface QRScannerProps {
  onScanComplete?: (data: ProcedureData) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({
  onScanComplete = () => {},
  isOpen = true,
  onClose = () => {},
}) => {
  const { t } = useLanguage();
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<ProcedureData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scannerControls, setScannerControls] = useState<any>(null);

  // Start real QR code scanning
  const startScanning = async () => {
    setScanning(true);
    setError(null);

    try {
      if (videoRef.current) {
        // Add a small delay to ensure DOM is ready
        setTimeout(async () => {
          try {
            const controls = await startQRScanner(
              "qr-video",
              handleQRCodeResult,
              handleScanError,
            );
            setScannerControls(controls);
          } catch (innerError) {
            console.error("Failed to start scanner after delay:", innerError);
            setError(t("scanner.qr.error.camera"));
            setScanning(false);
          }
        }, 500);
      }
    } catch (error) {
      console.error("Failed to start scanner:", error);
      setError(t("scanner.qr.error.camera"));
      setScanning(false);
    }
  };

  // Handle QR code scan result
  const handleQRCodeResult = (result: string) => {
    try {
      const parsedData = parseProcedureQRCode(result);

      if (parsedData) {
        // If it's an array, take the first procedure
        if (Array.isArray(parsedData)) {
          setScannedData(parsedData[0]);
        } else {
          setScannedData(parsedData);
        }

        // Stop scanning once we have a result
        if (scannerControls) {
          stopQRScanner(scannerControls);
          setScannerControls(null);
        }

        setScanning(false);
      } else {
        setError(t("scanner.qr.error.invalid"));
        setScanning(false);
      }
    } catch (error) {
      console.error("Error parsing QR code:", error);
      setError(t("scanner.qr.error.parse"));
      setScanning(false);
    }
  };

  // Handle scan errors
  const handleScanError = (error: any) => {
    console.error("QR code scanning error:", error);
    setError(t("scanner.qr.error.parse"));
    setScanning(false);
  };

  // Stop scanning
  const stopScanning = () => {
    if (scannerControls) {
      stopQRScanner(scannerControls);
      setScannerControls(null);
    }
    setScanning(false);
  };

  // Handle confirmation of scanned data
  const handleConfirm = () => {
    if (scannedData) {
      onScanComplete(scannedData);
      setScannedData(null);
      onClose();
    }
  };

  // Handle cancellation
  const handleCancel = () => {
    setScannedData(null);
    setError(null);
    onClose();
  };

  // Use sample data for testing
  const useSampleData = () => {
    const sampleProcedure = generateSampleProcedureQRCode();
    setScannedData(sampleProcedure);
  };

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (scanning) {
        stopScanning();
      }
      resetQRScanner();
    };
  }, [scanning]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle>{t("scanner.qr.title")}</DialogTitle>
          <DialogDescription>{t("scanner.qr.description")}</DialogDescription>
        </DialogHeader>

        {!scannedData ? (
          <div className="flex flex-col items-center">
            {scanning ? (
              <div className="relative w-full max-w-md mx-auto aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {/* Video element for camera feed */}
                <video
                  id="qr-video"
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                ></video>

                {/* Scanning overlay with targeting frame */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-blue-500 w-64 h-64 rounded-lg flex items-center justify-center">
                    <div className="animate-pulse text-blue-500">
                      <Camera size={48} />
                    </div>
                  </div>
                </div>

                {/* Hidden canvas for processing frames */}
                <canvas ref={canvasRef} className="hidden"></canvas>

                {/* Loading indicator */}
                <div className="absolute bottom-4 left-0 right-0 text-center text-sm font-medium text-gray-700">
                  {t("scanner.qr.scanning")}
                </div>

                {/* Refresh camera button */}
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2 opacity-70 hover:opacity-100"
                  onClick={() => {
                    stopScanning();
                    setTimeout(() => startScanning(), 500);
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  {t("scanner.qr.refresh")}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-6 py-8">
                <div className="rounded-full bg-gray-100 p-6">
                  <Camera size={48} className="text-gray-600" />
                </div>

                {error ? (
                  <Alert variant="destructive" className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{t("scanner.qr.error")}</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : (
                  <p className="text-center text-gray-600 max-w-md">
                    {t("scanner.qr.activate")}
                  </p>
                )}

                <div className="flex space-x-4">
                  <Button onClick={startScanning} className="flex items-center">
                    <Camera className="mr-2 h-4 w-4" />
                    {t("scanner.qr.start")}
                  </Button>
                  <Button variant="outline" onClick={useSampleData}>
                    <QrCode className="mr-2 h-4 w-4" />
                    {t("scanner.qr.sample")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle>{t("scanner.qr.scanned.title")}</CardTitle>
              <CardDescription>
                {t("scanner.qr.scanned.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    {t("scanner.qr.scanned.date")}
                  </h4>
                  <p>{scannedData.date}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    {t("scanner.qr.scanned.surgeon")}
                  </h4>
                  <p>{scannedData.surgeon}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    {t("scanner.qr.scanned.hospital")}
                  </h4>
                  <p>{scannedData.hospital}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    {t("scanner.qr.scanned.procedure")}
                  </h4>
                  <p>{scannedData.procedureType}</p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  {t("scanner.qr.scanned.implants")}
                </h4>
                <div className="space-y-4">
                  {scannedData.implants?.map((implant, index) => (
                    <div
                      key={implant.id || index}
                      className="bg-gray-50 p-3 rounded-md"
                    >
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium">
                            {t("scanner.qr.scanned.name")}
                          </span>{" "}
                          {implant.name}
                        </div>
                        <div>
                          <span className="font-medium">
                            {t("scanner.qr.scanned.manufacturer")}
                          </span>{" "}
                          {implant.manufacturer}
                        </div>
                        <div>
                          <span className="font-medium">
                            {t("scanner.qr.scanned.serial")}
                          </span>{" "}
                          {implant.serialNumber}
                        </div>
                        <div>
                          <span className="font-medium">
                            {t("scanner.qr.scanned.type")}
                          </span>{" "}
                          {implant.type}
                        </div>
                        <div>
                          <span className="font-medium">
                            {t("scanner.qr.scanned.location")}
                          </span>{" "}
                          {implant.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                {t("scanner.qr.cancel")}
              </Button>
              <Button onClick={handleConfirm}>
                <Check className="mr-2 h-4 w-4" />
                {t("scanner.qr.import")}
              </Button>
            </CardFooter>
          </Card>
        )}

        {scanning && (
          <DialogFooter>
            <Button variant="outline" onClick={stopScanning}>
              {t("scanner.qr.cancel")}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QRScanner;
