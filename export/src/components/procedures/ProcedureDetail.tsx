import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProcedures } from "../../context/ProcedureContext";
import { useLanguage } from "../../context/LanguageContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowLeft, Edit, Share, Trash2, QrCode } from "lucide-react";

// Import formatDateString from utils
import { formatDateString } from "../../lib/utils";
import { generateProcedureQRCode } from "../../lib/qrcode";

interface ImplantDetails {
  id: string;
  name: string;
  manufacturer: string;
  articleNumber: string;
  lotNumber: string;
  type: string;
  implantDate: string;
  notes?: string;
}

interface ProcedureData {
  id: string;
  procedureDate: string;
  procedureName: string;
  surgeon: string;
  hospital: string;
  notes?: string;
  implants: ImplantDetails[];
}

interface ProcedureDetailProps {
  procedure?: ProcedureData;
  onBack?: () => void;
  onEdit?: (id: string) => void;
  onExport?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ProcedureDetail = ({
  procedure = {
    id: "proc-123",
    procedureDate: "2023-05-15",
    procedureName: "Total Knee Replacement",
    surgeon: "Dr. Jane Smith",
    hospital: "Memorial Hospital",
    notes: "Patient recovered well with no complications.",
    implants: [
      {
        id: "imp-001",
        name: "Knee Prosthesis",
        manufacturer: "Zimmer Biomet",
        articleNumber: "ZB-12345-K",
        lotNumber: "ZB-12345-K",
        type: "Titanium Alloy",
        implantDate: "2023-05-15",
        notes: "Right knee replacement",
      },
      {
        id: "imp-002",
        name: "Patellar Component",
        manufacturer: "Zimmer Biomet",
        articleNumber: "ZB-67890-P",
        lotNumber: "ZB-67890-P",
        type: "Polyethylene",
        implantDate: "2023-05-15",
        notes: "Complementary to main prosthesis",
      },
    ],
  },
  onBack = () => console.log("Back clicked"),
  onEdit = (id) => console.log(`Edit procedure ${id}`),
  onExport = (id) => console.log(`Export procedure ${id}`),
  onDelete = (id) => console.log(`Delete procedure ${id}`),
}: ProcedureDetailProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProcedureById, deleteProcedure } = useProcedures();
  const { t } = useLanguage();
  const [currentProcedure, setCurrentProcedure] = useState(procedure);

  // Format date for display
  const formatDate = (dateString: string) => {
    return formatDateString(dateString);
  };

  useEffect(() => {
    const loadProcedure = async () => {
      if (id) {
        try {
          const foundProcedure = await getProcedureById(id);
          if (foundProcedure) {
            console.log("Found procedure:", foundProcedure);
            setCurrentProcedure(foundProcedure);
          } else {
            console.error("Procedure not found with ID:", id);
          }
        } catch (error) {
          console.error("Error loading procedure:", error);
        }
      }
    };

    loadProcedure();
  }, [id, getProcedureById]);

  // Navigation handlers
  const handleBackClick = () => {
    navigate(-1);
    onBack();
  };

  const handleEditClick = (procedureId: string) => {
    navigate(`/procedure/edit/${procedureId}`);
    onEdit(procedureId);
  };

  const handleExportClick = (procedureId: string) => {
    try {
      console.log("Exporting procedure:", procedureId);
      navigate(`/export/${procedureId}`);
      onExport(procedureId);
    } catch (error) {
      console.error("Error navigating to export:", error);
    }
  };

  // Direct QR code generation
  const handleDirectExport = async (procedureId: string) => {
    try {
      if (currentProcedure) {
        // Convert to the format expected by generateProcedureQRCode
        const procedureForQR = {
          id: currentProcedure.id,
          date: currentProcedure.procedureDate || currentProcedure.date || "",
          surgeon: currentProcedure.surgeon,
          hospital: currentProcedure.hospital,
          procedureType:
            currentProcedure.procedureName ||
            currentProcedure.procedureType ||
            "",
          notes: currentProcedure.notes,
          implants: currentProcedure.implants.map((imp) => ({
            ...imp,
            id:
              imp.id || `imp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            implantDate: imp.implantDate || "",
          })),
        };

        const qrCodeDataURL = await generateProcedureQRCode(procedureForQR);

        // Create a temporary link element to download the QR code
        const link = document.createElement("a");
        link.href = qrCodeDataURL;
        link.download = `implant-pass-procedure-${procedureId}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error generating QR code directly:", error);
      alert("Failed to generate QR code. Please try again.");
    }
  };

  const handleDeleteClick = (procedureId: string) => {
    deleteProcedure(procedureId);
    onDelete(procedureId);
    navigate("/");
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-background">
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={handleBackClick}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          {t("procedureDetail.back")}
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">
                {currentProcedure.procedureType ||
                  currentProcedure.procedureName}
              </CardTitle>
              <CardDescription className="mt-2">
                {formatDate(
                  currentProcedure.date || currentProcedure.procedureDate || "",
                )}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditClick(currentProcedure.id)}
                className="flex items-center gap-1"
              >
                <Edit size={14} />
                {t("procedureDetail.edit")}
              </Button>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportClick(currentProcedure.id)}
                  className="flex items-center gap-1"
                >
                  <Share size={14} />
                  {t("procedureDetail.export")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDirectExport(currentProcedure.id)}
                  className="flex items-center gap-1"
                >
                  <QrCode size={14} />
                  {t("procedureDetail.qr")}
                </Button>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteClick(currentProcedure.id)}
                className="flex items-center gap-1"
              >
                <Trash2 size={14} />
                {t("procedureDetail.delete")}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {t("procedureDetail.surgeon")}
              </h3>
              <p className="text-base">{currentProcedure.surgeon}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {t("procedureDetail.hospital")}
              </h3>
              <p className="text-base">{currentProcedure.hospital}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {t("procedureDetail.location")}
              </h3>
              <p className="text-base">
                {currentProcedure.location || t("procedureDetail.notSpecified")}
              </p>
            </div>
            {currentProcedure.side && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {t("procedureDetail.side")}
                </h3>
                <p className="text-base">{currentProcedure.side}</p>
              </div>
            )}
          </div>

          {currentProcedure.notes && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {t("procedureDetail.notes")}
              </h3>
              <p className="text-base">{currentProcedure.notes}</p>
            </div>
          )}

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">
              {t("procedureDetail.implants.title")}
            </h3>
            <div className="space-y-6">
              {(currentProcedure.implants || []).map((implant) => (
                <Card
                  key={implant.id}
                  className="overflow-hidden border-l-4 border-l-primary"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{implant.name}</CardTitle>
                      <Badge variant="outline">{implant.type}</Badge>
                    </div>
                    <CardDescription>
                      {implant.implantDate
                        ? formatDate(implant.implantDate)
                        : ""}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          {t("procedureDetail.manufacturer")}
                        </h4>
                        <p className="text-base">{implant.manufacturer}</p>
                      </div>
                      <div className="col-span-2">
                        <div className="flex flex-wrap gap-x-8 gap-y-2">
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">
                              {t("procedureDetail.articleNumber")}
                            </h4>
                            <p className="text-base font-mono">
                              {implant.articleNumber}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">
                              {t("procedureDetail.lotNumber")}
                            </h4>
                            <p className="text-base font-mono">
                              {implant.lotNumber}
                            </p>
                          </div>
                        </div>
                      </div>
                      {implant.notes && (
                        <div className="col-span-2">
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">
                            {t("procedureDetail.notes")}
                          </h4>
                          <p className="text-base">{implant.notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {t("procedureDetail.procedureId")} {currentProcedure.id}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProcedureDetail;
