import React from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { QrCode, ClipboardList, PlusCircle } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

interface ActionButtonsProps {
  onScanQR?: () => void;
  onViewProcedures?: () => void;
  onManualEntry?: () => void;
}

const ActionButtons = ({
  onScanQR = () => console.log("Scan QR clicked"),
  onViewProcedures = () => console.log("View Procedures clicked"),
  onManualEntry = () => console.log("Manual Entry clicked"),
}: ActionButtonsProps) => {
  const { t } = useLanguage();
  return (
    <div className="w-full max-w-5xl mx-auto p-4 bg-white">
      <h2 className="text-2xl font-bold text-center mb-6">
        {t("dashboard.whatToDo")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <QrCode className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {t("actions.scanQR.title")}
          </h3>
          <p className="text-gray-500 mb-4">
            {t("actions.scanQR.description")}
          </p>
          <Button
            onClick={onScanQR}
            className="mt-auto w-full bg-blue-600 hover:bg-blue-700"
          >
            {t("actions.scanQR.button")}
          </Button>
        </Card>

        <Card className="p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
          <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
            <ClipboardList className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {t("actions.viewProcedures.title")}
          </h3>
          <p className="text-gray-500 mb-4">
            {t("actions.viewProcedures.description")}
          </p>
          <Button
            onClick={onViewProcedures}
            className="mt-auto w-full bg-purple-600 hover:bg-purple-700"
          >
            {t("actions.viewProcedures.button")}
          </Button>
        </Card>

        <Card className="p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <PlusCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {t("actions.manualEntry.title")}
          </h3>
          <p className="text-gray-500 mb-4">
            {t("actions.manualEntry.description")}
          </p>
          <Button
            onClick={onManualEntry}
            className="mt-auto w-full bg-green-600 hover:bg-green-700"
          >
            {t("actions.manualEntry.button")}
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default ActionButtons;
