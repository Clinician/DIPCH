import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProcedures, ProcedureData } from "../../context/ProcedureContext";
import { useLanguage } from "../../context/LanguageContext";
import { QrCode, Download, Share2, ArrowLeft } from "lucide-react";
import { formatDateString } from "../../lib/utils";
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  generateProcedureQRCode,
  generateAllProceduresQRCode,
} from "../../lib/qrcode";

interface ExportOptionsProps {
  procedureId?: string;
  onBack?: () => void;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({
  procedureId,
  onBack = () => {},
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { procedures, getProcedureById } = useProcedures();
  const { t } = useLanguage();
  const [currentProcedure, setCurrentProcedure] =
    useState<ProcedureData | null>(null);
  const [activeTab, setActiveTab] = useState("single");
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [qrType, setQrType] = useState<"single" | "all">("single");
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load procedure data
  useEffect(() => {
    const loadProcedure = async () => {
      try {
        const idToUse = id || procedureId;
        if (idToUse) {
          const foundProcedure = await getProcedureById(idToUse);
          if (foundProcedure) {
            setCurrentProcedure(foundProcedure);
          }
        }
      } catch (error) {
        console.error("Error loading procedure:", error);
        setError("Failed to load procedure data");
      }
    };

    loadProcedure();
  }, [id, procedureId, getProcedureById]);

  // Navigation handler
  const handleBackClick = () => {
    onBack();
    if (navigate) {
      navigate(-1);
    }
  };

  // Generate QR code and show dialog directly
  const handleGenerateQR = async (type: "single" | "all") => {
    try {
      setLoading(true);
      setError(null);
      setQrType(type);
      setShowQRDialog(true); // Show dialog immediately with loading state

      let dataURL = "";
      if (type === "single" && currentProcedure) {
        console.log("Generating QR for procedure:", currentProcedure);
        dataURL = await generateProcedureQRCode(currentProcedure);
      } else if (type === "all") {
        console.log("Generating QR for all procedures:", procedures);
        dataURL = await generateAllProceduresQRCode(procedures);
      }

      if (!dataURL) {
        throw new Error("Failed to generate QR code - empty data URL");
      }

      setQrCodeDataURL(dataURL);
    } catch (error) {
      console.error("Error generating QR code:", error);
      setError(
        "Failed to generate QR code: " +
          (error instanceof Error ? error.message : String(error)),
      );
      setShowQRDialog(false); // Close dialog on error
    } finally {
      setLoading(false);
    }
  };

  // Direct download without preview
  const handleDirectDownload = async (type: "single" | "all") => {
    try {
      setLoading(true);
      setError(null);

      let dataURL = "";
      if (type === "single" && currentProcedure) {
        dataURL = await generateProcedureQRCode(currentProcedure);
      } else if (type === "all") {
        dataURL = await generateAllProceduresQRCode(procedures);
      }

      if (!dataURL) {
        throw new Error("Failed to generate QR code");
      }

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `implant-pass-${type === "single" ? "procedure" : "all"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating QR code:", error);
      setError(
        "Failed to generate QR code: " +
          (error instanceof Error ? error.message : String(error)),
      );
    } finally {
      setLoading(false);
    }
  };

  // Save QR code to photos
  const handleSaveToPhotos = () => {
    if (qrCodeDataURL) {
      // Create a temporary link element
      const link = document.createElement("a");
      link.href = qrCodeDataURL;
      link.download = `implant-pass-${qrType === "single" ? "procedure" : "all"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Share QR code
  const handleShare = async () => {
    if (qrCodeDataURL && navigator.share) {
      try {
        // Convert data URL to blob
        const response = await fetch(qrCodeDataURL);
        const blob = await response.blob();
        const file = new File(
          [blob],
          `implant-pass-${qrType === "single" ? "procedure" : "all"}.png`,
          { type: "image/png" },
        );

        await navigator.share({
          title: `Implant Pass - ${qrType === "single" ? "Procedure" : "All Procedures"} QR Code`,
          text: `Scan this QR code to access ${qrType === "single" ? "procedure" : "procedures"} data.`,
          files: [file],
        });
      } catch (error) {
        console.error("Error sharing QR code:", error);
        alert("Sharing failed. Your browser may not support this feature.");
      }
    } else {
      alert("Sharing is not supported on this device.");
    }
  };

  if (!currentProcedure && activeTab === "single") {
    return (
      <div className="bg-background p-4 h-full w-full flex flex-col">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackClick}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{t("export.title")}</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">{error || t("export.error")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background p-4 h-full w-full flex flex-col">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBackClick}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{t("export.title")}</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="single" className="flex-1">
            {t("export.single")}
          </TabsTrigger>
          <TabsTrigger value="all" className="flex-1">
            {t("export.all")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("export.single.title")}</CardTitle>
              <CardDescription>
                {t("export.single.description")}{" "}
                {currentProcedure?.procedureType}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  {t("export.single.date")}{" "}
                  {currentProcedure?.date
                    ? formatDateString(currentProcedure.date)
                    : ""}
                </p>
                <p className="text-sm">
                  {t("export.single.hospital")} {currentProcedure?.hospital}
                </p>
                <p className="text-sm">
                  {t("export.single.surgeon")} {currentProcedure?.surgeon}
                </p>
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">
                    {t("export.single.implants")}
                  </h4>
                  <ul className="space-y-2">
                    {currentProcedure?.implants.map((implant) => (
                      <li
                        key={implant.id}
                        className="text-sm border p-2 rounded-md"
                      >
                        <p className="font-medium">{implant.name}</p>
                        <p>
                          {t("export.single.manufacturer")}{" "}
                          {implant.manufacturer}
                        </p>
                        <p>
                          {t("export.single.article")} {implant.articleNumber}
                        </p>
                        <p>
                          {t("export.single.lot")} {implant.lotNumber}
                        </p>
                        <p>
                          {t("export.single.type")} {implant.type}
                        </p>
                        {implant.location && (
                          <p>
                            {t("export.single.location")} {implant.location}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button
                onClick={() => handleGenerateQR("single")}
                className="w-full"
                disabled={loading || !currentProcedure}
              >
                {loading ? (
                  t("export.generating")
                ) : (
                  <>
                    <QrCode className="mr-2 h-4 w-4" />
                    {t("export.preview")}
                  </>
                )}
              </Button>
              <Button
                onClick={() => handleDirectDownload("single")}
                variant="outline"
                className="w-full"
                disabled={loading || !currentProcedure}
              >
                <Download className="mr-2 h-4 w-4" />
                {t("export.download")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("export.all.title")}</CardTitle>
              <CardDescription>{t("export.all.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 border border-dashed rounded-md flex items-center justify-center flex-col">
                <QrCode className="h-16 w-16 text-muted-foreground mb-2" />
                <p className="text-center text-sm text-muted-foreground">
                  {t("export.all.info")}
                  <br />
                  {t("export.all.compatible")}
                </p>
                <p className="text-center text-sm font-medium mt-4">
                  {procedures.length}{" "}
                  {procedures.length !== 1
                    ? t("export.all.count_plural")
                    : t("export.all.count")}{" "}
                  {t("export.all.included")}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button
                onClick={() => handleGenerateQR("all")}
                className="w-full"
                disabled={loading || procedures.length === 0}
              >
                {loading ? (
                  t("export.generating")
                ) : (
                  <>
                    <QrCode className="mr-2 h-4 w-4" />
                    {t("export.all.preview")}
                  </>
                )}
              </Button>
              <Button
                onClick={() => handleDirectDownload("all")}
                variant="outline"
                className="w-full"
                disabled={loading || procedures.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                {t("export.download")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {qrType === "single" ? t("export.qr.single") : t("export.qr.all")}
            </DialogTitle>
            <DialogDescription>
              {t("export.qr.access")}{" "}
              {qrType === "single"
                ? t("export.qr.procedure")
                : t("export.qr.procedures")}{" "}
              {t("export.qr.data")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center p-6">
            <div className="border p-4 rounded-md bg-white">
              {loading ? (
                <div className="w-64 h-64 flex items-center justify-center bg-gray-100">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    <p className="text-muted-foreground">
                      {t("export.qr.generating")}
                    </p>
                  </div>
                </div>
              ) : qrCodeDataURL ? (
                <img src={qrCodeDataURL} alt="QR Code" className="w-64 h-64" />
              ) : (
                <div className="w-64 h-64 flex items-center justify-center bg-gray-100">
                  <p className="text-muted-foreground">
                    {t("export.qr.unavailable")}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex space-x-2 justify-center">
            <Button
              variant="outline"
              onClick={handleSaveToPhotos}
              disabled={!qrCodeDataURL}
            >
              <Download className="mr-2 h-4 w-4" />
              {t("export.qr.save")}
            </Button>
            <Button
              onClick={handleShare}
              disabled={!qrCodeDataURL || !navigator.share}
            >
              <Share2 className="mr-2 h-4 w-4" />
              {t("export.qr.share")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExportOptions;
