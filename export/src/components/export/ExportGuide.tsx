import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import QRCodeGenerator from "./QRCodeGenerator";
import AppStoreGuide from "./AppStoreGuide";

const ExportGuide: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">{t("export.guide.title")}</h1>

        <Tabs defaultValue="qrcode" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="qrcode">{t("export.guide.qr")}</TabsTrigger>
            <TabsTrigger value="appstore">
              {t("export.guide.appstore")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="qrcode">
            <QRCodeGenerator />
          </TabsContent>

          <TabsContent value="appstore">
            <AppStoreGuide />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ExportGuide;
