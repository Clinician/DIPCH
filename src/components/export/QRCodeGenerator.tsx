import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Download, QrCode, Share2, Copy, Check } from "lucide-react";
import {
  generateHipReplacementQRCode,
  qrCodeStructureDoc,
} from "../../lib/qrcode-generator";
import Base64Image from "../ui/base64-image";

const QRCodeGenerator: React.FC = () => {
  const { t } = useLanguage();
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"qrcode" | "structure">("qrcode");
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    generateSampleQRCode();
  }, []);

  const generateSampleQRCode = async () => {
    try {
      setLoading(true);
      const dataURL = await generateHipReplacementQRCode();
      setQrCodeDataURL(dataURL);
    } catch (error) {
      console.error("Error generating QR code:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQRCode = () => {
    if (qrCodeDataURL) {
      const link = document.createElement("a");
      link.href = qrCodeDataURL;
      link.download = "implant-pass-sample-qrcode.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShareQRCode = async () => {
    if (qrCodeDataURL && navigator.share) {
      try {
        const response = await fetch(qrCodeDataURL);
        const blob = await response.blob();
        const file = new File([blob], "implant-pass-sample-qrcode.png", {
          type: "image/png",
        });

        await navigator.share({
          title: "Implant Pass - Sample QR Code",
          text: "Scan this QR code to test the Implant Pass app.",
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

  const copyStructureToClipboard = () => {
    navigator.clipboard.writeText(qrCodeStructureDoc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">QR Code Testing Tools</h1>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "qrcode" | "structure")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="qrcode">Sample QR Code</TabsTrigger>
          <TabsTrigger value="structure">QR Code Structure</TabsTrigger>
        </TabsList>

        <TabsContent value="qrcode" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sample Hip Replacement QR Code</CardTitle>
              <CardDescription>
                Use this QR code to test the scanning functionality of the
                Implant Pass app. It contains a sample hip replacement procedure
                with multiple implants.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              {loading ? (
                <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-md">
                  <p className="text-muted-foreground">Generating QR Code...</p>
                </div>
              ) : qrCodeDataURL ? (
                <div className="border p-4 rounded-md bg-white">
                  <Base64Image
                    src={qrCodeDataURL}
                    alt="Sample QR Code"
                    className="w-64 h-64"
                  />
                </div>
              ) : (
                <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-md">
                  <p className="text-muted-foreground">QR Code not available</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center space-x-4">
              <Button onClick={generateSampleQRCode} disabled={loading}>
                <QrCode className="mr-2 h-4 w-4" />
                Regenerate
              </Button>
              <Button
                variant="outline"
                onClick={handleSaveQRCode}
                disabled={!qrCodeDataURL || loading}
              >
                <Download className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button
                onClick={handleShareQRCode}
                disabled={!qrCodeDataURL || loading || !navigator.share}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="structure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>QR Code Structure Documentation</CardTitle>
              <CardDescription>
                This documentation explains the structure of QR codes used by
                the Implant Pass app.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96 text-sm">
                  {qrCodeStructureDoc}
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={copyStructureToClipboard}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QRCodeGenerator;
