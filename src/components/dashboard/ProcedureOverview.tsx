import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProcedures } from "../../context/ProcedureContext";
import { useLanguage } from "../../context/LanguageContext";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import {
  QrCode,
  ClipboardList,
  PlusCircle,
  Settings,
  Calendar,
  Database,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";

interface ProcedureOverviewProps {
  onScanQR?: () => void;
  onViewProcedures?: () => void;
  onManualEntry?: () => void;
  onSettings?: () => void;
}

const ProcedureOverview = ({
  onScanQR = () => console.log("Scan QR clicked"),
  onViewProcedures = () => console.log("View Procedures clicked"),
  onManualEntry = () => console.log("Manual Entry clicked"),
  onSettings = () => console.log("Settings clicked"),
}: ProcedureOverviewProps) => {
  const { t } = useLanguage();
  const { procedures } = useProcedures();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Sort procedures by date (newest first)
  const sortedProcedures = [...procedures].sort((a, b) => {
    const dateA = new Date(a.date || "");
    const dateB = new Date(b.date || "");
    return dateB.getTime() - dateA.getTime();
  });

  // Filter procedures based on search term
  const filteredProcedures = sortedProcedures.filter((procedure) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      (procedure.procedureType || "").toLowerCase().includes(searchLower) ||
      (procedure.hospital || "").toLowerCase().includes(searchLower) ||
      (procedure.surgeon || "").toLowerCase().includes(searchLower)
    );
  });

  const handleViewProcedure = (id: string) => {
    navigate(`/procedure/${id}`);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  const handleAddNew = () => {
    setShowAddDialog(true);
  };

  const handleManualEntryClick = () => {
    setShowAddDialog(false);
    onManualEntry();
  };

  const handleScanClick = () => {
    setShowAddDialog(false);
    onScanQR();
  };

  const handleExportGuide = () => {
    navigate("/export-guide");
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 bg-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <img
            src="/swiss-cross-logo.png"
            alt="Swiss Cross"
            className="h-8 w-8 mr-2"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "/swiss-cross-fallback.svg";
            }}
          />
          <h2 className="text-2xl font-bold">{t("dashboard.title")}</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onSettings}
          className="rounded-full"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Recent Procedures Timeline */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{t("dashboard.recent")}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewProcedures}
            className="text-sm"
          >
            {t("dashboard.viewAll")}
          </Button>
        </div>

        {filteredProcedures.length === 0 ? (
          <Card className="bg-gray-50">
            <CardContent className="p-4 text-center text-gray-500">
              <p>{t("dashboard.noProcedures")}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {filteredProcedures.slice(0, 5).map((procedure) => (
              <Card
                key={procedure.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleViewProcedure(procedure.id || "")}
              >
                <CardContent className="p-3">
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{procedure.procedureType}</h4>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{procedure.hospital}</span>
                        <span>{formatDate(procedure.date || "")}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {procedure.implants?.length || 0}{" "}
                        {procedure.implants?.length !== 1
                          ? t("dashboard.implants_plural")
                          : t("dashboard.implants")}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3">
        <Button
          onClick={handleAddNew}
          variant="outline"
          className="flex flex-col items-center justify-center h-24 py-2"
        >
          <PlusCircle className="h-6 w-6 mb-2 text-blue-600" />
          <span className="text-sm">{t("dashboard.addNew")}</span>
        </Button>

        <Button
          onClick={onViewProcedures}
          variant="outline"
          className="flex flex-col items-center justify-center h-24 py-2"
        >
          <ClipboardList className="h-6 w-6 mb-2 text-purple-600" />
          <span className="text-sm">{t("dashboard.allRecords")}</span>
        </Button>

        <Button
          onClick={handleExportGuide}
          variant="outline"
          className="flex flex-col items-center justify-center h-24 py-2"
        >
          <ExternalLink className="h-6 w-6 mb-2 text-orange-600" />
          <span className="text-sm">{t("dashboard.exportGuide")}</span>
        </Button>

        <Button
          onClick={onSettings}
          variant="outline"
          className="flex flex-col items-center justify-center h-24 py-2"
        >
          <Database className="h-6 w-6 mb-2 text-green-600" />
          <span className="text-sm">{t("dashboard.settings")}</span>
        </Button>
      </div>

      {/* Add Procedure Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("dashboard.addProcedure.title")}</DialogTitle>
            <DialogDescription>
              {t("dashboard.addProcedure.description")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <Button
              onClick={handleScanClick}
              className="flex flex-col items-center justify-center h-32 p-4"
              variant="outline"
            >
              <QrCode className="w-8 h-8 mb-2" />
              <span className="font-medium">
                {t("dashboard.addProcedure.scan")}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                {t("dashboard.addProcedure.scanDesc")}
              </span>
            </Button>

            <Button
              onClick={handleManualEntryClick}
              className="flex flex-col items-center justify-center h-32 p-4"
              variant="outline"
            >
              <PlusCircle className="w-8 h-8 mb-2" />
              <span className="font-medium">
                {t("dashboard.addProcedure.manual")}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                {t("dashboard.addProcedure.manualDesc")}
              </span>
            </Button>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              {t("dashboard.addProcedure.cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProcedureOverview;
