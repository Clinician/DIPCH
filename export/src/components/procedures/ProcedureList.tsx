import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  FileOutput,
  Trash2,
  Plus,
  Search,
  ArrowLeft,
  QrCode,
  Edit,
} from "lucide-react";
import { useProcedures } from "../../context/ProcedureContext";
import { useLanguage } from "../../context/LanguageContext";
import { generateProcedureQRCode } from "../../lib/qrcode";
import { formatDateString } from "../../lib/utils";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Implant {
  id: string;
  name: string;
  manufacturer: string;
  serialNumber: string;
  type: string;
  implantDate?: string;
}

interface Procedure {
  id: string;
  date: string;
  hospital: string;
  surgeon: string;
  procedureType: string;
  location?: string;
  side?: string;
  notes?: string;
  implants: Implant[];
}

interface ProcedureListProps {
  procedures?: Procedure[];
  onViewProcedure?: (id: string) => void;
  onExportProcedure?: (id: string) => void;
  onDeleteProcedure?: (id: string) => void;
  onAddProcedure?: () => void;
  onBack?: () => void;
}

const ProcedureList: React.FC<ProcedureListProps> = ({
  procedures = [
    {
      id: "1",
      date: "2023-05-15",
      hospital: "Memorial Hospital",
      surgeon: "Dr. Jane Smith",
      procedureType: "Hip Replacement",
      notes: "Successful procedure with no complications",
      implants: [
        {
          id: "imp1",
          name: "Titanium Hip Implant",
          manufacturer: "MedTech Solutions",
          serialNumber: "TH-12345-A",
          type: "Hip Prosthesis",
        },
        {
          id: "imp2",
          name: "Ceramic Femoral Head",
          manufacturer: "OrthoMed",
          serialNumber: "CF-98765-B",
          type: "Femoral Component",
        },
      ],
    },
    {
      id: "2",
      date: "2023-07-22",
      hospital: "City General Hospital",
      surgeon: "Dr. Robert Johnson",
      procedureType: "Knee Replacement",
      implants: [
        {
          id: "imp3",
          name: "Cobalt-Chrome Knee System",
          manufacturer: "JointPro",
          serialNumber: "KS-54321-C",
          type: "Total Knee Replacement",
        },
      ],
    },
    {
      id: "3",
      date: "2023-09-10",
      hospital: "University Medical Center",
      surgeon: "Dr. Sarah Williams",
      procedureType: "Spinal Fusion",
      notes: "Patient recovery progressing well",
      implants: [
        {
          id: "imp4",
          name: "Titanium Spinal Rod",
          manufacturer: "SpineTech",
          serialNumber: "SR-67890-D",
          type: "Spinal Fixation",
        },
        {
          id: "imp5",
          name: "Interbody Fusion Cage",
          manufacturer: "SpineTech",
          serialNumber: "IF-13579-E",
          type: "Interbody Device",
        },
      ],
    },
  ],
  onViewProcedure = (id) => console.log(`View procedure ${id}`),
  onExportProcedure = (id) => console.log(`Export procedure ${id}`),
  onDeleteProcedure = (id) => console.log(`Delete procedure ${id}`),
  onAddProcedure = () => console.log("Add new procedure"),
  onBack = () => console.log("Back clicked"),
}) => {
  const navigate = useNavigate();
  const { procedures: contextProcedures, deleteProcedure } = useProcedures();
  const { t } = useLanguage();
  const [localProcedures, setLocalProcedures] = useState(procedures);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [procedureToDelete, setProcedureToDelete] = useState<string | null>(
    null,
  );
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [procedureToExport, setProcedureToExport] = useState<string | null>(
    null,
  );
  const [qrLoading, setQrLoading] = useState<{ [key: string]: boolean }>({});

  // Add navigation handlers
  const handleViewClick = (id: string) => {
    navigate(`/procedure/${id}`);
    onViewProcedure(id);
  };

  const handleAddClick = () => {
    navigate("/procedure/new");
    onAddProcedure();
  };

  useEffect(() => {
    if (contextProcedures.length > 0) {
      setLocalProcedures(contextProcedures);
    }
  }, [contextProcedures]);

  // Filter procedures based on search term and sort by date (newest first)
  const filteredProcedures = localProcedures
    .filter((procedure) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        procedure.procedureType.toLowerCase().includes(searchLower) ||
        procedure.hospital.toLowerCase().includes(searchLower) ||
        procedure.surgeon.toLowerCase().includes(searchLower) ||
        procedure.date.includes(searchTerm)
      );
    })
    .sort((a, b) => {
      // Sort by date, newest first
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });

  const handleDeleteClick = (id: string) => {
    setProcedureToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (procedureToDelete) {
      try {
        await deleteProcedure(procedureToDelete);
        onDeleteProcedure(procedureToDelete);
        setProcedureToDelete(null);
        setDeleteDialogOpen(false);
      } catch (error) {
        console.error("Error deleting procedure:", error);
        alert("Failed to delete procedure. Please try again.");
      }
    }
  };

  const handleExportClick = (id: string) => {
    navigate(`/export/${id}`);
    onExportProcedure(id);
  };

  // Direct QR code generation without preview
  const handleDirectQR = async (procedure: Procedure) => {
    try {
      setQrLoading({ ...qrLoading, [procedure.id]: true });

      // Convert to the format expected by generateProcedureQRCode
      const procedureForQR = {
        id: procedure.id,
        date: procedure.date || "",
        surgeon: procedure.surgeon,
        hospital: procedure.hospital,
        procedureType: procedure.procedureType || "",
        notes: procedure.notes,
        implants: procedure.implants.map((imp) => ({
          ...imp,
          id: imp.id || `imp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          implantDate: imp.implantDate || "",
        })),
      };

      const qrCodeDataURL = await generateProcedureQRCode(procedureForQR);

      // Create a temporary link element to download the QR code
      const link = document.createElement("a");
      link.href = qrCodeDataURL;
      link.download = `implant-pass-procedure-${procedure.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating QR code directly:", error);
      alert("Failed to generate QR code. Please try again.");
    } finally {
      setQrLoading({ ...qrLoading, [procedure.id]: false });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="w-full h-full bg-background p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              navigate(-1);
              onBack();
            }}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{t("procedureList.title")}</h1>
        </div>
        <Button onClick={handleAddClick} className="flex items-center gap-2">
          <Plus size={16} />
          {t("procedureList.add")}
        </Button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder={t("procedureList.search")}
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredProcedures.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {t("procedureList.noProcedures")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProcedures.map((procedure) => (
            <Card key={procedure.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle>{procedure.procedureType}</CardTitle>
                <CardDescription>{formatDate(procedure.date)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">
                      {t("procedureList.hospital")}
                    </span>{" "}
                    {procedure.hospital}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("procedureList.surgeon")}
                    </span>{" "}
                    {procedure.surgeon}
                  </p>
                  {procedure.location && (
                    <p>
                      <span className="font-medium">
                        {t("procedureList.location")}
                      </span>{" "}
                      {procedure.location}
                      {procedure.side && ` (${procedure.side})`}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">
                      {t("procedureList.implants")}
                    </span>{" "}
                    {procedure.implants.length}
                  </p>
                  {procedure.notes && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      <span className="font-medium">
                        {t("procedureList.notes")}
                      </span>{" "}
                      {procedure.notes}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2 w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewClick(procedure.id)}
                    className="flex items-center gap-1"
                  >
                    <Eye size={16} />
                    {t("procedureList.view")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDirectQR(procedure)}
                    className="flex items-center gap-1"
                    disabled={qrLoading[procedure.id]}
                  >
                    <QrCode size={16} />
                    {qrLoading[procedure.id]
                      ? t("procedureList.generating")
                      : t("procedureList.qr")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportClick(procedure.id)}
                    className="flex items-center gap-1"
                  >
                    <FileOutput size={16} />
                    {t("procedureList.export")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/procedure/edit/${procedure.id}`)}
                    className="flex items-center gap-1"
                  >
                    <Edit size={16} />
                    {t("procedureList.edit")}
                  </Button>
                </div>
                <div className="flex justify-end w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(procedure.id)}
                    className="flex items-center gap-1 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                  >
                    <Trash2 size={16} />
                    {t("procedureList.delete")}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("procedureList.deleteConfirm.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("procedureList.deleteConfirm.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("procedureList.deleteConfirm.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              {t("procedureList.deleteConfirm.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProcedureList;
